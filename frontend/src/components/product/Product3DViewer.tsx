'use client';

import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Play, 
  Pause,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Model3D from './Model3D';

interface Product3DViewerProps {
  readonly modelUrl: string;
  readonly className?: string;
}

export default function Product3DViewer({ 
  modelUrl, 
  className = '' 
}: Product3DViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    controlsRef.current?.reset?.();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  if (error) {
    return (
      <div className={`relative bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-lg overflow-hidden ${className}`}>
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
          <AlertCircle className="w-16 h-16 text-amber-600 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Failed to Load 3D Model
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-lg overflow-hidden ${className}`}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Loading 3D Model...
            </p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <pointLight position={[0, 5, 0]} intensity={0.5} />
          <pointLight position={[0, -5, 0]} intensity={0.3} />

          {/* Environment for reflections (makes jewelry sparkle) */}
          <Environment preset="sunset" />

          {/* 3D Model */}
          <Model3D
            url={modelUrl}
            onLoad={() => setIsLoading(false)}
            onError={(err: string) => {
              setIsLoading(false);
              setError(err);
            }}
          />

          {/* Ground Shadow */}
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Controls */}
          <OrbitControls
            ref={controlsRef}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>

      {/* Control Buttons */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex gap-2">
          {/* Auto Rotate */}
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleAutoRotate}
            className="bg-white/90 dark:bg-black/90 backdrop-blur-sm hover:bg-white dark:hover:bg-black"
          >
            {autoRotate ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Rotate
              </>
            )}
          </Button>

          {/* Reset View */}
          <Button
            size="sm"
            variant="secondary"
            onClick={handleReset}
            className="bg-white/90 dark:bg-black/90 backdrop-blur-sm hover:bg-white dark:hover:bg-black"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Fullscreen */}
        <Button
          size="sm"
          variant="secondary"
          onClick={toggleFullscreen}
          className="bg-white/90 dark:bg-black/90 backdrop-blur-sm hover:bg-white dark:hover:bg-black"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 mr-2" />
              Exit
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 mr-2" />
              Fullscreen
            </>
          )}
        </Button>
      </div>

      {/* Instructions */}
      {!isLoading && (
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-4 py-2 rounded-md">
          <p className="text-xs text-neutral-700 dark:text-neutral-300">
            🖱️ Drag to rotate • Scroll to zoom • Right-click to pan
          </p>
        </div>
      )}

      {/* Product Label */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-rose-600 px-4 py-2 rounded-md">
        <p className="text-xs font-semibold text-white">
          3D VIEW
        </p>
      </div>
    </div>
  );
}
