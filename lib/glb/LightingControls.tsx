import React from "react";
import { Vector3 } from "three"; // Import Vector3 from three.js
import "../styles/tailwind.css"; 

// Define the props interface
interface LightingControlsProps {
  ambientLightIntensity: number;
  setAmbientLightIntensity: (value: number) => void;
  directionalLightIntensity: number;
  setDirectionalLightIntensity: (value: number) => void;
  directionalLightColor: string;
  setDirectionalLightColor: (value: string) => void;
  directionalLightPosition: Vector3; // Now using Vector3 type
  setDirectionalLightPosition: (value: Vector3) => void; // Accepting a Vector3 object
  shadowsEnabled: boolean;
  setShadowsEnabled: (value: boolean) => void;
}

const LightingControls: React.FC<LightingControlsProps> = ({
  ambientLightIntensity,
  setAmbientLightIntensity,
  directionalLightIntensity,
  setDirectionalLightIntensity,
  directionalLightColor,
  setDirectionalLightColor,
  directionalLightPosition,
  setDirectionalLightPosition,
  shadowsEnabled,
  setShadowsEnabled,
}) => {
  // Handle the position change for each axis
  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    const newPosition = directionalLightPosition.clone(); // Clone the Vector3 to avoid direct mutation
    newPosition[axis] = value; // Update the specific axis
    setDirectionalLightPosition(newPosition); // Update state with new Vector3
  };
  return (
<div className="lighting-controls-container p-4 bg-gray-50 rounded-2xl shadow-lg overflow-y-auto">
      <h3 className="text-xl mb-4 text-[#000]  text-center" style={{ fontFamily: 'mash-poppins-medium' }}>
        Lighting Controls
      </h3>

      <div className="grid grid-cols-1 max-md:grid-row gap-4 mb-2">
        {/* Light Color Picker */}
        <div className="flex flex-col items-center">
          <label className="font-semibold text-[#000] mb-2">
            Light Color{" "}
          </label>
          <div className="relative w-10 h-10 rounded-lg shadow-lg border-2 border-[#000] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105">
            {/* Color Preview */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: directionalLightColor }}
            />

            {/* Color Input */}
            <input
              type="color"
              value={directionalLightColor}
              onChange={(e) => setDirectionalLightColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Select light color"
              style={{ zIndex: 10 }} // Ensure the input is clickable
            />
            {/* Border and Hover Effect */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-lg transition-all duration-300 hover:border-white/50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 mb-6">
        {/* Ambient Light */}
        <div className="flex flex-col items-center mt-2">
          <label className="font-semibold text-[#000]">Ambient Light</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={ambientLightIntensity}
            onChange={(e) =>
              setAmbientLightIntensity(parseFloat(e.target.value))
            }
            className="  bg-gray-200 rounded-lg appearance-none cursor-pointer "
          />
          <span className="text-sm text-gray-500">{ambientLightIntensity}</span>
        </div>

        {/* Directional Light */}
        <div className="flex flex-col items-center mt-4">
          <label className="font-semibold text-[#000]">
            Directional Light
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={directionalLightIntensity}
            onChange={(e) =>
              setDirectionalLightIntensity(parseFloat(e.target.value))
            }
            className="bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-[#000] ">
            {directionalLightIntensity}
          </span>
        </div>
      </div>

      {/* Directional Light Position */}
      <div className="mb-8">
        <label className="block font-semibold text-[#000]">
          Light Position
        </label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {["x", "y", "z"].map((axis) => (
            <div key={axis} className="flex flex-col items-center">
              <span className="text-sm font-semibold text-[#000] ">
                {axis.toUpperCase()}
              </span>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={String(directionalLightPosition[axis as keyof Vector3])} // Convert the value to a string
                onChange={
                  (e) =>
                    handlePositionChange(
                      axis as "x" | "y" | "z",
                      parseFloat(e.target.value)
                    ) // Call handler to update position
                }
                className="w-full bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => setShadowsEnabled(!shadowsEnabled)}
            className={`w-6 h-6 flex items-center justify-center focus:outline-none transition-all duration-300 cursor-pointer ${
              shadowsEnabled ? "shadow-lg" : ""
            }`}
          >
            {shadowsEnabled ? (
            <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704Z" fill="#000"></path> <path opacity=".05" fillRule="evenodd" clipRule="evenodd" d="M12.1619 3.85182C8.35817 4.88918 4.88936 8.358 3.85199 12.1617L3.3696 12.0301C4.45356 8.05564 8.05581 4.45339 12.0303 3.36943L12.1619 3.85182Z" fill="#000"></path> <path opacity=".1" fillRule="evenodd" clipRule="evenodd" d="M11.8807 3.42707C8.03441 4.50542 4.50561 8.03422 3.42726 11.8805L2.94582 11.7456C4.07129 7.73121 7.7314 4.0711 11.7458 2.94563L11.8807 3.42707Z" fill="#000"></path> <path opacity=".15" fillRule="evenodd" clipRule="evenodd" d="M11.5201 3.02556C7.69092 4.16199 4.16779 7.68323 3.02805 11.512L2.54883 11.3694C3.73676 7.37869 7.38659 3.73076 11.3778 2.54623L11.5201 3.02556Z" fill="#000"></path> <path opacity=".2" fillRule="evenodd" clipRule="evenodd" d="M11.0468 2.66169C7.31117 3.87664 3.87918 7.3079 2.66298 11.0434L2.18754 10.8886C3.45324 7.00109 7.00445 3.45062 10.8921 2.18621L11.0468 2.66169Z" fill="#000"></path> <path opacity=".25" fillRule="evenodd" clipRule="evenodd" d="M10.5201 2.32365C6.92091 3.61447 3.62391 6.90876 2.32845 10.5073L1.858 10.338C3.20398 6.59909 6.61155 3.19424 10.3513 1.85301L10.5201 2.32365Z" fill="#000"></path> <path opacity=".3" fillRule="evenodd" clipRule="evenodd" d="M9.90222 2.03122C6.50003 3.39465 3.39968 6.49367 2.03399 9.89551L1.56998 9.70924C2.98651 6.18076 6.18728 2.98133 9.71622 1.5671L9.90222 2.03122Z" fill="#000"></path> <path opacity=".35" fillRule="evenodd" clipRule="evenodd" d="M9.20727 1.78873C6.06136 3.20349 3.21103 6.05203 1.79331 9.19738L1.33747 8.99192C2.80536 5.73528 5.74485 2.7976 9.0022 1.33272L9.20727 1.78873Z" fill="#000"></path> <path opacity=".4" fillRule="evenodd" clipRule="evenodd" d="M8.40713 1.62085C5.59323 3.05117 3.05794 5.58509 1.62544 8.39847L1.17987 8.1716C2.66036 5.26397 5.27232 2.6534 8.18057 1.17513L8.40713 1.62085Z" fill="#000"></path> <path opacity=".45" fillRule="evenodd" clipRule="evenodd" d="M7.46207 1.56747C5.08689 2.94695 2.95362 5.07912 1.57249 7.45379L1.14028 7.20241C2.56503 4.75273 4.7607 2.55818 7.21096 1.1351L7.46207 1.56747Z" fill="#000"></path> <path opacity=".5" fillRule="evenodd" clipRule="evenodd" d="M6.30407 1.70487C4.51964 2.91063 2.90983 4.52061 1.7043 6.30513L1.28998 6.02524C2.5313 4.18773 4.18673 2.53214 6.02413 1.29059L6.30407 1.70487Z" fill="#000"></path> </g></svg>
            ) : (
            <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 9.1488 1.47969 10.657 2.4767 11.8162L1.64647 12.6464C1.45121 12.8417 1.45121 13.1583 1.64647 13.3535C1.84173 13.5488 2.15832 13.5488 2.35358 13.3535L3.18383 12.5233C4.34302 13.5202 5.8511 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 5.85107 13.5202 4.34298 12.5233 3.1838L13.3536 2.35355C13.5488 2.15829 13.5488 1.8417 13.3536 1.64644C13.1583 1.45118 12.8417 1.45118 12.6465 1.64644L11.8162 2.47667C10.657 1.47966 9.14883 0.877045 7.49991 0.877045ZM11.1423 3.15065C10.1568 2.32449 8.88644 1.82704 7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 8.88641 2.32452 10.1568 3.15069 11.1422L11.1423 3.15065ZM3.85781 11.8493C4.84322 12.6753 6.11348 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 6.11345 12.6754 4.84319 11.8493 3.85778L3.85781 11.8493Z" fill="#000"></path> <path opacity=".05" fillRule="evenodd" clipRule="evenodd" d="M6.78296 13.376C8.73904 9.95284 8.73904 5.04719 6.78296 1.62405L7.21708 1.37598C9.261 4.95283 9.261 10.0472 7.21708 13.624L6.78296 13.376Z" fill="#000"></path> <path opacity=".1" fillRule="evenodd" clipRule="evenodd" d="M7.28204 13.4775C9.23929 9.99523 9.23929 5.00475 7.28204 1.52248L7.71791 1.2775C9.76067 4.9119 9.76067 10.0881 7.71791 13.7225L7.28204 13.4775Z" fill="#000"></path> <path opacity=".15" fillRule="evenodd" clipRule="evenodd" d="M7.82098 13.5064C9.72502 9.99523 9.72636 5.01411 7.82492 1.50084L8.26465 1.26285C10.2465 4.92466 10.2451 10.085 8.26052 13.7448L7.82098 13.5064Z" fill="#000"></path> <path opacity=".2" fillRule="evenodd" clipRule="evenodd" d="M8.41284 13.429C10.1952 9.92842 10.1957 5.07537 8.41435 1.57402L8.85999 1.34729C10.7139 4.99113 10.7133 10.0128 8.85841 13.6559L8.41284 13.429Z" fill="#000"></path> <path opacity=".25" fillRule="evenodd" clipRule="evenodd" d="M9.02441 13.2956C10.6567 9.8379 10.6586 5.17715 9.03005 1.71656L9.48245 1.50366C11.1745 5.09919 11.1726 9.91629 9.47657 13.5091L9.02441 13.2956Z" fill="#000"></path> <path opacity=".3" fillRule="evenodd" clipRule="evenodd" d="M9.66809 13.0655C11.1097 9.69572 11.1107 5.3121 9.67088 1.94095L10.1307 1.74457C11.6241 5.24121 11.6231 9.76683 10.1278 13.2622L9.66809 13.0655Z" fill="#000"></path> <path opacity=".35" fillRule="evenodd" clipRule="evenodd" d="M10.331 12.7456C11.5551 9.52073 11.5564 5.49103 10.3347 2.26444L10.8024 2.0874C12.0672 5.42815 12.0659 9.58394 10.7985 12.9231L10.331 12.7456Z" fill="#000"></path> <path opacity=".4" fillRule="evenodd" clipRule="evenodd" d="M11.0155 12.2986C11.9938 9.29744 11.9948 5.71296 11.0184 2.71067L11.4939 2.55603C12.503 5.6589 12.502 9.35178 11.4909 12.4535L11.0155 12.2986Z" fill="#000"></path> <path opacity=".45" fillRule="evenodd" clipRule="evenodd" d="M11.7214 11.668C12.4254 9.01303 12.4262 5.99691 11.7237 3.34116L12.2071 3.21329C12.9318 5.95292 12.931 9.05728 12.2047 11.7961L11.7214 11.668Z" fill="#000"></path> <path opacity=".5" fillRule="evenodd" clipRule="evenodd" d="M12.4432 10.752C12.8524 8.63762 12.8523 6.36089 12.4429 4.2466L12.9338 4.15155C13.3553 6.32861 13.3554 8.66985 12.9341 10.847L12.4432 10.752Z" fill="#000"></path> </g></svg>
            )}
          </button>
          <span className="ml-2 text-[#000] font-semibold">
            {shadowsEnabled ? "Disable Shadows" : "Enable Shadows"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LightingControls;
