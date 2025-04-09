/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import LightingControls from './LightingControls';
import CustomizationPanel from './CustomizationPanel';
import '../styles/tailwind.css';
// Interface for material definitions
interface MaterialDefinition {
  id: string;
  data: {
    name: string;
    color: string;
    roughness: number;
    emissive: string;
  };
}

// Interface for component props
export type GLBViewerProps = {
  glbUrl: string; // URL of the GLB model to be viewed
  materialDefinitions: MaterialDefinition[]; // Array of material definitions
};

export const GLBViewer: React.FC<GLBViewerProps> = ({ glbUrl, materialDefinitions }) => {
  const { scene } = useGLTF(glbUrl); // Load the 3D model using useGLTF
  const viewerRef = useRef<HTMLDivElement | null>(null); // Reference for the viewer container
  const [customizableParts, setCustomizableParts] = useState<Record<string, THREE.Material[]>>({}); // State to store customizable parts
  const [selectedPart, setSelectedPart] = useState<string | null>(null); // State to store the selected part
  const [ambientLightIntensity, setAmbientLightIntensity] = useState<number>(2); // Ambient light intensity
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState<number>(2); // Directional light intensity
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false); // Fullscreen state
  const [directionalLightColor, setDirectionalLightColor] = useState<string>('#ffffff');
  const [directionalLightPosition, setDirectionalLightPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(2.5, 8, 5),
  ); // Directional light position
  const [shadowsEnabled, setShadowsEnabled] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null); // State for error handling
  const [partVisibility, setPartVisibility] = useState<Record<string, boolean>>({});

  // Helper function to create a THREE.js material from a definition
  const createMaterialFromDefinition = (definition: MaterialDefinition['data']): THREE.Material => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(definition.color),
      roughness: definition.roughness,
      emissive: definition.emissive,
    });
    material.name = definition.name; // Add material name
    return material;
  };

  // Extract customizable parts and materials from the loaded model
  useEffect(() => {
    if (!scene) {
      setLoadingError('Model not loaded properly.');
      return;
    }

    const parts: Record<string, THREE.Material[]> = {}; // Store parts and materials
    const visibility: Record<string, boolean> = {}; // Store visibility state
    scene.traverse((object: THREE.Object3D) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        const material = mesh.material;
        if (!parts[mesh.name]) parts[mesh.name] = []; // Initialize empty array for materials if not present
        const addMaterial = (mat: THREE.Material) => {
          if (!parts[mesh.name]?.includes(mat)) parts[mesh.name]?.push(mat);
        };
        // Add materials to the part
        if (Array.isArray(material)) {
          material.forEach(addMaterial);
        } else {
          addMaterial(material);
        }
                visibility[mesh.name] = true; // Default to visible

        // Handle material references in mesh user data
        if (mesh.userData) {
          Object.entries(mesh.userData).forEach(([key, materialRef]) => {
            if (key.startsWith('material') && typeof materialRef === 'string') {
              const materialDefinition = materialDefinitions.find(
                (material) => material.id === materialRef,
              );
              if (materialDefinition) {
                const extraMaterial = createMaterialFromDefinition(materialDefinition.data);
                if (extraMaterial) {
                  addMaterial(extraMaterial);
                }
              } else {
                console.warn(`Material reference not found: ${materialRef}`);
              }
            }
          });
        }
      }
    });
    setCustomizableParts(parts); // Update the customizable parts
    setPartVisibility(visibility); // Initialize visibility state
  }, [scene, materialDefinitions]);

  // Toggle visibility of a part
  const togglePartVisibility = (part: string) => {
    setPartVisibility((prev) => ({
      ...prev,
      [part]: !prev[part],
    }));

    // Update the 3D model
    scene.traverse((object: THREE.Object3D) => {
      if ((object as THREE.Mesh).isMesh && object.name === part) {
        object.visible = !object.visible; // Toggle visibility in the 3D model
      }
    });
  };

  // Handle part selection
  const handlePartSelect = (part: string) => {
    setSelectedPart(part); // Set the selected part
  };

  // Apply selected material to the part
  const handleMaterialSelect = (material: THREE.Material) => {
    if (selectedPart) {
      scene.traverse((object: THREE.Object3D) => {
        if ((object as THREE.Mesh).isMesh && object.name === selectedPart) {
          (object as THREE.Mesh).material = material;
        }
      });
    }
  };

  // Toggle fullscreen mode for the viewer
  const toggleFullscreen = () => {
    if (viewerRef.current) {
      if (!isFullscreen) {
        viewerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    if (!scene) return;

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = shadowsEnabled; // Enable casting shadows
        object.receiveShadow = shadowsEnabled; // Enable receiving shadows
      }
    });
  }, [shadowsEnabled, scene]);

  return (
    <div className="bg-gray-200 text-center text-[#1A4044] p-12 px-10 max-sm:px-2">
      <h1 className="text-lg font-extralight">Some fun? Try our</h1>
      <h1 className="text-4xl font-semibold ">3D Configurator</h1>

      <div className="responsive-flex-3 flex justify-center items-center my-8">
        {/* 3D Viewer Section */}
        <div
          ref={viewerRef}
          className="viewer-container relative bg-gray-100 rounded-2xl shadow-lg cursor-grab mx-4"
        >
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 p-2 cursor-pointer z-10"
          >
            <svg
              fill="#1A4044"
              viewBox="0 0 2020 2020"
              width="32"
              height="32"
            >
              <path d="M1146.616-.012V232.38h376.821L232.391 1523.309v-376.705H0V1920h773.629v-232.39H396.69L1687.737 396.68V773.5h232.275V-.011z" />
            </svg>
          </button>
          {/* 3D Canvas */}
          <Canvas
            shadows
            camera={{ position: [3, 2, 6], fov: 25 }}
          >
            <ambientLight intensity={ambientLightIntensity} />
            <directionalLight
              intensity={directionalLightIntensity}
              position={[
                directionalLightPosition.x,
                directionalLightPosition.y,
                directionalLightPosition.z,
              ]} 
              color={new THREE.Color(directionalLightColor)}
              castShadow={shadowsEnabled}
            />
            <primitive object={scene} />
            <OrbitControls />
          </Canvas>
        </div>

        <div className="responsive-flex-2">
          {/* Customization Panel Section */}
          <CustomizationPanel
            customizableParts={customizableParts}
            handlePartSelect={handlePartSelect}
            handleMaterialSelect={handleMaterialSelect}
            partVisibility={partVisibility} // Pass visibility state
            togglePartVisibility={togglePartVisibility} // Pass toggle function
          />
          {/* Lighting Controls Section */}
          <LightingControls
            ambientLightIntensity={ambientLightIntensity}
            setAmbientLightIntensity={setAmbientLightIntensity}
            directionalLightIntensity={directionalLightIntensity}
            setDirectionalLightIntensity={setDirectionalLightIntensity}
            directionalLightColor={directionalLightColor}
            setDirectionalLightColor={setDirectionalLightColor}
            directionalLightPosition={directionalLightPosition}
            setDirectionalLightPosition={setDirectionalLightPosition}
            shadowsEnabled={shadowsEnabled}
            setShadowsEnabled={setShadowsEnabled}
          />
        </div>
      </div>
      {/* Row Layout models example 
      <ModelExample />*/}
      {/* Display error message if any */}
      {loadingError && <div className="text-red-500 mt-4">{loadingError}</div>}
    </div>
  );
};
