import DiagramConverter2D3D from "./DiagramConverter2D3D";

/**
 * ImageTo3DConverter
 * Consolidated wrapper that forwards to the authentic offline 2D-to-3D reconstruction pipeline.
 * Eliminates legacy filename keyword matching and guarantees genuine 3D GLB geometry generation.
 */
export default function ImageTo3DConverter(props) {
    return <DiagramConverter2D3D {...props} />;
}
