export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string | Category;
  subCategory?: string;
  price: number;
  comparePrice?: number;
  discount: number;
  finalPrice: number;
  sku: string;
  stock: number;
  images: ProductImage[];
  model3D?: {
    url: string;
    format: string;
    size: number;
  };
  specifications?: Specification[];
  materials?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  rating: {
    average: number;
    count: number;
  };
  reviews?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  publicId: string;
  alt: string;
  isPrimary: boolean;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
  };
  parentCategory?: string;
  subCategories?: string[];
  displayOrder: number;
  isActive: boolean;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'price' | 'createdAt' | 'rating' | 'name';
  order: 'asc' | 'desc';
}
