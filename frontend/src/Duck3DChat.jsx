// src/Duck3Dchat.jsx

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { MeshStandardMaterial } from 'three';
// No need to import THREE just for Math.PI

function Model() { 
  const model = useLoader(FBXLoader, '/models/Atilla.fbx'); 
  const ref = useRef();

  const blackMaterial = new MeshStandardMaterial({ color: 'orange' });

  useEffect(() => {
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = blackMaterial;
      }
    });
  }, [model, blackMaterial]); 

  useFrame(() => {
    if (ref.current) {
      // May need to adjust vertical position more significantly with larger scale
      ref.current.position.y = -0.8; // Example adjustment, fine-tune this
      ref.current.rotation.y += 0.015; 
    }
  });

  return (
    <primitive
      object={model} 
      ref={ref}
      // No initial rotation needed if model is oriented correctly
      // rotation={[0, Math.PI / 2, 0]} 
      // --- INCREASED SCALE TO COMPENSATE FOR CAMERA DISTANCE ---
      // --- Fine-tune this value based on the new camera position ---
      scale={[15, 15, 15]} // Increased scale significantly
    />
  );
}

const Duck3DChat = () => { 
  return (
    <Canvas
      style={{
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
      }}
      dpr={window.devicePixelRatio} // Consider clamping: dpr={[1, 2]} or [1, 3]
      gl={{ antialias: true }}
      // --- MOVE CAMERA FURTHER AWAY ---
      // Default is position=[0, 0, 5]. Increase Z value to move back.
      // Adjust the Z value (15) further/closer as needed.
      camera={{ position: [0, 0, 30], fov: 50 }} // Moved camera back, fov adjusted slightly
    >
      {/* Adjust light intensity if needed for new distance/scale */}
      <ambientLight color="#FF8C00" intensity={1.5} /> 
      <directionalLight position={[5, 10, 8]} intensity={0.8} /> 
      <Model /> 
    </Canvas>
  );
};

export default Duck3DChat;