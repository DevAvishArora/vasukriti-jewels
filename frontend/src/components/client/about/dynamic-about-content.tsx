'use client';

import Image from 'next/image';
import { Sparkles, Heart, Award, Users, ArrowRight, TrendingUp, Shield } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, SlideIn } from '@/components/transitions';

interface DesignOptions {
  style?: 'default' | 'gradient' | 'bordered' | 'minimal' | 'bold';
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'purple' | 'gold' | 'rose' | 'emerald';
}

interface LayoutOptions {
  imagePosition?: 'left' | 'right' | 'top' | 'bottom';
}

interface ContentBlock {
  type: 'text' | 'heading' | 'paragraph' | 'image' | 'list' | 'stats' | 'quote' | 'image-text';
  content: any;
  order: number;
  design?: DesignOptions;
  layout?: LayoutOptions;
}

interface PageContent {
  page: string;
  title: string;
  subtitle?: string;
  sections: ContentBlock[];
  isActive: boolean;
}

interface DynamicAboutContentProps {
  content: PageContent | null;
}

export default function DynamicAboutContent({ content }: DynamicAboutContentProps) {
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">About Us</h1>
          <p className="text-gray-600">Content is currently being updated.</p>
        </div>
      </div>
    );
  }

  // Helper functions for design customization
  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'center': return 'text-center mx-auto';
      case 'right': return 'text-right ml-auto';
      default: return 'text-left';
    }
  };

  const getSizeClass = (size?: string, type?: string) => {
    if (type === 'heading') {
      switch (size) {
        case 'small': return 'text-2xl md:text-3xl';
        case 'large': return 'text-4xl md:text-5xl';
        default: return 'text-3xl md:text-4xl';
      }
    }
    if (type === 'paragraph') {
      switch (size) {
        case 'small': return 'text-sm';
        case 'large': return 'text-lg md:text-xl';
        default: return 'text-base';
      }
    }
    return '';
  };

  const getStyleClass = (style?: string, color?: string) => {
    const colorMap = {
      blue: 'from-blue-500/10 to-blue-600/10 border-blue-500',
      purple: 'from-purple-500/10 to-purple-600/10 border-purple-500',
      gold: 'from-amber-500/10 to-yellow-500/10 border-amber-500',
      rose: 'from-rose-500/10 to-pink-500/10 border-rose-500',
      emerald: 'from-emerald-500/10 to-teal-500/10 border-emerald-500',
    };

    const selectedColor = colorMap[color as keyof typeof colorMap] || colorMap.gold;

    switch (style) {
      case 'gradient':
        return `bg-gradient-to-r ${selectedColor.split(' ')[0]} ${selectedColor.split(' ')[1]} p-6 rounded-lg`;
      case 'bordered':
        return `border-l-4 ${selectedColor.split(' ')[2]} pl-6 py-2`;
      case 'minimal':
        return 'opacity-80';
      case 'bold':
        return 'font-semibold';
      default:
        return '';
    }
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'purple': return 'text-purple-600';
      case 'gold': return 'text-amber-600';
      case 'rose': return 'text-rose-600';
      case 'emerald': return 'text-emerald-600';
      default: return 'text-[#7e1219]';
    }
  };

  const renderSection = (section: ContentBlock) => {
    const design = section.design || {};
    const layout = section.layout || {};

    switch (section.type) {
      case 'heading':
        return (
          <div key={section.order} className={`mb-6 ${getAlignmentClass(design.alignment)} ${getStyleClass(design.style, design.color)}`}>
            <h2 className={`${getSizeClass(design.size, 'heading')} font-light tracking-wide ${design.style === 'bold' ? 'font-semibold' : ''} ${getColorClass(design.color)} mb-0`}>
              {section.content}
            </h2>
          </div>
        );

      case 'paragraph':
        return (
          <div key={section.order} className={`mb-4 ${getAlignmentClass(design.alignment)} ${getStyleClass(design.style, design.color)}`}>
            <p className={`${getSizeClass(design.size, 'paragraph')} text-gray-600 leading-relaxed font-light`}>
              {section.content}
            </p>
          </div>
        );

      case 'image-text':
        const isImageLeft = layout.imagePosition === 'left' || !layout.imagePosition;
        const isImageRight = layout.imagePosition === 'right';
        const isImageTop = layout.imagePosition === 'top';
        const isImageBottom = layout.imagePosition === 'bottom';

        return (
          <div key={section.order} className={`my-12 ${getStyleClass(design.style, design.color)}`}>
            <div className={`grid gap-8 ${isImageTop || isImageBottom ? 'grid-cols-1' : 'md:grid-cols-2'} items-center`}>
              {(isImageTop || isImageLeft) && section.content.image && (
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={section.content.image}
                    alt={section.content.imageAlt || 'Content image'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className={getAlignmentClass(design.alignment)}>
                {section.content.title && (
                  <h3 className={`${getSizeClass(design.size, 'heading')} font-light tracking-wide ${getColorClass(design.color)} mb-4`}>
                    {section.content.title}
                  </h3>
                )}
                <div className="text-gray-600 leading-relaxed font-light space-y-3">
                  {section.content.text}
                </div>
              </div>
              {(isImageBottom || isImageRight) && section.content.image && (
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={section.content.image}
                    alt={section.content.imageAlt || 'Content image'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'quote':
        return (
          <blockquote key={section.order} className={`my-8 ${getStyleClass(design.style, design.color)} ${design.style !== 'bordered' ? 'border-l-4 border-[#7e1219] pl-6' : ''} italic`}>
            <p className={`${getSizeClass(design.size, 'paragraph') || 'text-xl'} text-gray-700 mb-2 ${getAlignmentClass(design.alignment)}`}>
              &ldquo;{section.content.text}&rdquo;
            </p>
            {section.content.author && (
              <footer className={`text-gray-500 text-sm ${getAlignmentClass(design.alignment)}`}>— {section.content.author}</footer>
            )}
          </blockquote>
        );

      case 'list':
        if (Array.isArray(section.content.items)) {
          // Check if items are objects (with title/description) or strings
          const firstItem = section.content.items[0];
          if (typeof firstItem === 'object' && firstItem.title) {
            // Structured list with icons
            return (
              <StaggerContainer key={section.order} className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-12 ${getAlignmentClass(design.alignment)}`}>
                {section.content.items.map((item: any, index: number) => (
                  <StaggerItem key={index}>
                    <div className={`bg-white p-6 ${design.style === 'bordered' ? 'border-2' : 'border'} border-gray-200 hover:border-gray-900 transition-colors ${getStyleClass(design.style, design.color)}`}>
                      <div className={`w-12 h-12 ${design.style === 'gradient' ? 'bg-gradient-to-r' : 'bg-[#7e1219]'} ${design.style === 'gradient' ? getColorClass(design.color).replace('text-', 'from-') : ''} flex items-center justify-center mb-4`}>
                        {item.icon === 'shield' && <Shield className="h-6 w-6 text-white" strokeWidth={1.5} />}
                        {item.icon === 'award' && <Award className="h-6 w-6 text-white" strokeWidth={1.5} />}
                        {item.icon === 'users' && <Users className="h-6 w-6 text-white" strokeWidth={1.5} />}
                        {item.icon === 'heart' && <Heart className="h-6 w-6 text-white" strokeWidth={1.5} />}
                        {item.icon === 'sparkles' && <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />}
                        {!item.icon && <Award className="h-6 w-6 text-white" strokeWidth={1.5} />}
                      </div>
                      <h3 className={`text-lg font-light uppercase tracking-wider ${getColorClass(design.color) || 'text-gray-900'} mb-2 ${getSizeClass(design.size)}`}>
                        {item.title}
                      </h3>
                      <p className="text-gray-600 font-light text-sm">
                        {item.description}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            );
          } else {
            // Simple bullet list
            return (
              <ul key={section.order} className={`space-y-3 mb-8 ${getStyleClass(design.style, design.color)}`}>
                {section.content.items.map((item: string, index: number) => (
                  <li key={index} className={`flex items-start gap-3 text-gray-600 ${getAlignmentClass(design.alignment)}`}>
                    <ArrowRight className={`h-5 w-5 ${getColorClass(design.color)} mt-0.5 flex-shrink-0`} />
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
        }
        return null;

      case 'stats':
        if (section.content.items && Array.isArray(section.content.items)) {
          return (
            <StaggerContainer key={section.order} className={`grid grid-cols-2 md:grid-cols-4 gap-8 my-12 ${getStyleClass(design.style, design.color)}`}>
              {section.content.items.map((stat: any, index: number) => (
                <StaggerItem key={index}>
                  <div className={`text-center ${design.style === 'bordered' ? 'border border-gray-200 p-4 rounded-lg' : ''}`}>
                    <div className={`text-4xl md:text-5xl font-light ${getColorClass(design.color)} mb-2 ${getSizeClass(design.size)}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-light uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] bg-gray-50">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center relative z-10">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-light tracking-wide text-gray-900 mb-6">
              {content.title}
            </h1>
          </FadeIn>
          {content.subtitle && (
            <FadeIn delay={0.3}>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 font-light">
                {content.subtitle}
              </p>
            </FadeIn>
          )}
          <FadeIn delay={0.5}>
            <div className="flex items-center gap-2 text-[#7e1219]">
              <Sparkles className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-light">Established 2003</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              {content.sections && Array.isArray(content.sections) && content.sections.length > 0 ? (
                content.sections
                  .filter((section: any) => section.isVisible !== false)
                  .sort((a, b) => a.order - b.order)
                  .map((section) => renderSection(section))
              ) : (
                <p className="text-gray-600 text-center">No content available</p>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
