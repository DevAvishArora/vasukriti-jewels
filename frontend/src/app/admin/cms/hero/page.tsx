'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Eye,
  Upload,
  Check,
  Clock,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axiosInstance from '@/lib/axios-instance';
import { toast } from 'sonner';

interface HeroImage {
  url: string;
  publicId: string;
  alt: string;
}

interface HeroSection {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  images: HeroImage[];
  cta: {
    text: string;
    link: string;
    style: string;
  };
  secondaryCta: {
    text: string;
    link: string;
    style: string;
  };
  design: {
    layout: string;
    overlay: {
      enabled: boolean;
      color: string;
    };
    textAlignment: string;
    animation: string;
    height: string;
  };
  isActive: boolean;
  isDraft: boolean;
  order: number;
}

const layoutOptions = [
  { value: 'fullscreen', label: 'Full Screen', description: 'Cover entire viewport' },
  { value: 'split', label: 'Split View', description: 'Image and content side by side' },
  { value: 'centered', label: 'Centered', description: 'Content centered over image' },
  { value: 'minimal', label: 'Minimal', description: 'Simple layout with minimal styling' },
  { value: 'carousel', label: 'Carousel', description: 'Multiple rotating slides' },
];

const animationOptions = [
  { value: 'fade', label: 'Fade In' },
  { value: 'slide', label: 'Slide Up' },
  { value: 'zoom', label: 'Zoom In' },
  { value: 'none', label: 'No Animation' },
];

