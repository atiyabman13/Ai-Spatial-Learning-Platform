#!/usr/bin/env python3
"""
Modular 3D Geometric & Volumetric Reconstruction Engine for AI Spatial Platform
Generates genuine 3D watertight GLB (glTF 2.0 binary) models from arbitrary 2D images.
Features:
- Deterministic classical computer vision background isolation
- Border-connected flood fill preventing erosion of internal light structures
- Active-quad silhouette triangulation (eliminating unwanted rectangular background slabs)
- Watertight silhouette perimeter seam closure
- Embedded RGBA PBR texture with alpha mask transparency
- Works 100% offline on local CPU without external cloud APIs or GPU dependencies
"""

import sys
import os
import io
import json
import struct
import math
import numpy as np
from PIL import Image, ImageFilter, ImageOps
import scipy.ndimage as ndimage

def classify_subject(img_rgb, gray_arr):
    """
    Classify the uploaded image into Diagram, Technical Drawing, Scientific Illustration, or Photograph.
    """
    r, g, b = img_rgb.split()
    r_arr = np.array(r, dtype=np.float32)
    g_arr = np.array(g, dtype=np.float32)
    b_arr = np.array(b, dtype=np.float32)
    
    color_diff = np.mean(np.abs(r_arr - g_arr) + np.abs(g_arr - b_arr))
    
    edges = ndimage.sobel(gray_arr)
    edge_density = np.mean(np.abs(edges) > 30)
    white_bg_ratio = np.mean(gray_arr > 235)
    
    if white_bg_ratio > 0.35 and edge_density > 0.07:
        if color_diff < 15:
            subject_type = "Technical Schematic / Blueprint"
        else:
            subject_type = "Scientific Diagram / Illustration"
    elif color_diff > 25 and white_bg_ratio < 0.25:
        subject_type = "Natural Photograph / Physical Object"
    elif edge_density > 0.10:
        subject_type = "Scientific Illustration"
    else:
        subject_type = "Graphic Illustration"
        
    return {
        "subjectType": subject_type,
        "edgeDensity": float(edge_density),
        "colorVariance": float(color_diff),
        "whiteBackgroundRatio": float(white_bg_ratio)
    }

