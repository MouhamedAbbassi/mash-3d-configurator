// test-app/src/App.tsx
import  { useEffect, useState } from 'react';
// Import from your library - this works because of the alias in vite.config.ts
import { GLBViewer} from 'mash-3d-configurator';
import "mash-3d-configurator/index.css";
function App() {
  const [materialDefinitions, setMaterialDefinitions] = useState<any | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    fetch("../material.data.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Loaded material definitions:", data);
        setMaterialDefinitions(data.materials); // Set the materials after fetching
      })
      .catch((error) => {
        console.error("Failed to load material definitions:", error); 
        setLoadingError("Failed to load material definitions.");
      });
  }, []);

  if (loadingError) return <p>{loadingError}</p>;
  if (!materialDefinitions) return <p>Loading...</p>; 

  return (
    <div className=''>
       {/* 3d configurator*/}
       <GLBViewer glbUrl="/Med.glb" materialDefinitions={materialDefinitions} />
    </div>
  );
}

export default App;