export default function HeroPage() {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const defaultHero: HeroSection = {
    title: 'New Hero Section',
    subtitle: '',
    description: '',
    images: [],
    cta: {
      text: 'Shop Now',
      link: '/shop',
      style: 'primary',
    },
    secondaryCta: {
      text: '',
      link: '',
      style: 'outline',
    },
    design: {
      layout: 'fullscreen',
      overlay: {
        enabled: true,
        color: 'rgba(0, 0, 0, 0.4)',
      },
      textAlignment: 'center',
      animation: 'fade',
      height: '100vh',
    },
    isActive: true,
    isDraft: false,
    order: 0,
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cms/hero');
      setHeroes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      toast.error('Failed to load hero sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingHero) return;

    if (!editingHero.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setLoading(true);
      if (editingHero._id) {
        await axiosInstance.put(`/cms/hero/${editingHero._id}`, editingHero);
        toast.success('Hero section updated successfully');
      } else {
        await axiosInstance.post('/cms/hero', editingHero);
        toast.success('Hero section created successfully');
      }
      setEditingHero(null);
      setIsCreating(false);
      fetchHeroes();
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('Failed to save hero section');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/cms/hero/${id}/publish`);
      toast.success('Hero section published successfully');
      fetchHeroes();
    } catch (error) {
      console.error('Error publishing hero section:', error);
      toast.error('Failed to publish hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/cms/hero/${id}`);
      toast.success('Hero section deleted successfully');
      fetchHeroes();
    } catch (error) {
      console.error('Error deleting hero section:', error);
      toast.error('Failed to delete hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'hero');

      const response = await axiosInstance.post('/upload/image', formData, {
        headers: {
          'Content-Type': undefined, // Let browser set it with boundary
        },
      });
      
      if (editingHero) {
        setEditingHero({
          ...editingHero,
          images: [
            ...editingHero.images,
            {
              url: response.data.data.url,
              publicId: response.data.data.publicId,
              alt: editingHero.title,
            },
          ],
        });
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    if (!editingHero) return;
    setEditingHero({
      ...editingHero,
      images: editingHero.images.filter((_, i) => i !== index),
    });
  };

  if (isCreating || editingHero) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingHero(null);
                  setIsCreating(false);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingHero?._id ? 'Edit' : 'Create'} Hero Section
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-[#7e1219] hover:bg-[#6a0f15]"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {previewMode && editingHero && (
            <Card className="mb-6">
              <CardContent className="p-0">
                <div
                  className="relative overflow-hidden"
                  style={{ height: editingHero.design.height }}
                >
                  {editingHero.images[0]?.url && (
                    <Image
                      src={editingHero.images[0].url}
                      alt={editingHero.images[0].alt}
                      fill
                      className="object-cover"
                    />
                  )}
                  {editingHero.design.overlay.enabled && (
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: editingHero.design.overlay.color }}
                    />
                  )}
                  <div
                    className={`absolute inset-0 flex items-center ${
                      editingHero.design.textAlignment === 'left'
                        ? 'justify-start pl-12'
                        : editingHero.design.textAlignment === 'right'
                        ? 'justify-end pr-12'
                        : 'justify-center'
                    }`}
                  >
                    <div className="text-white text-center max-w-3xl">
                      <h1 className="text-5xl font-bold mb-4">{editingHero.title}</h1>
                      {editingHero.subtitle && (
                        <p className="text-2xl mb-2">{editingHero.subtitle}</p>
                      )}
                      {editingHero.description && (
                        <p className="text-lg mb-8">{editingHero.description}</p>
                      )}
                      <div className="flex gap-4 justify-center">
                        {editingHero.cta.text && (
                          <Button className="bg-white text-gray-900 hover:bg-gray-100">
                            {editingHero.cta.text}
                          </Button>
                        )}
                        {editingHero.secondaryCta.text && (
                          <Button variant="outline" className="text-white border-white">
                            {editingHero.secondaryCta.text}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={editingHero?.title || ''}
                      onChange={(e) =>
                        setEditingHero(editingHero ? { ...editingHero, title: e.target.value } : null)
                      }
                      placeholder="Discover Timeless Elegance"
                    />
                  </div>

                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={editingHero?.subtitle || ''}
                      onChange={(e) =>
                        setEditingHero(editingHero ? { ...editingHero, subtitle: e.target.value } : null)
                      }
                      placeholder="Exquisite Jewelry Collection"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editingHero?.description || ''}
                      onChange={(e) =>
                        setEditingHero(editingHero ? { ...editingHero, description: e.target.value } : null)
                      }
                      placeholder="Crafted with precision and passion..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Primary CTA Text</Label>
                      <Input
                        value={editingHero?.cta.text || ''}
                        onChange={(e) =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  cta: { ...editingHero.cta, text: e.target.value },
                                }
                              : null
                          )
                        }
                        placeholder="Shop Now"
                      />
                    </div>
                    <div>
                      <Label>Primary CTA Link</Label>
                      <Input
                        value={editingHero?.cta.link || ''}
                        onChange={(e) =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  cta: { ...editingHero.cta, link: e.target.value },
                                }
                              : null
                          )
                        }
                        placeholder="/shop"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Secondary CTA Text (Optional)</Label>
                      <Input
                        value={editingHero?.secondaryCta.text || ''}
                        onChange={(e) =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  secondaryCta: { ...editingHero.secondaryCta, text: e.target.value },
                                }
                              : null
                          )
                        }
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <Label>Secondary CTA Link</Label>
                      <Input
                        value={editingHero?.secondaryCta.link || ''}
                        onChange={(e) =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  secondaryCta: { ...editingHero.secondaryCta, link: e.target.value },
                                }
                              : null
                          )
                        }
                        placeholder="/about"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Images</CardTitle>
                  <CardDescription>Upload images for your hero section</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {editingHero?.images.map((image, index) => (
                      <div key={index} className="relative aspect-video border-2 rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="hero-image-upload"
                      disabled={uploadingImage}
                    />
                    <label htmlFor="hero-image-upload" className="cursor-pointer">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">
                        {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {layoutOptions.map((layout) => (
                      <button
                        key={layout.value}
                        onClick={() =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  design: { ...editingHero.design, layout: layout.value },
                                }
                              : null
                          )
                        }
                        className={`border-2 rounded-lg p-4 text-center hover:border-[#7e1219] transition-colors ${
                          editingHero?.design.layout === layout.value
                            ? 'border-[#7e1219] bg-red-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="aspect-video bg-gray-100 rounded mb-2" />
                        <p className="text-xs font-medium">{layout.label}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Design Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Text Alignment</Label>
                      <Select
                        value={editingHero?.design.textAlignment}
                        onValueChange={(value) =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  design: { ...editingHero.design, textAlignment: value },
                                }
                              : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Animation</Label>
                      <Select
                        value={editingHero?.design.animation}
                        onValueChange={(value) =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  design: { ...editingHero.design, animation: value },
                                }
                              : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {animationOptions.map((anim) => (
                            <SelectItem key={anim.value} value={anim.value}>
                              {anim.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Height</Label>
                      <Select
                        value={editingHero?.design.height}
                        onValueChange={(value) =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  design: { ...editingHero.design, height: value },
                                }
                              : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50vh">Half Screen</SelectItem>
                          <SelectItem value="75vh">3/4 Screen</SelectItem>
                          <SelectItem value="100vh">Full Screen</SelectItem>
                          <SelectItem value="600px">600px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Overlay</Label>
                        <p className="text-sm text-gray-600">Add dark overlay over image</p>
                      </div>
                      <Switch
                        checked={editingHero?.design.overlay.enabled}
                        onCheckedChange={(checked) =>
                          setEditingHero(
                            editingHero
                              ? {
                                  ...editingHero,
                                  design: {
                                    ...editingHero.design,
                                    overlay: { ...editingHero.design.overlay, enabled: checked },
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>

                    {editingHero?.design.overlay.enabled && (
                      <div>
                        <Label>Overlay Color</Label>
                        <Input
                          value={editingHero?.design.overlay.color}
                          onChange={(e) =>
                            setEditingHero(
                              editingHero
                                ? {
                                    ...editingHero,
                                    design: {
                                      ...editingHero.design,
                                      overlay: { ...editingHero.design.overlay, color: e.target.value },
                                    },
                                  }
                                : null
                            )
                          }
                          placeholder="rgba(0, 0, 0, 0.4)"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Publication Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={editingHero?.order || 0}
                      onChange={(e) =>
                        setEditingHero(
                          editingHero ? { ...editingHero, order: parseInt(e.target.value) || 0 } : null
                        )
                      }
                    />
                    <p className="text-xs text-gray-600 mt-1">Lower numbers appear first</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <Label>Active</Label>
                      <p className="text-sm text-gray-600">Show on website</p>
                    </div>
                    <Switch
                      checked={editingHero?.isActive}
                      onCheckedChange={(checked) =>
                        setEditingHero(editingHero ? { ...editingHero, isActive: checked } : null)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Save as Draft</Label>
                      <p className="text-sm text-gray-600">Keep unpublished</p>
                    </div>
                    <Switch
                      checked={editingHero?.isDraft}
                      onCheckedChange={(checked) =>
                        setEditingHero(editingHero ? { ...editingHero, isDraft: checked } : null)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/cms">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to CMS
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Hero Section Management</h1>
            <p className="text-gray-600">Create and manage homepage hero banners</p>
          </div>
          <Button
            onClick={() => {
              setEditingHero(defaultHero);
              setIsCreating(true);
            }}
            className="bg-[#7e1219] hover:bg-[#6a0f15]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Hero
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">Loading...</p>
              </CardContent>
            </Card>
          ) : heroes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600 mb-4">No hero sections created yet</p>
                <Button
                  onClick={() => {
                    setEditingHero(defaultHero);
                    setIsCreating(true);
                  }}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Hero Section
                </Button>
              </CardContent>
            </Card>
          ) : (
            heroes.map((hero) => (
              <motion.div
                key={hero._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-1 relative aspect-video">
                        {hero.images[0]?.url ? (
                          <Image
                            src={hero.images[0].url}
                            alt={hero.images[0].alt}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{hero.title}</h3>
                              {hero.isActive && !hero.isDraft && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  Active
                                </span>
                              )}
                              {hero.isDraft && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Draft
                                </span>
                              )}
                            </div>
                            {hero.subtitle && (
                              <p className="text-sm text-gray-600 mb-2">{hero.subtitle}</p>
                            )}
                            <p className="text-sm text-gray-500 mb-3">
                              Layout: {hero.design.layout} • Order: {hero.order}
                            </p>
                            {hero.cta.text && (
                              <div className="flex gap-2">
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  {hero.cta.text} → {hero.cta.link}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingHero(hero)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {hero.isDraft && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => hero._id && handlePublish(hero._id)}
                              >
                                Publish
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => hero._id && handleDelete(hero._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