def segment_foreground(orig_img):
    """
    Isolate the foreground subject from the background using deterministic computer vision.
    Handles:
    - Transparent PNGs (direct alpha channel preservation)
    - Uniform white, grey, black, and colored backdrops
    - Uneven background lighting/gradients
    - Protects interior light regions in diagrams via border-connected flood-fill
    - Preserves thin lines/components using gradient edge detection
    - Safe fallback to central soft vignette if segmentation is ambiguous
    """
    orig_w, orig_h = orig_img.size

    # 1. Check for alpha channel in original image (Transparent PNG / WebP)
    if orig_img.mode in ('RGBA', 'LA') or 'transparency' in orig_img.info:
        rgba = orig_img.convert('RGBA')
        alpha_arr = np.array(rgba)[:, :, 3]
        if np.any(alpha_arr < 240) and np.mean(alpha_arr > 20) > 0.04:
            fg_mask = (alpha_arr > 30).astype(np.float32)
            fg_mask = ndimage.gaussian_filter(fg_mask, sigma=0.8)
            return np.clip(fg_mask, 0.0, 1.0), "Transparent Alpha Channel", "Existing Alpha Transparency"

    # 2. Opaque image analysis in RGB
    rgb_img = orig_img.convert('RGB')
    arr = np.array(rgb_img, dtype=np.float32)
    h, w, _ = arr.shape

    # Sample corners (up to 15x15)
    cs = max(4, min(16, h // 8, w // 8))
    c_tl = arr[:cs, :cs].reshape(-1, 3)
    c_tr = arr[:cs, -cs:].reshape(-1, 3)
    c_bl = arr[-cs:, :cs].reshape(-1, 3)
    c_br = arr[-cs:, -cs:].reshape(-1, 3)
    
    corner_pixels = np.concatenate([c_tl, c_tr, c_bl, c_br], axis=0)
    corner_median = np.median(corner_pixels, axis=0)
    corner_std = np.std(corner_pixels, axis=0)

    # Sample outer perimeter border (2 pixels wide)
    border_pixels = np.concatenate([
        arr[0:2, :].reshape(-1, 3),
        arr[-2:, :].reshape(-1, 3),
        arr[:, 0:2].reshape(-1, 3),
        arr[:, -2:].reshape(-1, 3)
    ], axis=0)
    border_median = np.median(border_pixels, axis=0)

    # Distance to corner median and border median
    diff_border = np.sqrt(np.sum((arr - border_median)**2, axis=2))
    diff_corners = np.sqrt(np.sum((arr - corner_median)**2, axis=2))
    diff_min = np.minimum(diff_border, diff_corners)

    # Grayscale for spatial gradient calculation
    gray = np.mean(arr, axis=2)
    grad_y = ndimage.sobel(gray, axis=0)
    grad_x = ndimage.sobel(gray, axis=1)
    grad_mag = np.hypot(grad_x, grad_y)

    # Adaptive threshold based on background variance
    avg_std = np.mean(corner_std)
    diff_thresh = max(24.0, min(55.0, avg_std * 1.8 + 20.0))

    # Initial candidate background pixels
    bg_candidate = (diff_min < diff_thresh) & (grad_mag < 45.0)

    # Label connected components of background candidates
    labeled, num_features = ndimage.label(bg_candidate)

    if num_features > 0:
        border_mask = np.zeros((h, w), dtype=bool)
        border_mask[0, :] = True
        border_mask[-1, :] = True
        border_mask[:, 0] = True
        border_mask[:, -1] = True

        touching_labels = np.unique(labeled[border_mask])
        touching_labels = touching_labels[touching_labels > 0]

        # Only regions connected to the border are actual background!
        # This protects internal white/light structures inside the subject
        real_bg = np.isin(labeled, touching_labels)
        raw_fg = ~real_bg
    else:
        raw_fg = np.ones((h, w), dtype=bool)

    # Preserve thin lines, wires, pointers, and high-contrast edges
    strong_edges = grad_mag > np.percentile(grad_mag, 82)
    inner_mask = np.zeros((h, w), dtype=bool)
    pad = 4
    if h > 2 * pad and w > 2 * pad:
        inner_mask[pad:-pad, pad:-pad] = True
    strong_edges = strong_edges & inner_mask

    raw_fg = raw_fg | strong_edges

    # Morphological cleanup
    fg_filled = ndimage.binary_fill_holes(raw_fg)
    fg_clean = ndimage.binary_opening(fg_filled, structure=np.ones((2, 2)))

    coverage = np.mean(fg_clean)
    method_used = "Border-Connected Color & Gradient Segmentation"

    # Safe fallback if segmentation failed (too little or too much detected)
    if coverage < 0.03 or coverage > 0.97:
        y_grid, x_grid = np.ogrid[:h, :w]
        cx, cy = w / 2.0, h / 2.0
        vignette = 1.0 - ((x_grid - cx)**2 / (cx*1.08)**2 + (y_grid - cy)**2 / (cy*1.08)**2)
        fg_mask = np.clip(vignette, 0.0, 1.0)
        method_used = "Safe Fallback Vignette (Low Contrast / Frame-Filling Subject)"
    else:
        fg_mask = ndimage.gaussian_filter(fg_clean.astype(np.float32), sigma=1.0)
        fg_mask = np.clip(fg_mask, 0.0, 1.0)

    bg_info = f"RGB: [{int(border_median[0])}, {int(border_median[1])}, {int(border_median[2])}]"
    return fg_mask, method_used, bg_info

def detect_structural_regions(fg_mask, gray_arr, orig_w, orig_h, num_regions=6):
    """
    Detect major structural contours and component centroids across the foreground subject.
    """
    h, w = gray_arr.shape
    binary = (fg_mask > 0.35).astype(np.uint8)
        
    labeled, num_features = ndimage.label(binary)
    if num_features == 0:
        return []
        
    sizes = ndimage.sum(binary, labeled, range(1, num_features + 1))
    sorted_indices = np.argsort(sizes)[::-1]
    
    regions = []
    count = 0
    for idx in sorted_indices:
        if count >= num_regions:
            break
        label_id = idx + 1
        mask = (labeled == label_id)
        area = sizes[idx]
        if area < (h * w * 0.005):
            continue
            
        y_indices, x_indices = np.where(mask)
        if len(y_indices) == 0:
            continue
            
        min_x, max_x = int(np.min(x_indices)), int(np.max(x_indices))
        min_y, max_y = int(np.min(y_indices)), int(np.max(y_indices))
        center_x = float(np.mean(x_indices)) / w * 100.0
        center_y = float(np.mean(y_indices)) / h * 100.0
        
        bbox = [
            round(float(min_x) / w * 100.0, 1),
            round(float(min_y) / h * 100.0, 1),
            round(float(max_x) / w * 100.0, 1),
            round(float(max_y) / h * 100.0, 1)
        ]
        
        regions.append({
            "id": f"region_{count + 1}",
            "label": f"Component Region {count + 1}",
            "center": [round(center_x, 1), round(center_y, 1)],
            "bbox": bbox,
            "relativeArea": round(float(area) / (h * w) * 100.0, 2),
            "status": "auto_detected"
        })
        count += 1
        
    return regions

def create_glb_binary(vertices, normals, uvs, indices, texture_bytes, is_png=True):
    """
    Pack geometry and texture into a valid glTF 2.0 Binary (.glb) format with alpha mask support.
    """
    num_verts = len(vertices) // 3
    num_indices = len(indices)
    
    # 1. Format vertex data
    pos_bytes = struct.pack(f'<{len(vertices)}f', *vertices)
    norm_bytes = struct.pack(f'<{len(normals)}f', *normals)
    uv_bytes = struct.pack(f'<{len(uvs)}f', *uvs)
    
    if num_verts > 65530:
        index_format = 'I'
        index_comp_type = 5125  # UNSIGNED_INT
        index_stride = 4
    else:
        index_format = 'H'
        index_comp_type = 5123  # UNSIGNED_SHORT
        index_stride = 2
        
    index_bytes = struct.pack(f'<{num_indices}{index_format}', *indices)
    pad_idx = (4 - (len(index_bytes) % 4)) % 4
    index_bytes += b'\x00' * pad_idx

    pos_arr = np.array(vertices).reshape(-1, 3)
    min_pos = pos_arr.min(axis=0).tolist()
    max_pos = pos_arr.max(axis=0).tolist()
    
    tex_pad = (4 - (len(texture_bytes) % 4)) % 4
    texture_bytes_padded = texture_bytes + b'\x00' * tex_pad
    
    offset_pos = 0
    len_pos = len(pos_bytes)
    
    offset_norm = offset_pos + len_pos
    len_norm = len(norm_bytes)
    
    offset_uv = offset_norm + len_norm
    len_uv = len(uv_bytes)
    
    offset_idx = offset_uv + len_uv
    len_idx = len(index_bytes)
    
    offset_tex = offset_idx + len_idx
    len_tex = len(texture_bytes_padded)
    
    total_bin_length = offset_tex + len_tex
    bin_buffer = pos_bytes + norm_bytes + uv_bytes + index_bytes + texture_bytes_padded
    
    mime_type = "image/png" if is_png else "image/jpeg"

    gltf_dict = {
        "asset": {
            "version": "2.0",
            "generator": "AI Spatial Platform Subject-Isolated 3D Geometric Engine"
        },
        "scenes": [{"nodes": [0]}],
        "scene": 0,
        "nodes": [{"mesh": 0, "name": "Isolated3DSubject"}],
        "meshes": [{
            "name": "SubjectMesh",
            "primitives": [{
                "attributes": {
                    "POSITION": 0,
                    "NORMAL": 1,
                    "TEXCOORD_0": 2
                },
                "indices": 3,
                "material": 0,
                "mode": 4  # TRIANGLES
            }]
        }],
        "materials": [{
            "name": "SubjectPBRMaterial",
            "pbrMetallicRoughness": {
                "baseColorTexture": {"index": 0},
                "metallicFactor": 0.1,
                "roughnessFactor": 0.6
            },
            "alphaMode": "MASK",
            "alphaCutoff": 0.25,
            "doubleSided": True
        }],
        "textures": [{"source": 0, "sampler": 0}],
        "images": [{"bufferView": 4, "mimeType": mime_type, "name": "SubjectTexture"}],
        "samplers": [{
            "magFilter": 9729,  # LINEAR
            "minFilter": 9987,  # LINEAR_MIPMAP_LINEAR
            "wrapS": 33071,     # CLAMP_TO_EDGE
            "wrapT": 33071      # CLAMP_TO_EDGE
        }],
        "accessors": [
            {
                "bufferView": 0,
                "byteOffset": 0,
                "componentType": 5126,  # FLOAT
                "count": num_verts,
                "type": "VEC3",
                "max": max_pos,
                "min": min_pos
            },
            {
                "bufferView": 1,
                "byteOffset": 0,
                "componentType": 5126,  # FLOAT
                "count": num_verts,
                "type": "VEC3"
            },
            {
                "bufferView": 2,
                "byteOffset": 0,
                "componentType": 5126,  # FLOAT
                "count": num_verts,
                "type": "VEC2"
            },
            {
                "bufferView": 3,
                "byteOffset": 0,
                "componentType": index_comp_type,
                "count": num_indices,
                "type": "SCALAR"
            }
        ],
        "bufferViews": [
            {
                "buffer": 0,
                "byteOffset": offset_pos,
                "byteLength": len_pos,
                "target": 34962
            },
            {
                "buffer": 0,
                "byteOffset": offset_norm,
                "byteLength": len_norm,
                "target": 34962
            },
            {
                "buffer": 0,
                "byteOffset": offset_uv,
                "byteLength": len_uv,
                "target": 34962
            },
            {
                "buffer": 0,
                "byteOffset": offset_idx,
                "byteLength": len_idx,
                "target": 34963
            },
            {
                "buffer": 0,
                "byteOffset": offset_tex,
                "byteLength": len_tex
            }
        ],
        "buffers": [{
            "byteLength": len(bin_buffer)
        }]
    }
    
    json_bytes = json.dumps(gltf_dict, separators=(',', ':')).encode('utf-8')
    pad_json = (4 - (len(json_bytes) % 4)) % 4
    json_bytes += b' ' * pad_json
    
    total_length = 12 + 8 + len(json_bytes) + 8 + len(bin_buffer)
    header = struct.pack('<4sII', b'glTF', 2, total_length)
    
    chunk0 = struct.pack('<II', len(json_bytes), 0x4E4F534A) + json_bytes
    chunk1 = struct.pack('<II', len(bin_buffer), 0x004E4942) + bin_buffer
    
    return header + chunk0 + chunk1

def reconstruct_3d(image_path, output_glb_path, grid_res=110, depth_scale=0.55):
    """
    Main geometric reconstruction algorithm:
    1. Preprocesses image and isolates foreground subject.
    2. Removes unwanted background areas.
    3. Builds 3D mesh strictly following subject silhouette.
    4. Automatically centers and scales the subject model.
    5. Exports valid watertight glTF 2.0 Binary (.glb).
    """
    orig_img = Image.open(image_path)
    orig_w, orig_h = orig_img.size
    aspect = orig_w / float(orig_h)

    # 1. Segment Foreground Subject
    fg_mask, seg_method, bg_info = segment_foreground(orig_img)

    # Save visual mask file alongside GLB for user inspection
    mask_png_path = os.path.splitext(output_glb_path)[0] + "_mask.png"
    mask_preview_img = Image.fromarray((fg_mask * 255.0).astype(np.uint8))
    os.makedirs(os.path.dirname(mask_png_path), exist_ok=True)
    mask_preview_img.save(mask_png_path)

    # 2. Build RGBA Cutout Texture with alpha transparency
    rgba_base = orig_img.convert('RGBA')
    if max(orig_w, orig_h) > 1024:
        rgba_base.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
    
    # Resample mask to match texture dimensions
    tw, th = rgba_base.size
    mask_for_tex = Image.fromarray((fg_mask * 255.0).astype(np.uint8)).resize((tw, th), Image.Resampling.BILINEAR)
    tex_alpha_arr = np.array(mask_for_tex)
    rgba_base.putalpha(Image.fromarray(tex_alpha_arr))

    tex_io = io.BytesIO()
    rgba_base.save(tex_io, format='PNG', optimize=True)
    texture_bytes = tex_io.getvalue()

    # 3. Resample for Depth Analysis Grid
    if aspect >= 1.0:
        gw = grid_res
        gh = max(16, int(round(grid_res / aspect)))
    else:
        gh = grid_res
        gw = max(16, int(round(grid_res * aspect)))

    analysis_img = orig_img.convert('RGB').resize((gw, gh), Image.Resampling.LANCZOS)
    gray = analysis_img.convert('L')
    gray_arr = np.array(gray, dtype=np.float32)

    # Resample mask to grid resolution
    grid_mask_im = Image.fromarray((fg_mask * 255.0).astype(np.uint8)).resize((gw, gh), Image.Resampling.BILINEAR)
    grid_mask = np.array(grid_mask_im, dtype=np.float32) / 255.0

    classification = classify_subject(analysis_img, gray_arr)
    structural_regions = detect_structural_regions(grid_mask, gray_arr, orig_w, orig_h)

    # 4. Continuous Depth Hull from Subject Mask Silhouette
    binary_grid_mask = grid_mask > 0.15
    if np.any(binary_grid_mask):
        dist_map = ndimage.distance_transform_edt(binary_grid_mask)
        max_dist = np.max(dist_map)
        norm_dist = dist_map / max(1.0, max_dist)
    else:
        norm_dist = np.ones_like(grid_mask)

    # Combine distance hull with fine surface luminance relief
    is_bright_bg = "255" in bg_info or np.mean(gray_arr[0:2, :]) > 180
    lum_detail = (255.0 - gray_arr) / 255.0 if is_bright_bg else gray_arr / 255.0
    lum_smooth = ndimage.gaussian_filter(lum_detail, sigma=1.2)

    # Depth elevation: taps to 0 at the silhouette edge!
    front_z = (norm_dist ** 0.65) * 0.45 + lum_smooth * 0.12
    front_z = front_z * (grid_mask ** 0.5) * depth_scale * 2.0

    back_z = - (norm_dist ** 0.70) * (grid_mask ** 0.5) * depth_scale * 1.3

    # World Coordinates
    world_w = 3.0
    world_h = world_w / aspect

    xs = np.linspace(-world_w / 2.0, world_w / 2.0, gw, dtype=np.float32)
    ys = np.linspace(world_h / 2.0, -world_h / 2.0, gh, dtype=np.float32)
    X, Y = np.meshgrid(xs, ys)

    # UV Coordinates
    u_vals = np.linspace(0.0, 1.0, gw, dtype=np.float32)
    v_vals = np.linspace(0.0, 1.0, gh, dtype=np.float32)
    U, V = np.meshgrid(u_vals, v_vals)

    # 5. Assemble Geometry: Active Quad Selection (Silhouette-focused)
    # Check which quads are active (contain foreground)
    active_quad = np.zeros((gh - 1, gw - 1), dtype=bool)
    for r in range(gh - 1):
        for c in range(gw - 1):
            quad_vals = [grid_mask[r, c], grid_mask[r, c+1], grid_mask[r+1, c], grid_mask[r+1, c+1]]
            if max(quad_vals) > 0.08:
                active_quad[r, c] = True

    # If active quads are somehow too few, fallback to all quads
    if np.sum(active_quad) < 10:
        active_quad[:, :] = True

    # Normal calculations
    dz_dx, dz_dy = np.gradient(front_z, xs[1] - xs[0], ys[1] - ys[0])
    nx = -dz_dx
    ny = -dz_dy
    nz = np.ones_like(front_z)
    mag = np.sqrt(nx**2 + ny**2 + nz**2)
    fnx, fny, fnz = nx / mag, ny / mag, nz / mag

    bnx, bny, bnz = -fnx, -fny, -np.abs(fnz)

    # Vertices
    vertices = []
    normals = []
    uvs = []
    indices = []

    front_base_idx = 0
    for r in range(gh):
        for c in range(gw):
            vertices.extend([float(X[r, c]), float(Y[r, c]), float(front_z[r, c])])
            normals.extend([float(fnx[r, c]), float(fny[r, c]), float(fnz[r, c])])
            uvs.extend([float(U[r, c]), float(V[r, c])])

    back_base_idx = len(vertices) // 3
    for r in range(gh):
        for c in range(gw):
            vertices.extend([float(X[r, c]), float(Y[r, c]), float(back_z[r, c])])
            normals.extend([float(bnx[r, c]), float(bny[r, c]), float(bnz[r, c])])
            uvs.extend([float(1.0 - U[r, c]), float(V[r, c])])

    # A. Front Triangles (Only for active quads)
    for r in range(gh - 1):
        for c in range(gw - 1):
            if not active_quad[r, c]:
                continue
            i0 = front_base_idx + r * gw + c
            i1 = i0 + 1
            i2 = front_base_idx + (r + 1) * gw + c
            i3 = i2 + 1
            indices.extend([i0, i2, i1])
            indices.extend([i1, i2, i3])

    # B. Back Triangles (Only for active quads, reversed winding)
    for r in range(gh - 1):
        for c in range(gw - 1):
            if not active_quad[r, c]:
                continue
            i0 = back_base_idx + r * gw + c
            i1 = i0 + 1
            i2 = back_base_idx + (r + 1) * gw + c
            i3 = i2 + 1
            indices.extend([i0, i1, i2])
            indices.extend([i1, i3, i2])

    # C. Perimeter Silhouette Bevel Seams
    # Bridge front to back along every boundary edge of active quads
    for r in range(gh - 1):
        for c in range(gw - 1):
            if not active_quad[r, c]:
                continue
            
            # Top edge: boundary if r == 0 or quad above is not active
            if r == 0 or not active_quad[r - 1, c]:
                f0 = front_base_idx + r * gw + c
                f1 = f0 + 1
                b0 = back_base_idx + r * gw + c
                b1 = b0 + 1
                indices.extend([f0, f1, b0])
                indices.extend([f1, b1, b0])

            # Bottom edge: boundary if r == gh - 2 or quad below is not active
            if r == gh - 2 or not active_quad[r + 1, c]:
                f0 = front_base_idx + (r + 1) * gw + c
                f1 = f0 + 1
                b0 = back_base_idx + (r + 1) * gw + c
                b1 = b0 + 1
                indices.extend([f0, b0, f1])
                indices.extend([f1, b0, b1])

            # Left edge: boundary if c == 0 or quad to left is not active
            if c == 0 or not active_quad[r, c - 1]:
                f0 = front_base_idx + r * gw + c
                f1 = front_base_idx + (r + 1) * gw + c
                b0 = back_base_idx + r * gw + c
                b1 = back_base_idx + (r + 1) * gw + c
                indices.extend([f0, b0, f1])
                indices.extend([f1, b0, b1])

            # Right edge: boundary if c == gw - 2 or quad to right is not active
            if c == gw - 2 or not active_quad[r, c + 1]:
                f0 = front_base_idx + r * gw + c + 1
                f1 = front_base_idx + (r + 1) * gw + c + 1
                b0 = back_base_idx + r * gw + c + 1
                b1 = back_base_idx + (r + 1) * gw + c + 1
                indices.extend([f0, f1, b0])
                indices.extend([f1, b1, b0])

    # 6. Automatic Subject Centering & Normalization
    # Calculate bounding box of active foreground vertices
    active_vert_indices = []
    for r in range(gh):
        for c in range(gw):
            # Check if this vertex touches any active quad
            touches_active = False
            if r > 0 and c > 0 and active_quad[r-1, c-1]: touches_active = True
            elif r > 0 and c < gw-1 and active_quad[r-1, c]: touches_active = True
            elif r < gh-1 and c > 0 and active_quad[r, c-1]: touches_active = True
            elif r < gh-1 and c < gw-1 and active_quad[r, c]: touches_active = True
            
            if touches_active:
                active_vert_indices.append(r * gw + c)

    if len(active_vert_indices) > 0:
        act_xs = [vertices[idx * 3] for idx in active_vert_indices]
        act_ys = [vertices[idx * 3 + 1] for idx in active_vert_indices]
        act_zs = [vertices[idx * 3 + 2] for idx in active_vert_indices]
        
        center_x = (min(act_xs) + max(act_xs)) / 2.0
        center_y = (min(act_ys) + max(act_ys)) / 2.0
        center_z = (min(act_zs) + max(act_zs)) / 2.0
        
        # Translate all vertices so subject is centered at origin
        for i in range(len(vertices) // 3):
            vertices[i * 3] -= center_x
            vertices[i * 3 + 1] -= center_y
            vertices[i * 3 + 2] -= center_z

    # 7. Generate and save GLB
    glb_data = create_glb_binary(vertices, normals, uvs, indices, texture_bytes, is_png=True)
    
    os.makedirs(os.path.dirname(output_glb_path), exist_ok=True)
    with open(output_glb_path, 'wb') as f:
        f.write(glb_data)
        
    total_verts = len(vertices) // 3
    total_triangles = len(indices) // 3
    file_size_kb = round(len(glb_data) / 1024.0, 1)
    
    result = {
        "status": "success",
        "glbPath": output_glb_path,
        "maskPath": mask_png_path,
        "fileSizeBytes": len(glb_data),
        "fileSizeKb": file_size_kb,
        "vertexCount": total_verts,
        "triangleCount": total_triangles,
        "activeQuadCount": int(np.sum(active_quad)),
        "gridDimensions": [gw, gh],
        "imageDimensions": [orig_w, orig_h],
        "aspectRatio": round(aspect, 3),
        "classification": classification,
        "structuralRegions": structural_regions,
        "segmentation": {
            "method": seg_method,
            "backgroundInfo": bg_info,
            "foregroundCoveragePct": round(float(np.mean(fg_mask)) * 100.0, 1)
        },
        "reconstructionMethod": "Silhouette-Isolated Bilateral Watertight Elevation",
        "depthInferenceNotice": "Bilateral depth synthesized from contour boundaries, gradient normals, and luminance. Unwanted backgrounds removed; posterior volume mathematically inferred."
    }
    
    return result

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({
            "status": "error",
            "message": "Usage: python reconstruct3d.py <input_image_path> <output_glb_path> [resolution]"
        }))
        sys.exit(1)
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    res = int(sys.argv[3]) if len(sys.argv) > 3 else 110
    
    try:
        res_data = reconstruct_3d(input_path, output_path, grid_res=res)
        print(json.dumps(res_data, indent=2))
    except Exception as e:
        import traceback
        err_data = {
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(err_data))
        sys.exit(1)
