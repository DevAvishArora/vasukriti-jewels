'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Eye,
  Settings,
  Save,
  Palette,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CMSPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const cmsModules = [
    {
      id: 'promotional-bar',
      title: 'Promotional Bar',
      description: 'Manage promotional messages and announcements',
      icon: Megaphone,
      href: '/admin/cms/promotional-bar',
      color: 'bg-blue-500',
      stats: { active: 1, draft: 2 },
    },
    {
      id: 'hero-section',
      title: 'Hero Section',
      description: 'Edit homepage hero banners and images',
      icon: ImageIcon,
      href: '/admin/cms/hero',
      color: 'bg-purple-500',
      stats: { active: 3, draft: 1 },
    },
    {
      id: 'static-content',
      title: 'Static Content',
      description: 'Update About, Brand Story, and other pages',
      icon: FileText,
      href: '/admin/cms/static-content',
      color: 'bg-green-500',
      stats: { sections: 10, updated: 3 },
    },
    {
      id: 'faq',
      title: 'FAQ Management',
      description: 'Create and organize frequently asked questions',
      icon: HelpCircle,
      href: '/admin/cms/faq',
      color: 'bg-orange-500',
      stats: { active: 24, draft: 5 },
    },
  ];

  const designTemplates = [
    {
      name: 'Modern Minimal',
      description: 'Clean and simple design with focus on content',
      preview: '/templates/modern-minimal.jpg',
    },
    {
      name: 'Luxury Classic',
      description: 'Elegant design with rich visuals',
      preview: '/templates/luxury-classic.jpg',
    },
    {
      name: 'Bold Contemporary',
      description: 'Eye-catching design with strong visuals',
      preview: '/templates/bold-contemporary.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Content Management System
              </h1>
              <p className="text-gray-600">
                Manage your website content, design, and appearance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open('/?preview=true', '_blank')}
              >
                <Eye className="h-4 w-4" />
                Preview Changes
              </Button>
              <Button className="flex items-center gap-2 bg-[#7e1219] hover:bg-[#6a0f15]">
                <Save className="h-4 w-4" />
                Publish All
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="content" className="data-[state=active]:bg-[#7e1219] data-[state=active]:text-white">
              Content Management
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-[#7e1219] data-[state=active]:text-white">
              Design Templates
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#7e1219] data-[state=active]:text-white">
              Global Settings
            </TabsTrigger>
          </TabsList>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cmsModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={module.href}>
                      <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-[#7e1219] cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`${module.color} p-3 rounded-lg`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                {module.stats.active || module.stats.sections} Active
                              </span>
                              {module.stats.draft && (
                                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                  {module.stats.draft} Draft
                                </span>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="outline"
                            className="w-full hover:bg-[#7e1219] hover:text-white"
                          >
                            Manage {module.title}
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
                <CardDescription>Quick statistics about your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-600 mt-1">Total Sections</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">8</p>
                    <p className="text-sm text-gray-600 mt-1">Published</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-3xl font-bold text-amber-600">4</p>
                    <p className="text-sm text-gray-600 mt-1">Drafts</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">2 days</p>
                    <p className="text-sm text-gray-600 mt-1">Last Updated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Templates Tab */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Available Design Templates
                </CardTitle>
                <CardDescription>
                  Choose from pre-designed templates or create your own custom design
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {designTemplates.map((template, index) => (
                    <motion.div
                      key={template.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-2 rounded-lg overflow-hidden hover:border-[#7e1219] transition-colors cursor-pointer group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-[#7e1219] group-hover:text-white"
                        >
                          Apply Template
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Global Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Global Website Settings
                </CardTitle>
                <CardDescription>
                  Configure site-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Site Name</h4>
                      <p className="text-sm text-gray-600">Vasukriti</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Brand Color</h4>
                      <p className="text-sm text-gray-600">#7e1219</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Logo</h4>
                      <p className="text-sm text-gray-600">Upload custom logo</p>
                    </div>
                    <Button variant="outline" size="sm">Upload</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Typography</h4>
                      <p className="text-sm text-gray-600">Font families and sizes</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
