# 3D Product Viewer - Implementation Guide

## Overview
The 3D Product Viewer is a premium feature that allows customers to interact with jewelry products in an immersive 3D environment. Built with Three.js and React Three Fiber, it provides realistic rendering, smooth controls, and a luxurious viewing experience.

## Features

###  Interactive Controls
- **Rotation**: Drag to rotate the model in any direction
- **Zoom**: Scroll or pinch to zoom in/out
- **Pan**: Right-click drag or two-finger drag to pan
- **Auto-Rotate**: Toggle continuous rotation
- **Reset View**: Return to default camera position
- **Fullscreen**: Expand to fullscreen mode

### 🎨 Visual Quality
- **Realistic Lighting**: Multi-light setup with ambient, directional, and point lights
- **Environment Reflections**: HDR environment mapping for realistic jewelry sparkle
- **Contact Shadows**: Ground shadows for depth perception
- **Smooth Animation**: Subtle floating animation for premium feel
- **High DPI Support**: Retina-ready rendering

### 📱 Responsive Design
- Touch-optimized controls for mobile
- Adaptive UI for different screen sizes
- Performance optimization for all devices
- Graceful fallback for unsupported devices

## Architecture

### Components

#### 1. Product3DViewer.tsx
**Location:** `/frontend/src/components/product/Product3DViewer.tsx`

**Purpose:** Main wrapper component that provides:
- Canvas setup and configuration
- UI controls (play/pause, reset, fullscreen)
- Loading and error states
- Instructions overlay

**Props:**
```typescript
interface Product3DViewerProps {
  readonly modelUrl: string;      // URL to GLB/GLTF file
  readonly className?: string;    // Optional CSS classes
}
```

**Key Features:**
- Lazy loading for performance
- Error boundary for failed loads
- Loading spinner with progress
- Fullscreen API integration

#### 2. Model3D.tsx
**Location:** `/frontend/src/components/product/Model3D.tsx`

**Purpose:** Handles 3D model loading and rendering:
- GLTF/GLB file loading
- Error handling
- Model scaling and positioning
- Optional animations

**Props:**
```typescript
interface Model3DProps {
  readonly url: string;
  readonly onLoad?: () => void;
  readonly onError?: (error: string) => void;
}
```

### Lighting Setup

```jsx
// Ambient light for overall illumination
<ambientLight intensity={0.5} />

// Main directional light (sun-like)
<directionalLight
  position={[10, 10, 5]}
  intensity={1}
  castShadow
/>

// Fill lights to reduce harsh shadows
<directionalLight position={[-10, -10, -5]} intensity={0.3} />
<pointLight position={[0, 5, 0]} intensity={0.5} />
<pointLight position={[0, -5, 0]} intensity={0.3} />

// Environment for reflections
<Environment preset="sunset" />
```

### Camera Configuration

```jsx
<PerspectiveCamera
  makeDefault
  position={[0, 0, 5]}
  fov={50}
/>
```

### Controls Configuration

```jsx
<OrbitControls
  autoRotate={autoRotate}
  autoRotateSpeed={2}
  enableDamping
  dampingFactor={0.05}
  minDistance={2}
  maxDistance={10}
  minPolarAngle={Math.PI / 4}
  maxPolarAngle={Math.PI / 1.5}
/>
```

## Integration

### Product Details Page

The 3D viewer is integrated into the product details page with a toggle button:

```tsx
// Check if product has 3D model
{product.model3D?.url && (
  <div className="flex gap-2">
    <Button onClick={() => setViewMode('images')}>
      Images
    </Button>
    <Button onClick={() => setViewMode('3d')}>
      3D View
    </Button>
  </div>
)}

// Conditional rendering
{viewMode === '3d' ? (
  <Suspense fallback={<Loader />}>
    <Product3DViewer
      modelUrl={product.model3D.url}
      className="aspect-square"
    />
  </Suspense>
) : (
  <ProductImageGallery images={product.images} />
)}
```

### Database Schema

The Product model already includes support for 3D models:

```javascript
model3D: {
  url: String,      // URL to the GLB/GLTF file
  format: String,   // File format (glb, gltf)
  size: Number      // File size in bytes
}
```

## Usage

### For Admins

1. **Prepare 3D Model:**
   - Format: GLB (recommended) or GLTF
   - Optimize: Keep file size under 5MB
   - Tools: Blender, Sketchfab, or 3D modeling software

2. **Upload Model:**
   - Go to Admin Panel → Products
   - Create or edit a product
   - Upload 3D model file
   - File is automatically uploaded to Cloudinary

3. **Verify:**
   - View product on frontend
   - Check 3D View button appears
   - Test rotation, zoom, and controls

### For Customers

1. **Access 3D View:**
   - Navigate to any product with 3D model
   - Click "3D View" button
   - Model loads with loading animation

2. **Interact:**
   - **Desktop**: Click and drag to rotate
   - **Mobile**: Touch and drag
   - **Zoom**: Scroll wheel or pinch
   - **Pan**: Right-click drag or two fingers

