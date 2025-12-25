'use client';

import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Model3DProps {
  readonly url: string;
  readonly onLoad?: () => void;
  readonly onError?: (error: string) => void;
}

export default function Model3D({ url, onLoad, onError }: Model3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load GLTF/GLB model with enhanced error handling
  const { scene } = useGLTF(url, true, undefined, (loader) => {
    loader.manager.onError = (errorUrl) => {
      console.error('Failed to load 3D model:', errorUrl);
      
      // Provide helpful error messages
      let errorMessage = 'Failed to load 3D model. ';
      
      if (errorUrl.includes('CORS') || errorUrl.includes('cors')) {
        errorMessage += 'CORS policy blocked the request. Please host the model on your server or use a CORS-enabled CDN like jsDelivr.';
      } else if (errorUrl.includes('404') || errorUrl.includes('not found')) {
        errorMessage += 'Model file not found at the specified URL.';
      } else {
        errorMessage += 'The file may be corrupted, unavailable, or in an unsupported format. Supported formats: GLB, GLTF';
      }
      
      if (onError) {
        onError(errorMessage);
      }
    };
  });

  // Call onLoad when model is loaded
  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  // Optional: Add subtle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

// Preload helper function
export function preloadModel(url: string) {
  useGLTF.preload(url);
}
