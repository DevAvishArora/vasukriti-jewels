'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Upload, ArrowLeft } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BrandStoryEditor() {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('/images/brand-story.png');
  
  const [heading, setHeading] = useState('Crafting Timeless Elegance');
  const [paragraph1, setParagraph1] = useState('For over three decades, Vasukriti has been synonymous with exceptional craftsmanship and timeless design. Each piece tells a story of heritage, artistry, and unwavering commitment to quality.');
  const [paragraph2, setParagraph2] = useState('Our master artisans blend traditional Indian jewelry-making techniques with contemporary aesthetics, creating pieces that transcend generations.');
  
  const [features, setFeatures] = useState([
    { icon: 'Gem', title: 'Handcrafted Excellence', description: 'Every piece meticulously crafted by master artisans' },
    { icon: 'Shield', title: 'BIS Hallmarked', description: 'Certified purity and quality guaranteed' },
    { icon: 'Award', title: 'Heritage Design', description: 'Traditional craftsmanship meets modern elegance' },
  ]);
  
  const [ctaText, setCtaText] = useState('Discover Our Story');
  const [ctaLink, setCtaLink] = useState('/about');

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/cms/brand-story');
        const data = response.data.data;
        setImageUrl(data.image);
        setHeading(data.heading);
        setParagraph1(data.paragraph1);
        setParagraph2(data.paragraph2);
        
        // Always ensure we have 3 features
        if (data.features && data.features.length === 3) {
          setFeatures(data.features);
        }
        
        if (data.ctaText) setCtaText(data.ctaText);
        if (data.ctaLink) setCtaLink(data.ctaLink);
        console.log('Loaded brand story data:', data);
        console.log('Features:', features);
      } catch (error) {
        console.error('Error fetching brand story:', error);
        toast.error('Failed to load data', {
          description: 'Using default values instead.',
        });
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'brand-story');

      const response = await axiosInstance.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl = response.data.data.url;
      setImageUrl(uploadedUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      
      // Save to backend
      await axiosInstance.post('/cms/brand-story', {
        image: imageUrl,
        heading,
        paragraph1,
        paragraph2,
        features,
        ctaText,
        ctaLink,
      });

      toast.success('Changes saved successfully!', {
        description: 'Your brand story has been updated on the homepage.',
      });
      setSaved(true);
      
      // Reset saved state after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save changes', {
        description: 'Please try again or check your connection.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/cms">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to CMS
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Story</h1>
          <p className="text-gray-600 mt-1">Edit the brand story section on your homepage</p>
          {saved && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
              ✅ Changes saved successfully!
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Brand Story Image</CardTitle>
            <p className="text-sm text-gray-600">Upload or change the section image</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Image Preview */}
            <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={imageUrl}
                alt="Brand Story"
                fill
                className="object-cover"
              />
            </div>

            {/* Upload Button */}
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={uploading}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Image
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-2">Recommended: 800x600px, Max 5MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Text Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text Content</CardTitle>
            <p className="text-sm text-gray-600">Edit the heading and paragraphs</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Heading
              </label>
              <Input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="text-lg font-medium"
                placeholder="Enter heading..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Paragraph
              </label>
              <textarea
                value={paragraph1}
                onChange={(e) => setParagraph1(e.target.value)}
                rows={4}
                className="w-full p-3 border-2 border-gray-200 rounded-md focus:border-amber-500 focus:outline-none resize-none"
                placeholder="Enter first paragraph..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Second Paragraph
              </label>
              <textarea
                value={paragraph2}
                onChange={(e) => setParagraph2(e.target.value)}
                rows={4}
                className="w-full p-3 border-2 border-gray-200 rounded-md focus:border-amber-500 focus:outline-none resize-none"
                placeholder="Enter second paragraph..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Editor - Full Width */}
      <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-300">
        <h2 className="text-xl font-bold mb-2">Features (3 Points)</h2>
        <p className="text-sm text-gray-600 mb-4">Edit the three feature points shown below the text</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="p-4 bg-white rounded-lg space-y-3 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700">
                Feature {index + 1}
              </label>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                <select
                  value={feature.icon || 'Gem'}
                  onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[index].icon = e.target.value;
                    setFeatures(newFeatures);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="Gem">💎 Gem</option>
                  <option value="Shield">🛡️ Shield</option>
                  <option value="Award">🏆 Award</option>
                  <option value="Star">⭐ Star</option>
                  <option value="Heart">❤️ Heart</option>
                  <option value="Sparkles">✨ Sparkles</option>
                  <option value="Crown">👑 Crown</option>
                  <option value="CheckCircle">✅ Check</option>
                </select>
              </div>
              
              <Input
                type="text"
                value={feature.title}
                onChange={(e) => {
                  const newFeatures = [...features];
                  newFeatures[index].title = e.target.value;
                  setFeatures(newFeatures);
                }}
                placeholder="Feature title"
                className="font-medium"
              />
              <Input
                type="text"
                value={feature.description}
                onChange={(e) => {
                  const newFeatures = [...features];
                  newFeatures[index].description = e.target.value;
                  setFeatures(newFeatures);
                }}
                placeholder="Feature description"
                className="text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button Editor */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
        <h2 className="text-xl font-bold mb-2">Call-to-Action Button</h2>
        <p className="text-sm text-gray-600 mb-4">Edit the button text and link</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
            <Input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g., Discover Our Story"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Button Link</label>
            <Input
              type="text"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g., /about"
            />
          </div>
        </div>
      </div>

     
    </div>
  );
}
