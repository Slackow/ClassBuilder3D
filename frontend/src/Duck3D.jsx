import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { MeshStandardMaterial } from 'three';

function Duck() {
  // Adjust the path to match where your Duck.fbx is located (e.g., in public/models/)
  const duck = useLoader(FBXLoader, '/models/Duck.fbx');
  const ref = useRef();

  // Create a white material
  const whiteMaterial = new MeshStandardMaterial({ color: 'white' });

  // Update the duck's material once it's loaded
  useEffect(() => {
    duck.traverse((child) => {
      if (child.isMesh) {
        child.material = whiteMaterial;
      }
    });
  }, [duck, whiteMaterial]);

  // Rotate the duck on each frame
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = 0;
      ref.current.rotation.x = .3;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive
      object={duck}
      ref={ref}
      scale={[0.01, 0.01, 0.01]} // Adjust scale if necessary
    />
  );
}

const Duck3D = () => {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        pointerEvents: 'none' // Allows clicks to pass through
      }}
    >
      <ambientLight intensity={3.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Duck />
    </Canvas>
  );
};

export default Duck3D;