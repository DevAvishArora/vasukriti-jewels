'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import axiosInstance from '@/lib/axios-instance';
import type { Category } from '@/types';

interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  materials: string[];
}

interface ProductFiltersProps {
  readonly filters: FilterState;
  readonly onFilterChange: (filters: FilterState) => void;
  readonly onClearFilters: () => void;
}

const MATERIALS = ['Gold', 'Silver', 'Diamond', 'Platinum', 'Rose Gold', 'White Gold'];

export function ProductFilters({ filters, onFilterChange, onClearFilters }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    material: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        const data = response.data.data;
        // Handle different API response structures
        const categoryList = Array.isArray(data) 
          ? data 
          : (data?.categories || []);
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Ensure it's always an array
      }
    };

    fetchCategories();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);

    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    const newMaterials = checked
      ? [...filters.materials, material]
      : filters.materials.filter((m) => m !== material);

    onFilterChange({ ...filters, materials: newMaterials });
  };

  const handlePriceChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 100000;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="text-base font-light text-gray-900 uppercase tracking-wider">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-gray-500 hover:text-gray-900 font-light uppercase tracking-wider"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="pb-8 border-b border-gray-100">
        <button
          onClick={() => toggleSection('category')}
          className="flex w-full items-center justify-between text-left mb-4"
        >
          <h3 className="text-xs font-light text-gray-900 uppercase tracking-wider">Category</h3>
          {expandedSections.category ? (
            <ChevronUp className="h-3 w-3 text-gray-400" />
          ) : (
            <ChevronDown className="h-3 w-3 text-gray-400" />
          )}
        </button>

        {expandedSections.category && (
          <div className="space-y-3">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div key={category._id} className="flex items-center gap-3">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={filters.categories.includes(category._id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category._id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category._id}`}
                    className="text-sm text-gray-600 cursor-pointer font-light"
                  >
                    {category.name}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 font-light">Loading categories...</p>
            )}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="pb-8 border-b border-gray-100">
        <button
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between text-left mb-4"
        >
          <h3 className="text-xs font-light text-gray-900 uppercase tracking-wider">Price Range</h3>
          {expandedSections.price ? (
            <ChevronUp className="h-3 w-3 text-gray-400" />
          ) : (
            <ChevronDown className="h-3 w-3 text-gray-400" />
          )}
        </button>

        {expandedSections.price && (
          <div className="space-y-4">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={handlePriceChange}
              min={0}
              max={100000}
              step={1000}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-gray-500 font-light">
              <span>₹{filters.minPrice.toLocaleString('en-IN')}</span>
              <span>₹{filters.maxPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Material Filter */}
      <div className="pb-8">
        <button
          onClick={() => toggleSection('material')}
          className="flex w-full items-center justify-between text-left mb-4"
        >
          <h3 className="text-xs font-light text-gray-900 uppercase tracking-wider">Material</h3>
          {expandedSections.material ? (
            <ChevronUp className="h-3 w-3 text-gray-400" />
          ) : (
            <ChevronDown className="h-3 w-3 text-gray-400" />
          )}
        </button>

        {expandedSections.material && (
          <div className="space-y-3">
            {MATERIALS.map((material) => (
              <div key={material} className="flex items-center gap-3">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.materials.includes(material)}
                  onCheckedChange={(checked) =>
                    handleMaterialChange(material, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`material-${material}`}
                  className="text-sm text-gray-600 cursor-pointer font-light"
                >
                  {material}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
