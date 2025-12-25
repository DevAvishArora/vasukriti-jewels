'use client';

import { Suspense, lazy } from 'react';
import { ClientLayout } from '@/components/client/client-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Lazy load 3D viewer
const Product3DViewer = lazy(() => import('@/components/product/Product3DViewer'));

export default function Demo3DPage() {
  const router = useRouter();

  // Example 3D model URLs (using CORS-enabled sources)
  const demoModels = [
    {
      name: 'Sample Model',
      // Using jsDelivr CDN with proper CORS headers
      url: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    },
    {
      name: 'Alternative Model',
      url: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Box/glTF-Binary/Box.glb',
    },
  ];

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            3D Product Viewer Demo
          </h1>
          <p className="text-gray-600">
            Interactive 3D jewelry viewer with full rotation and zoom controls
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">🖱️ Interactive Controls</h3>
            <p className="text-sm text-gray-600">
              Drag to rotate, scroll to zoom, and right-click to pan
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2"> Realistic Lighting</h3>
            <p className="text-sm text-gray-600">
              Professional lighting setup showcases jewelry details
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">📱 Responsive</h3>
            <p className="text-sm text-gray-600">
              Works seamlessly on desktop, tablet, and mobile devices
            </p>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-900">Demo Model</h2>
            <p className="text-sm text-gray-600 mt-1">
              This is a test 3D model (not jewelry) to demonstrate the viewer functionality. 
              Replace with actual jewelry models when you upload products.
            </p>
          </div>
          
          <div className="p-6">
            <Suspense
              fallback={
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-neutral-600">Loading 3D Model...</p>
                  </div>
                </div>
              }
            >
              <Product3DViewer
                modelUrl={demoModels[0].url}
                className="aspect-square max-h-[600px]"
              />
            </Suspense>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Desktop Controls:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Left Click + Drag:</strong> Rotate the model</li>
                <li>• <strong>Right Click + Drag:</strong> Pan the view</li>
                <li>• <strong>Scroll Wheel:</strong> Zoom in/out</li>
                <li>• <strong>Reset Button:</strong> Return to default view</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Mobile Controls:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>One Finger:</strong> Rotate the model</li>
                <li>• <strong>Two Fingers:</strong> Pan and zoom</li>
                <li>• <strong>Pinch:</strong> Zoom in/out</li>
                <li>• <strong>Auto-Rotate:</strong> Toggle continuous rotation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Implementation Guide
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>1. Upload 3D Models:</strong> Add GLB or GLTF files when creating/editing products in the admin panel.
            </p>
            <p>
              <strong>2. Automatic Detection:</strong> The 3D viewer will automatically appear on product pages when a model is available.
            </p>
            <p>
              <strong>3. View Toggle:</strong> Customers can switch between traditional images and interactive 3D view.
            </p>
            <p>
              <strong>4. Performance:</strong> Models are lazy-loaded for optimal page speed.
            </p>
          </div>
        </div>

        {/* Getting 3D Models */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">
            🎨 Where to Get 3D Jewelry Models
          </h3>
          <div className="space-y-3 text-sm text-amber-800">
            <div>
              <strong>Free Sources:</strong>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li><a href="https://sketchfab.com/search?q=jewelry&type=models" target="_blank" rel="noopener" className="underline">Sketchfab</a> - Thousands of free 3D jewelry models</li>
                <li><a href="https://github.com/KhronosGroup/glTF-Sample-Models" target="_blank" rel="noopener" className="underline">glTF Sample Models</a> - Official sample models from Khronos</li>
                <li><a href="https://www.cgtrader.com/free-3d-models/jewelry" target="_blank" rel="noopener" className="underline">CGTrader</a> - Free and premium jewelry models</li>
              </ul>
            </div>
            <div>
              <strong>Creating Your Own:</strong>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Use <strong>Blender</strong> (free) to create custom jewelry models</li>
                <li>Hire a 3D artist on Fiverr or Upwork</li>
                <li>Export as <strong>GLB</strong> format for best compatibility</li>
              </ul>
            </div>
            <div className="bg-amber-100 border border-amber-300 rounded p-3 mt-2">
              <strong>⚠️ CORS Note:</strong> 3D model files must be hosted on servers that allow CORS (Cross-Origin Resource Sharing). 
              Upload models to your own server, Cloudinary, or use CDNs like jsDelivr for best results.
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
