import { useRef, useEffect } from "react";
import * as THREE from "three";

export interface Point {
  x: number;
  y: number;
  z: number;
  color?: string; // Optional color
}

export const PointCloud = ({ points }: { points: Point[] }) => {
  const cloudRef = useRef(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useEffect(() => {
    if (geometryRef.current) {
      const geometry = geometryRef.current;

      // Update positions
      const positions = new Float32Array(
        points.flatMap(({ x, y, z }) => [x, y, z]),
      );
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      // Update colors (optional)
      const colors = new Float32Array(
        points.flatMap(({ color }) => {
          if (color) {
            console.log("color", color);
            const rgb = new THREE.Color(color);
            return [rgb.r, rgb.g, rgb.b];
          }
          return [1, 1, 1]; // Default to white
        }),
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // Notify Three.js of changes
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      // Recompute bounding sphere for frustum culling
      geometry.computeBoundingSphere();
    }
  }, [points]);

  return (
    <points ref={cloudRef}>
      <bufferGeometry ref={geometryRef}>
        {/* <bufferAttribute
          attach="attributes-position"
          array={points}
          itemSize={3}
          count={points.length / 3}
          needsUpdate={true}
        /> */}
        <pointsMaterial
          size={0.05} // Adjust size of points
          sizeAttenuation // Makes size adjust based on distance
          vertexColors // Use per-point colors
          transparent
          opacity={0.9} // Optional transparency
        />
      </bufferGeometry>
    </points>
  );
};
