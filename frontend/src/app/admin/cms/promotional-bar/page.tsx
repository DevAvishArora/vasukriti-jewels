'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  ArrowLeft,
  Palette,
  Clock,
  Check,
} from 'lucide-react';
import Link from 'next/link';
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

interface Message {
  text: string;
  link: string;
  icon: string;
}

interface PromotionalBar {
  _id?: string;
  messages: Message[];
  design: {
    type: 'sliding' | 'rotating' | 'static' | 'ticker';
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    animation: {
      speed: number;
      direction: 'left' | 'right' | 'up' | 'down';
    };
  };
  isActive: boolean;
  isDraft: boolean;
}

export default function PromotionalBarPage() {
  const [bars, setBars] = useState<PromotionalBar[]>([]);
  const [editingBar, setEditingBar] = useState<PromotionalBar | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const defaultBar: PromotionalBar = {
    messages: [
      { text: 'New promotional message', link: '', icon: '🎁' },
    ],
    design: {
      type: 'sliding',
      backgroundColor: '#7e1219',
      textColor: '#ffffff',
      fontSize: '14px',
      animation: {
        speed: 30,
        direction: 'left',
      },
    },
    isActive: false,
    isDraft: true,
  };

  useEffect(() => {
    fetchBars();
  }, []);

  const fetchBars = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cms/promotional-bar');
      setBars(response.data.data.promotionalBars || []);
    } catch (error) {
      console.error('Error fetching promotional bars:', error);
      toast.error('Failed to load promotional bars');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingBar) return;

    try {
      setLoading(true);
      if (editingBar._id) {
        // Update existing
        await axiosInstance.put(`/cms/promotional-bar/${editingBar._id}`, editingBar);
        toast.success('Promotional bar updated successfully');
      } else {
        // Create new
        await axiosInstance.post('/cms/promotional-bar', editingBar);
        toast.success('Promotional bar created successfully');
      }
      setEditingBar(null);
      setIsCreating(false);
      fetchBars();
    } catch (error) {
      console.error('Error saving promotional bar:', error);
      toast.error('Failed to save promotional bar');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/cms/promotional-bar/${id}/publish`);
      toast.success('Promotional bar published successfully');
      fetchBars();
    } catch (error) {
      console.error('Error publishing promotional bar:', error);
      toast.error('Failed to publish promotional bar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional bar?')) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/cms/promotional-bar/${id}`);
      toast.success('Promotional bar deleted successfully');
      fetchBars();
    } catch (error) {
      console.error('Error deleting promotional bar:', error);
      toast.error('Failed to delete promotional bar');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = () => {
    if (!editingBar) return;
    setEditingBar({
      ...editingBar,
      messages: [...editingBar.messages, { text: '', link: '', icon: '' }],
    });
  };

  const updateMessage = (index: number, field: keyof Message, value: string) => {
    if (!editingBar) return;
    const newMessages = [...editingBar.messages];
    newMessages[index] = { ...newMessages[index], [field]: value };
    setEditingBar({ ...editingBar, messages: newMessages });
  };

  const removeMessage = (index: number) => {
    if (!editingBar) return;
    setEditingBar({
      ...editingBar,
      messages: editingBar.messages.filter((_, i) => i !== index),
    });
  };

  const designTemplates = [
    {
      name: 'Default Burgundy',
      type: 'sliding' as const,
      backgroundColor: '#7e1219',
      textColor: '#ffffff',
      speed: 30,
    },
    {
      name: 'Dark Modern',
      type: 'sliding' as const,
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      speed: 25,
    },
    {
      name: 'Golden Luxury',
      type: 'rotating' as const,
      backgroundColor: '#b8860b',
      textColor: '#000000',
      speed: 35,
    },
    {
      name: 'Ocean Blue',
      type: 'ticker' as const,
      backgroundColor: '#1e3a8a',
      textColor: '#ffffff',
      speed: 20,
    },
  ];

  const applyTemplate = (template: typeof designTemplates[0]) => {
    if (!editingBar) return;
    setEditingBar({
      ...editingBar,
      design: {
        ...editingBar.design,
        type: template.type,
        backgroundColor: template.backgroundColor,
        textColor: template.textColor,
        animation: {
          ...editingBar.design.animation,
          speed: template.speed,
        },
      },
    });
  };

  if (isCreating || editingBar) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingBar(null);
                  setIsCreating(false);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingBar?._id ? 'Edit' : 'Create'} Promotional Bar
                </h1>
                <p className="text-sm text-gray-600">Design and configure your promotional message</p>
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

          {/* Preview */}
          {previewMode && editingBar && (
            <Card className="mb-6">
              <CardContent className="p-0">
                <div
                  className="py-3 overflow-hidden"
                  style={{
                    backgroundColor: editingBar.design.backgroundColor,
                    color: editingBar.design.textColor,
                  }}
                >
                  {editingBar.design.type === 'static' ? (
                    <div className="text-center">
                      <span style={{ fontSize: editingBar.design.fontSize }}>
                        {editingBar.messages[0]?.icon && `${editingBar.messages[0].icon} `}
                        {editingBar.messages[0]?.text}
                      </span>
                    </div>
                  ) : editingBar.design.type === 'rotating' ? (
                    <motion.div
                      key={Date.now()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                      className="text-center"
                    >
                      <span style={{ fontSize: editingBar.design.fontSize }}>
                        {editingBar.messages[0]?.icon && `${editingBar.messages[0].icon} `}
                        {editingBar.messages[0]?.text}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex whitespace-nowrap"
                      animate={{
                        x: editingBar.design.animation.direction === 'right' 
                          ? [0, 1000] 
                          : [0, -1000],
                      }}
                      transition={{
                        duration: editingBar.design.animation.speed || 30,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      {[...editingBar.messages, ...editingBar.messages].map((msg, idx) => (
                        <span
                          key={idx}
                          className="mx-8"
                          style={{ fontSize: editingBar.design.fontSize }}
                        >
                          {msg.icon && `${msg.icon} `}
                          {msg.text}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Add multiple promotional messages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingBar?.messages.map((message, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Message {index + 1}</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMessage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-2">
                          <Label>Icon (Emoji)</Label>
                          <Input
                            value={message.icon}
                            onChange={(e) => updateMessage(index, 'icon', e.target.value)}
                            placeholder="🎁"
                            maxLength={2}
                          />
                        </div>
                        <div className="col-span-7">
                          <Label>Text</Label>
                          <Input
                            value={message.text}
                            onChange={(e) => updateMessage(index, 'text', e.target.value)}
                            placeholder="Your promotional message"
                          />
                        </div>
                        <div className="col-span-3">
                          <Label>Link (Optional)</Label>
                          <Input
                            value={message.link}
                            onChange={(e) => updateMessage(index, 'link', e.target.value)}
                            placeholder="/shop"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={addMessage} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Message
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Design Templates
                  </CardTitle>
                  <CardDescription>Quick apply pre-designed styles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {designTemplates.map((template) => (
                      <button
                        key={template.name}
                        onClick={() => applyTemplate(template)}
                        className="border-2 rounded-lg p-4 hover:border-[#7e1219] transition-colors"
                      >
                        <div
                          className="h-12 rounded mb-2"
                          style={{ backgroundColor: template.backgroundColor }}
                        />
                        <p className="text-sm font-medium">{template.name}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Design</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Animation Type</Label>
                      <Select
                        value={editingBar?.design.type}
                        onValueChange={(value) =>
                          setEditingBar(editingBar ? {
                            ...editingBar,
                            design: { ...editingBar.design, type: value as any },
                          } : null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sliding">Sliding</SelectItem>
                          <SelectItem value="rotating">Rotating</SelectItem>
                          <SelectItem value="static">Static</SelectItem>
                          <SelectItem value="ticker">Ticker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Animation Speed (seconds)</Label>
                      <Input
                        type="number"
                        value={editingBar?.design.animation.speed}
                        onChange={(e) =>
                          setEditingBar(editingBar ? {
                            ...editingBar,
                            design: {
                              ...editingBar.design,
                              animation: {
                                ...editingBar.design.animation,
                                speed: parseInt(e.target.value) || 30,
                              },
                            },
                          } : null)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={editingBar?.design.backgroundColor}
                          onChange={(e) =>
                            setEditingBar(editingBar ? {
                              ...editingBar,
                              design: { ...editingBar.design, backgroundColor: e.target.value },
                            } : null)
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={editingBar?.design.backgroundColor}
                          onChange={(e) =>
                            setEditingBar(editingBar ? {
                              ...editingBar,
                              design: { ...editingBar.design, backgroundColor: e.target.value },
                            } : null)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={editingBar?.design.textColor}
                          onChange={(e) =>
                            setEditingBar(editingBar ? {
                              ...editingBar,
                              design: { ...editingBar.design, textColor: e.target.value },
                            } : null)
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={editingBar?.design.textColor}
                          onChange={(e) =>
                            setEditingBar(editingBar ? {
                              ...editingBar,
                              design: { ...editingBar.design, textColor: e.target.value },
                            } : null)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Font Size</Label>
                      <Input
                        value={editingBar?.design.fontSize}
                        onChange={(e) =>
                          setEditingBar(editingBar ? {
                            ...editingBar,
                            design: { ...editingBar.design, fontSize: e.target.value },
                          } : null)
                        }
                        placeholder="14px"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Publication Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Save as Draft</Label>
                      <p className="text-sm text-gray-600">Keep unpublished for review</p>
                    </div>
                    <Switch
                      checked={editingBar?.isDraft}
                      onCheckedChange={(checked) =>
                        setEditingBar(editingBar ? { ...editingBar, isDraft: checked } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Activate Immediately</Label>
                      <p className="text-sm text-gray-600">Show on website after saving</p>
                    </div>
                    <Switch
                      checked={editingBar?.isActive}
                      onCheckedChange={(checked) =>
                        setEditingBar(editingBar ? { ...editingBar, isActive: checked } : null)
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/cms">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to CMS
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Promotional Bar Management</h1>
            <p className="text-gray-600">Create and manage promotional messages for your website</p>
          </div>
          <Button
            onClick={() => {
              setEditingBar(defaultBar);
              setIsCreating(true);
            }}
            className="bg-[#7e1219] hover:bg-[#6a0f15]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">Loading...</p>
              </CardContent>
            </Card>
          ) : bars.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600 mb-4">No promotional bars created yet</p>
                <Button
                  onClick={() => {
                    setEditingBar(defaultBar);
                    setIsCreating(true);
                  }}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Promotional Bar
                </Button>
              </CardContent>
            </Card>
          ) : (
            bars.map((bar) => (
              <motion.div
                key={bar._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {bar.messages[0]?.text || 'Untitled'}
                          </h3>
                          {bar.isActive && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Active
                            </span>
                          )}
                          {bar.isDraft && (
                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {bar.messages.length} messages • {bar.design.type} animation
                        </p>
                        {/* Preview */}
                        <div
                          className="py-2 px-4 rounded overflow-hidden"
                          style={{
                            backgroundColor: bar.design.backgroundColor,
                            color: bar.design.textColor,
                          }}
                        >
                          <p className="text-sm truncate">
                            {bar.messages[0]?.icon && `${bar.messages[0].icon} `}
                            {bar.messages[0]?.text}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingBar(bar)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!bar.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => bar._id && handlePublish(bar._id)}
                          >
                            Publish
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => bar._id && handleDelete(bar._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
