/* eslint-disable react/no-unknown-property */
import React, { useState } from "react";
import * as THREE from "three";
import MaterialPreview from "./MaterialPreview";
import { Canvas } from "@react-three/fiber";
import "../styles/tailwind.css"; 

// Type definition for the customizable parts
interface CustomizationPanelProps {
  customizableParts: Record<string, THREE.Material[]>; // Map of part names to materials
  handlePartSelect: (part: string) => void; // Callback for selecting a part
  handleMaterialSelect: (material: THREE.Material) => void; // Callback for selecting a material
  partVisibility: Record<string, boolean>; // Visibility state for each part
  togglePartVisibility: (part: string) => void; // Callback for toggling part visibility
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customizableParts,
  handlePartSelect,
  handleMaterialSelect,
  partVisibility,
  togglePartVisibility,
}) => {
  const [expandedPart, setExpandedPart] = useState<string | null>(null);

  // Function to toggle the expansion of a part
  const togglePart = (part: string) => {
    if (expandedPart === part) {
      setExpandedPart(null);
      handlePartSelect("");
    } else {
      setExpandedPart(part);
      handlePartSelect(part);
    }
  };

  return (
<div className="customizer-container py-4 px-8 bg-gray-50 rounded-2xl shadow-lg overflow-y-auto">
      <div className="flex justify-center mb-4">
        <h3 className="flex justify-start  text-xl" style={{ fontFamily: 'mash-poppins-medium' }}>Model parts</h3>
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {/* Iterate through each part */}
        {Object.keys(customizableParts).map((part, index) => (
          <div key={index} className="flex flex-col gap-2">
            {/* Button to toggle the part */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => togglePart(part)}
                className={`flex items-center justify-between font-semibold text-[#000] w-32 px-4 py-2 rounded-lg shadow-sm text-left cursor-pointer transition ${
                  expandedPart === part
                    ? "bg-[#e2e2e2] hover:bg-gray-100 scale-105"
                    : "bg-[#f1f1f1] hover:bg-[#e2e2e2] hover:scale-105"
                }`}
              >
                {part || `Part ${index + 1}`}
                <span
                  className={`ml-2 transition-transform duration-500 transform origin-bottom ${
                    expandedPart === part ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ⮬ 
                </span>
              </button> 

              {/* Toggle Visibility Button */}
              <button
                onClick={() => togglePartVisibility(part)}
                className="text-[#000] text-left font-semibold rounded-lg bg-[#f1f1f1] shadow-sm p-2 transition-colors hover:bg-[#e2e2e2] hover:scale-110  cursor-pointer "
                title={partVisibility[part] ? "Hide Part" : "Show Part"}
              >
                {partVisibility[part] ? "Hide" : "Show"}
              </button>
            </div>

            {/* Show materials only when part is expanded */}
            {expandedPart === part && (
              <div className="flex -space-x-4">
                {/* Material Previews */}
                {customizableParts[part]?.map((material, matIndex) => ( console.log(customizableParts),
                  <div
                    key={matIndex}
                    className="relative group w-16 h-16"
                    title={
                      (material as THREE.MeshStandardMaterial).name ||
                      `Material ${matIndex + 1}`
                    }
                  >
                    <Canvas
                      camera={{ position: [0, 0, 2], fov: 50 }}
                      shadows // Enable shadows
                      style={{ width: "100%", height: "100%" }}
                    >
                      <ambientLight intensity={0.3} />
                      <directionalLight
                        position={[1, 3, 3]}
                        intensity={1}
                        castShadow // Enable shadow casting
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                      />
                      <MaterialPreview
                        material={material}
                        onClick={() => handleMaterialSelect(material)}
                      />
                    </Canvas>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizationPanel;
