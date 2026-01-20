'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  ArrowLeft,
  Eye,
  FileText,
  Palette,
  Settings,
  Image as ImageIcon,
  Plus,
  X,
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

interface StaticImage {
  url: string;
  alt: string;
  caption?: string;
}

interface ContentItem {
  title: string;
  description: string;
  icon?: string;
}

interface StaticContent {
  _id?: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  content: string;
  richContent?: any;
  images: StaticImage[];
  items: ContentItem[];
  design: {
    layout: string;
    backgroundColor: string;
    textColor: string;
    padding: string;
  };
  isActive: boolean;
  isDraft: boolean;
}

const sectionOptions = [
  { value: 'about', label: 'About Us', description: 'Company information and story' },
  { value: 'brand-story', label: 'Brand Story', description: 'Heritage and values' },
  { value: 'why-choose-us', label: 'Why Choose Us', description: 'Key benefits and features' },
  { value: 'testimonials', label: 'Testimonials', description: 'Customer reviews' },
  { value: 'newsletter', label: 'Newsletter', description: 'Newsletter section content' },
  { value: 'features', label: 'Features', description: 'Product highlights and benefits' },
  { value: 'trust-badges', label: 'Trust Badges', description: 'Security and quality assurances' },
  { value: 'shipping-info', label: 'Shipping Info', description: 'Delivery information' },
  { value: 'contact', label: 'Contact', description: 'Contact information' },
  { value: 'privacy-policy', label: 'Privacy Policy', description: 'Privacy terms' },
  { value: 'terms', label: 'Terms & Conditions', description: 'Usage terms' },
  { value: 'returns', label: 'Returns Policy', description: 'Return and refund policy' },
];

const layoutOptions = [
  { value: 'centered', label: 'Centered' },
  { value: 'split', label: 'Split Layout' },
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'cards', label: 'Cards' },
];

