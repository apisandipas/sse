import { useRef, useEffect } from "react";
import * as THREE from "three";

export const PointCloud = ({ points }: { points: number[] }) => {
  const cloudRef = useRef(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useEffect(() => {
    if (geometryRef.current) {
      const geometry = geometryRef.current;

      // Update positions
      const positions = new Float32Array(points);
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      geometry.attributes.position.needsUpdate = true;

      // Recompute bounding sphere for frustum culling
      geometry.computeBoundingSphere();
    }
  }, [points]);

  return (
    <points ref={cloudRef}>
      <bufferGeometry ref={geometryRef}>
        <pointsMaterial
          size={0.002} // Adjust size of points
          sizeAttenuation // Makes size adjust based on distance
          vertexColors={true} // Use per-point colors
          opacity={0.9} // Optional transparency
        />
      </bufferGeometry>
    </points>
  );
};
