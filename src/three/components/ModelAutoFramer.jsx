import React, { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ModelAutoFramer — Robust 3D Model Framing & Default State Manager
 * 
 * Features:
 * 1. Accurately measures the bounding box strictly from authentic 3D anatomical/mesh geometries
 *    (strictly excluding landmark pins, helper spheres, and UI badges).
 * 2. Positions camera directly along the optical normal axis to eliminate tilt clipping.
 * 3. Accounts for container aspect ratio, camera FOV, model width, height, and depth.
 * 4. Updates OrbitControls target to the exact visual center of the model.
 * 5. Saves state so native OrbitControls and Reset button restore the exact fitted view.
 * 6. Emits onModelFramed so parent viewers (AnatomyCanvas, BiologyChapterDetail, LoginSpatialCanvas)
 *    can store and restore the exact model-fitted default view.
 */
export default function ModelAutoFramer({
    children,
    modelKey,
    controlsRef,
    padding = 1.25,
    offsetY = 0,
    actionCueActive = false,
    onModelFramed
}) {
    const contentRef = useRef();
    const { camera, size } = useThree();
    const isFramedRef = useRef(false);
    const fittedStateRef = useRef({});
    const prevSizeRef = useRef({ width: 0, height: 0 });

    // Reset framed flag when model changes
    useEffect(() => {
        isFramedRef.current = false;
    }, [modelKey]);

    const calculateFittedView = useCallback(() => {
        if (!contentRef.current) return null;

        contentRef.current.updateWorldMatrix(true, true);

        // Calculate bounding box strictly from visible anatomical 3D Mesh elements
        const box = new THREE.Box3();
        let meshCount = 0;

        contentRef.current.traverse((child) => {
            if (child.isMesh && child.visible && child.geometry) {
                // Ignore landmark pin spheres, UI helpers, and non-anatomical markers
                if (child.userData?.isPin || child.name?.startsWith("pin_") || child.name?.startsWith("helper_")) {
                    return;
                }
                // Pin spheres use radius <= 0.08
                if (child.geometry.type === "SphereGeometry" && child.geometry.parameters?.radius <= 0.08) {
                    return;
                }

                // Ensure child world matrix is up to date
                child.updateWorldMatrix(true, false);
                box.expandByObject(child);
                meshCount++;
            }
        });

        // Fallback to entire object if no mesh found or box empty
        if (meshCount === 0 || box.isEmpty() || !isFinite(box.min.x)) {
            box.setFromObject(contentRef.current);
            if (box.isEmpty() || !isFinite(box.min.x)) return null;
        }

        const boxSize = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
        if (maxDim <= 0.001) return null;

        const fov = camera.fov || 45;
        const currentW = Math.max(size.width, 1);
        const currentH = Math.max(size.height, 1);
        const aspect = currentW / currentH;
        const fovRad = (fov * Math.PI) / 180;

        // Frustum distance required to fit vertical height and horizontal width with margin
        const distHeight = (boxSize.y / 2) / Math.tan(fovRad / 2);
        const distWidth = (boxSize.x / 2) / (Math.tan(fovRad / 2) * aspect);
        
        // Base distance covering bounding volume with optimal screen utilization
        const baseDist = Math.max(distHeight, distWidth);
        const depthOffset = (boxSize.z / 2) * 0.4;

        // Model-specific padding adjustments (ensuring 75-82% viewport coverage)
        const modelPadding = modelKey === "Respiratory" || modelKey === "Skeleton"
            ? Math.max(padding, 1.18)
            : Math.max(padding, 1.08);
        const targetDist = Math.max((baseDist + depthOffset) * modelPadding, 1.8);

        // Normal-axis camera position: centered directly in front of boxCenter
        const fittedCameraPos = [
            boxCenter.x,
            boxCenter.y + offsetY,
            boxCenter.z + targetDist
        ];

        const fittedTarget = [
            boxCenter.x,
            boxCenter.y + offsetY,
            boxCenter.z
        ];

        return {
            cameraPosition: fittedCameraPos,
            target: fittedTarget,
            distance: targetDist,
            boxSize,
            boxCenter
        };
    }, [camera.fov, size.width, size.height, padding, offsetY, modelKey]);

    const applyFraming = useCallback((force = false) => {
        if (!force && actionCueActive) return;

        const fit = calculateFittedView();
        if (!fit) return;

        fittedStateRef.current = fit;

        // Apply camera parameters
        camera.position.set(...fit.cameraPosition);
        camera.near = Math.min(0.05, fit.distance * 0.02);
        camera.far = Math.max(120, fit.distance * 25);
        camera.updateProjectionMatrix();

        // Update OrbitControls and its internal camera reference
        if (controlsRef && controlsRef.current) {
            if (controlsRef.current.object) {
                controlsRef.current.object.position.set(...fit.cameraPosition);
            }
            controlsRef.current.target.set(...fit.target);
            controlsRef.current.minDistance = Math.max(0.5, fit.distance * 0.2);
            controlsRef.current.maxDistance = Math.max(25, fit.distance * 4.0);
            controlsRef.current.update();

            // Save state so native controls.reset() restores this exact fitted view
            if (typeof controlsRef.current.saveState === "function") {
                controlsRef.current.saveState();
            }
        }

        isFramedRef.current = true;

        if (onModelFramed) {
            onModelFramed({
                modelKey,
                cameraPosition: fit.cameraPosition,
                cameraTarget: fit.target,
                distance: fit.distance
            });
        }
    }, [actionCueActive, calculateFittedView, camera, controlsRef, modelKey, onModelFramed]);

    // Initial pass: wait until geometry is loaded into scene graph
    useFrame(() => {
        if (!isFramedRef.current && !actionCueActive) {
            applyFraming();
        }
    });

    // Reframe on resize or model change, especially when layout expands from initial mount
    useEffect(() => {
        const heightChangedSignificantly = Math.abs(size.height - prevSizeRef.current.height) > 40;
        const widthChangedSignificantly = Math.abs(size.width - prevSizeRef.current.width) > 40;
        prevSizeRef.current = { width: size.width, height: size.height };

        if (heightChangedSignificantly || widthChangedSignificantly || !isFramedRef.current) {
            isFramedRef.current = false;
            applyFraming();
        }
    }, [size.width, size.height, modelKey, applyFraming]);

    return (
        <group ref={contentRef}>
            {children}
        </group>
    );
}

