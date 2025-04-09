import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MaterialPreviewProps {
  material: THREE.Material;
  onClick: () => void;
}

const MaterialPreview: React.FC<MaterialPreviewProps> = ({ material, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotate the sphere smoothly
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group>
      {/* Sphere with applied material */}
      <mesh ref={meshRef} onClick={onClick} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 32, 32]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Plane to catch shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[3,3]} />
        <shadowMaterial attach="material" opacity={0.2} />
      </mesh>
    </group>
  );
};

export default MaterialPreview;