3. **Controls:**
   - **Auto-Rotate**: Toggle automatic rotation
   - **Reset**: Return to default view
   - **Fullscreen**: Expand for immersive experience

## Performance Optimization

### 1. Lazy Loading
```tsx
const Product3DViewer = lazy(() => 
  import('@/components/product/Product3DViewer')
);
```

### 2. Model Optimization
- Use GLB format (binary, smaller size)
- Compress textures
- Reduce polygon count
- Remove unnecessary data

### 3. Progressive Loading
```tsx
<Suspense fallback={<LoadingSpinner />}>
  <Product3DViewer modelUrl={url} />
</Suspense>
```

### 4. Conditional Rendering
- Only load when 3D view is active
- Preload on hover (optional)
- Clean up on unmount

## 3D Model Guidelines

### File Format
- **GLB (Recommended)**: Binary format, smaller size, faster loading
- **GLTF**: JSON format, human-readable, easier to debug

### Optimization Checklist
- [ ] Model optimized (< 5MB recommended)
- [ ] Textures compressed (< 2MB each)
- [ ] Polygon count reasonable (< 100k triangles)
- [ ] No unnecessary animations
- [ ] Proper scaling (fits in default view)
- [ ] Origin point centered

### Tools for Optimization
- **Blender**: Free 3D modeling software
- **gltf-pipeline**: Command-line optimization tool
- **Sketchfab**: Online 3D model marketplace
- **Meshlab**: Mesh processing tool

### Conversion Tools
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Optimize GLB file
gltf-pipeline -i input.glb -o output.glb

# Convert GLTF to GLB
gltf-pipeline -i input.gltf -o output.glb
```

## Troubleshooting

### Model Not Loading

**Problem:** 3D model fails to load
**Solutions:**
1. Check file URL is accessible
2. Verify file format (GLB or GLTF)
3. Check file size (large files may timeout)
4. Test in browser console for CORS errors

### Performance Issues

**Problem:** Slow rendering or laggy controls
**Solutions:**
1. Optimize model (reduce polygons)
2. Compress textures
3. Reduce lighting complexity
4. Disable auto-rotate on low-end devices

### Controls Not Working

**Problem:** Cannot rotate or zoom
**Solutions:**
1. Check OrbitControls is properly initialized
2. Verify canvas has proper event listeners
3. Check for z-index conflicts
4. Test in different browsers

### Mobile Issues

**Problem:** Poor experience on mobile devices
**Solutions:**
1. Simplify model for mobile
2. Reduce texture quality
3. Disable shadows on mobile
4. Use touch-optimized controls

## Browser Support

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partially Supported
- Older browsers may lack WebGL 2.0
- Fallback to static images recommended

### Checking Support
```typescript
function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}
```

## Demo Page

A dedicated demo page is available at `/demo-3d` showcasing:
- Interactive 3D viewer
- Control instructions
- Implementation guide
- Usage examples

## Future Enhancements

### Planned Features
1. **AR Mode**: View products in augmented reality
2. **Model Variants**: Switch between different materials
3. **Annotations**: Add clickable hotspots
4. **Measurements**: Display dimensions
5. **360° Video Fallback**: For unsupported devices
6. **Material Editor**: Customize colors and finishes
7. **Comparison Mode**: Side-by-side model viewing
8. **Social Sharing**: Share 3D view links

### Advanced Features
- **VR Support**: Full VR experience
- **Animation Playback**: Showcase opening mechanisms
- **Customization**: Real-time jewelry customization
- **AI Sizing**: Virtual try-on with face detection

## Best Practices

### Development
1. Always test on real devices
2. Monitor performance metrics
3. Optimize before deploying
4. Provide fallback images
5. Handle errors gracefully

### Design
1. Keep UI minimal and intuitive
2. Provide clear instructions
3. Use consistent controls
4. Match brand aesthetics
5. Ensure accessibility

### Content
1. Use high-quality models
2. Maintain consistent scale
3. Position models properly
4. Add appropriate lighting
5. Test on various devices

## Resources

### Documentation
- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Three Drei](https://github.com/pmndrs/drei)
- [GLB File Format](https://www.khronos.org/gltf/)

### Tools
- [Blender](https://www.blender.org/) - 3D modeling
- [Sketchfab](https://sketchfab.com/) - 3D model marketplace
- [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline) - Optimization
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/) - Testing

### Tutorials
- [Three.js Journey](https://threejs-journey.com/)
- [React Three Fiber Tutorial](https://threejs-journey.com/lessons/react-three-fiber)
- [3D Jewelry Rendering](https://www.youtube.com/results?search_query=jewelry+3d+rendering)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify model format and size
3. Test with sample models
4. Review documentation
5. Contact development team

---

**3D Viewer Status:** ✅ Fully Implemented
**Performance:** Optimized for production
**Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)
**Mobile:** Touch-optimized controls
**Demo Available:** Yes (`/demo-3d`)