export default function StaticContentPage() {
  const [sections, setSections] = useState<StaticContent[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('about');
  const [editingContent, setEditingContent] = useState<StaticContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchAllSections();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      fetchSection(selectedSection);
    }
  }, [selectedSection]);

  const fetchAllSections = async () => {
    try {
      // Fetch from new page-content API
      const response = await axiosInstance.get('/page-content');
      const pageContents = response.data.data || [];
      
      // Transform page-content format to StaticContent format
      const transformedSections = pageContents.map((pc: any) => ({
        _id: pc._id,
        sectionKey: pc.page,
        title: pc.title,
        subtitle: pc.subtitle || '',
        content: '', // Will be built from sections
        richContent: null,
        images: [],
        items: [],
        design: {
          layout: 'centered',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          padding: 'normal',
        },
        isActive: pc.isActive,
        isDraft: false,
      }));
      
      setSections(transformedSections);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([]);
    }
  };

  const fetchSection = async (sectionKey: string) => {
    try {
      setLoading(true);
      // Try new page-content API first
      const response = await axiosInstance.get(`/page-content/${sectionKey}`);
      if (response.data.data) {
        const pc = response.data.data;
        
        // Transform to StaticContent format
        const transformed: StaticContent = {
          _id: pc._id,
          sectionKey: pc.page,
          title: pc.title,
          subtitle: pc.subtitle || '',
          content: '', // Built from sections
          richContent: pc.sections,
          images: [],
          items: [],
          design: {
            layout: 'centered',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            padding: 'normal',
          },
          isActive: pc.isActive,
          isDraft: false,
        };
        
        setEditingContent(transformed);
      } else {
        // Create default content for this section
        setEditingContent({
          sectionKey,
          title: sectionOptions.find((s) => s.value === sectionKey)?.label || '',
          subtitle: '',
          content: '',
          images: [],
          items: [],
          design: {
            layout: 'centered',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            padding: 'normal',
          },
          isActive: true,
          isDraft: false,
        });
      }
    } catch (error) {
      console.error('Error fetching section:', error);
      // Create default content on error
      setEditingContent({
        sectionKey,
        title: sectionOptions.find((s) => s.value === sectionKey)?.label || '',
        subtitle: '',
        content: '',
        images: [],
        items: [],
        design: {
          layout: 'centered',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          padding: 'normal',
        },
        isActive: true,
        isDraft: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingContent) return;

    if (!editingContent.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setLoading(true);
      
      // Transform StaticContent format back to page-content API format
      const pageContentData = {
        page: editingContent.sectionKey,
        title: editingContent.title,
        subtitle: editingContent.subtitle,
        sections: editingContent.richContent || [],
        isActive: editingContent.isActive,
      };
      
      // Use new page-content API
      if (editingContent._id) {
        await axiosInstance.put(`/page-content/${editingContent.sectionKey}`, pageContentData);
      } else {
        await axiosInstance.post('/page-content', pageContentData);
      }
      toast.success('Content saved successfully');
      fetchAllSections();
      fetchSection(editingContent.sectionKey);
    } catch (error: any) {
      console.error('Error saving content:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save content';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!editingContent?.sectionKey) return;

    try {
      setLoading(true);
      await axiosInstance.patch(`/page-content/${editingContent.sectionKey}/toggle`);
      toast.success('Content published successfully');
      fetchSection(editingContent.sectionKey);
    } catch (error) {
      console.error('Error publishing content:', error);
      toast.error('Failed to publish content');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!editingContent) return;
    setEditingContent({
      ...editingContent,
      items: [
        ...editingContent.items,
        { title: '', description: '', icon: '' },
      ],
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    if (!editingContent) return;
    const newItems = [...editingContent.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingContent({ ...editingContent, items: newItems });
  };

  const removeItem = (index: number) => {
    if (!editingContent) return;
    setEditingContent({
      ...editingContent,
      items: editingContent.items.filter((_, i) => i !== index),
    });
  };

  const addImage = () => {
    if (!editingContent) return;
    setEditingContent({
      ...editingContent,
      images: [
        ...editingContent.images,
        { url: '', alt: '', caption: '' },
      ],
    });
  };

  const updateImage = (index: number, field: string, value: string) => {
    if (!editingContent) return;
    const newImages = [...editingContent.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setEditingContent({ ...editingContent, images: newImages });
  };

  const removeImage = (index: number) => {
    if (!editingContent) return;
    setEditingContent({
      ...editingContent,
      images: editingContent.images.filter((_, i) => i !== index),
    });
  };

  const currentSectionInfo = sectionOptions.find(
    (s) => s.value === selectedSection
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/cms">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to CMS
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Static Content Editor</h1>
          <p className="text-gray-600">Manage website content and pages</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Section Selector */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {sectionOptions.map((section) => {
                    const hasContent = sections.some(
                      (s) => s.sectionKey === section.value && s.isActive
                    );
                    return (
                      <button
                        key={section.value}
                        onClick={() => setSelectedSection(section.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedSection === section.value
                            ? 'bg-[#7e1219] text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{section.label}</span>
                          {hasContent && (
                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            {loading && !editingContent ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600">Loading...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {currentSectionInfo?.label}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {currentSectionInfo?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {previewMode ? 'Edit Mode' : 'Preview'}
                    </Button>
                    {editingContent?.isDraft && editingContent._id && (
                      <Button
                        onClick={handlePublish}
                        disabled={loading}
                        variant="outline"
                      >
                        Publish
                      </Button>
                    )}
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

                {previewMode ? (
                  <Card>
                    <CardContent className="p-8">
                      <div
                        className="prose max-w-none"
                        style={{
                          backgroundColor: editingContent?.design.backgroundColor,
                          color: editingContent?.design.textColor,
                        }}
                      >
                        <h1>{editingContent?.title}</h1>
                        {editingContent?.subtitle && (
                          <h2 className="text-xl text-gray-600">
                            {editingContent.subtitle}
                          </h2>
                        )}
                        {editingContent?.content && (
                          <div className="whitespace-pre-wrap">
                            {editingContent.content}
                          </div>
                        )}
                        {editingContent?.images && editingContent.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 my-6">
                            {editingContent.images.map((img, idx) => (
                              <div key={idx}>
                                {img.url && (
                                  <Image
                                    src={img.url}
                                    alt={img.alt}
                                    width={400}
                                    height={300}
                                    className="rounded-lg"
                                  />
                                )}
                                {img.caption && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    {img.caption}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {editingContent?.items && editingContent.items.length > 0 && (
                          <div className="grid gap-4 my-6">
                            {editingContent.items.map((item, idx) => (
                              <div key={idx} className="border-l-4 border-[#7e1219] pl-4">
                                {item.icon && <span className="text-2xl mr-2">{item.icon}</span>}
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Tabs defaultValue="content" className="space-y-6">
                    <TabsList>
                      <TabsTrigger value="content">
                        <FileText className="h-4 w-4 mr-2" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger value="items">
                        <Plus className="h-4 w-4 mr-2" />
                        Items
                      </TabsTrigger>
                      <TabsTrigger value="images">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Images
                      </TabsTrigger>
                      <TabsTrigger value="design">
                        <Palette className="h-4 w-4 mr-2" />
                        Design
                      </TabsTrigger>
                      <TabsTrigger value="settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content">
                      <Card>
                        <CardHeader>
                          <CardTitle>Basic Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Title *</Label>
                            <Input
                              value={editingContent?.title || ''}
                              onChange={(e) =>
                                setEditingContent(
                                  editingContent
                                    ? { ...editingContent, title: e.target.value }
                                    : null
                                )
                              }
                              placeholder="Section Title"
                            />
                          </div>

                          <div>
                            <Label>Subtitle</Label>
                            <Input
                              value={editingContent?.subtitle || ''}
                              onChange={(e) =>
                                setEditingContent(
                                  editingContent
                                    ? { ...editingContent, subtitle: e.target.value }
                                    : null
                                )
                              }
                              placeholder="Optional subtitle"
                            />
                          </div>

                          <div>
                            <Label>Content</Label>
                            <Textarea
                              value={editingContent?.content || ''}
                              onChange={(e) =>
                                setEditingContent(
                                  editingContent
                                    ? { ...editingContent, content: e.target.value }
                                    : null
                                )
                              }
                              placeholder="Main content text..."
                              rows={12}
                            />
                            <p className="text-xs text-gray-600 mt-1">
                              Supports line breaks and basic formatting
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="items">
                      <Card>
                        <CardHeader>
                          <CardTitle>Content Items</CardTitle>
                          <CardDescription>
                            Add features, testimonials, or bullet points
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {editingContent?.items.map((item, index) => (
                            <Card key={index}>
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label>Item {index + 1}</Label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <Label>Icon/Emoji</Label>
                                    <Input
                                      value={item.icon || ''}
                                      onChange={(e) =>
                                        updateItem(index, 'icon', e.target.value)
                                      }
                                      placeholder="✨"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Label>Title</Label>
                                    <Input
                                      value={item.title}
                                      onChange={(e) =>
                                        updateItem(index, 'title', e.target.value)
                                      }
                                      placeholder="Feature title"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <Textarea
                                    value={item.description}
                                    onChange={(e) =>
                                      updateItem(index, 'description', e.target.value)
                                    }
                                    placeholder="Feature description"
                                    rows={3}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <Button
                            variant="outline"
                            onClick={addItem}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="images">
                      <Card>
                        <CardHeader>
                          <CardTitle>Images</CardTitle>
                          <CardDescription>
                            Add images to your content section
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {editingContent?.images.map((image, index) => (
                            <Card key={index}>
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label>Image {index + 1}</Label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div>
                                  <Label>Image URL</Label>
                                  <Input
                                    value={image.url}
                                    onChange={(e) =>
                                      updateImage(index, 'url', e.target.value)
                                    }
                                    placeholder="https://..."
                                  />
                                </div>
                                <div>
                                  <Label>Alt Text</Label>
                                  <Input
                                    value={image.alt}
                                    onChange={(e) =>
                                      updateImage(index, 'alt', e.target.value)
                                    }
                                    placeholder="Image description"
                                  />
                                </div>
                                <div>
                                  <Label>Caption (Optional)</Label>
                                  <Input
                                    value={image.caption || ''}
                                    onChange={(e) =>
                                      updateImage(index, 'caption', e.target.value)
                                    }
                                    placeholder="Image caption"
                                  />
                                </div>
                                {image.url && (
                                  <div className="relative aspect-video rounded-lg overflow-hidden border-2">
                                    <Image
                                      src={image.url}
                                      alt={image.alt}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                          <Button
                            variant="outline"
                            onClick={addImage}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Image
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="design">
                      <Card>
                        <CardHeader>
                          <CardTitle>Design Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Layout</Label>
                            <Select
                              value={editingContent?.design.layout}
                              onValueChange={(value) =>
                                setEditingContent(
                                  editingContent
                                    ? {
                                        ...editingContent,
                                        design: { ...editingContent.design, layout: value },
                                      }
                                    : null
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {layoutOptions.map((layout) => (
                                  <SelectItem key={layout.value} value={layout.value}>
                                    {layout.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Background Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  value={editingContent?.design.backgroundColor}
                                  onChange={(e) =>
                                    setEditingContent(
                                      editingContent
                                        ? {
                                            ...editingContent,
                                            design: {
                                              ...editingContent.design,
                                              backgroundColor: e.target.value,
                                            },
                                          }
                                        : null
                                    )
                                  }
                                  className="w-20"
                                />
                                <Input
                                  value={editingContent?.design.backgroundColor}
                                  onChange={(e) =>
                                    setEditingContent(
                                      editingContent
                                        ? {
                                            ...editingContent,
                                            design: {
                                              ...editingContent.design,
                                              backgroundColor: e.target.value,
                                            },
                                          }
                                        : null
                                    )
                                  }
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Text Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  value={editingContent?.design.textColor}
                                  onChange={(e) =>
                                    setEditingContent(
                                      editingContent
                                        ? {
                                            ...editingContent,
                                            design: {
                                              ...editingContent.design,
                                              textColor: e.target.value,
                                            },
                                          }
                                        : null
                                    )
                                  }
                                  className="w-20"
                                />
                                <Input
                                  value={editingContent?.design.textColor}
                                  onChange={(e) =>
                                    setEditingContent(
                                      editingContent
                                        ? {
                                            ...editingContent,
                                            design: {
                                              ...editingContent.design,
                                              textColor: e.target.value,
                                            },
                                          }
                                        : null
                                    )
                                  }
                                  placeholder="#1f2937"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Padding</Label>
                            <Select
                              value={editingContent?.design.padding}
                              onValueChange={(value) =>
                                setEditingContent(
                                  editingContent
                                    ? {
                                        ...editingContent,
                                        design: { ...editingContent.design, padding: value },
                                      }
                                    : null
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
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
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Active</Label>
                              <p className="text-sm text-gray-600">
                                Show this content on the website
                              </p>
                            </div>
                            <Switch
                              checked={editingContent?.isActive}
                              onCheckedChange={(checked) =>
                                setEditingContent(
                                  editingContent
                                    ? { ...editingContent, isActive: checked }
                                    : null
                                )
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Save as Draft</Label>
                              <p className="text-sm text-gray-600">
                                Keep changes unpublished
                              </p>
                            </div>
                            <Switch
                              checked={editingContent?.isDraft}
                              onCheckedChange={(checked) =>
                                setEditingContent(
                                  editingContent
                                    ? { ...editingContent, isDraft: checked }
                                    : null
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
