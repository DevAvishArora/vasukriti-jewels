'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/lib/axios-instance';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageData {
  url: string;
  publicId?: string;
  alt?: string;
  isPrimary?: boolean;
}

interface ImageUploadProps {
  readonly label?: string;
  readonly value: ImageData[];
  readonly onChange: (images: ImageData[]) => void;
  readonly maxImages?: number;
  readonly required?: boolean;
  readonly folder?: string;
}

export function ImageUpload({
  label = 'Images',
  value = [],
  onChange,
  maxImages = 10,
  required = false,
  folder = 'vasukriti-jewels',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const invalidFiles = filesToUpload.filter(
      (file) => !file.type.startsWith('image/')
    );

    if (invalidFiles.length > 0) {
      toast.error('Please select only image files');
      return;
    }

    const oversizedFiles = filesToUpload.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);

        console.log('Uploading file:', file.name, file.type, file.size);

        const response = await axiosInstance.post('/upload/image', formData, {
          headers: {
            'Content-Type': undefined, // Let browser set it with boundary
          },
        });

        return {
          url: response.data.data.url,
          publicId: response.data.data.publicId,
          alt: '',
          isPrimary: value.length === 0 && filesToUpload.indexOf(file) === 0,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedImages]);

      toast.success(
        `${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} uploaded successfully`
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    
    // If we removed the primary image, make the first image primary
    if (value[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    onChange(newImages);
    toast.success('Image removed');
  };

  const updateAlt = (index: number, alt: string) => {
    const newImages = [...value];
    newImages[index].alt = alt;
    onChange(newImages);
  };

  const setPrimary = (index: number) => {
    const newImages = value.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {value.length > 0 && (
          <span className="text-sm text-gray-500">
            {value.length} of {maxImages} images
          </span>
        )}
      </div>

      {/* Upload Area */}
      {value.length < maxImages && (
        <button
          type="button"
          className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
              <p className="text-sm text-gray-600">Uploading images...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop images here, or click to browse
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium mt-2">
                <ImageIcon className="h-4 w-4" />
                Choose Images
              </span>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, WEBP up to 5MB each
              </p>
            </>
          )}
        </button>
      )}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.map((image, index) => (
            <div
              key={image.url || index}
              className="border rounded-lg p-4 space-y-3 relative bg-white"
            >
              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full z-10">
                  Primary
                </div>
              )}

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute top-2 left-2 z-10 bg-white/80 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Image Preview */}
              <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Image Info */}
              <div className="space-y-2">
                <Input
                  placeholder="Alt text (for SEO)"
                  value={image.alt || ''}
                  onChange={(e) => updateAlt(index, e.target.value)}
                />
                
                {!image.isPrimary && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPrimary(index)}
                    className="w-full"
                  >
                    Set as Primary Image
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {required && value.length === 0 && (
        <p className="text-xs text-red-500">At least one image is required</p>
      )}
    </div>
  );
}
