const Product = require('../models/Product');
const Category = require('../models/Category');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      material,
      sort = '-createdAt',
      search,
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Material filter
    if (material) {
      query.material = material;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const count = await Product.countDocuments(query);

    // Cache for 5 minutes
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    
    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / limit),
          totalProducts: count,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:slugOrId
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    // Get param from either slug or id route parameter
    const param = req.params.slug || req.params.id;

    let product;

    // If param is a valid MongoDB ObjectId, fetch by id, otherwise treat as slug
    if (mongoose.Types.ObjectId.isValid(param)) {
      product = await Product.findById(param)
        .populate('category', 'name slug')
        .lean();
    } else {
      product = await Product.findOne({ slug: param })
        .populate('category', 'name slug')
        .lean();
    }

    // Note: Review population will be added when Review routes are implemented

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Add cache header
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    
    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      material,
      purity,
      weight,
      dimensions,
      stock,
      stockQuantity,
      sku,
      images,
      model3D,
      variants,
      tags,
    } = req.body;

    // Normalize stock field (accept both 'stock' and 'stockQuantity')
    const stockValue = stock !== undefined ? stock : stockQuantity;

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      material,
      purity,
      weight,
      dimensions,
      stock: stockValue,
      sku,
      images,
      model3D,
      variants,
      tags,
    });

    logger.info(`Product created: ${product.name} by admin ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Normalize stock field (accept both 'stock' and 'stockQuantity')
    const updateData = { ...req.body };
    if (updateData.stockQuantity !== undefined && updateData.stock === undefined) {
      updateData.stock = updateData.stockQuantity;
      delete updateData.stockQuantity;
    }

    // Update fields
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('category', 'name slug');

    logger.info(`Product updated: ${updatedProduct.name} by admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Soft delete by setting isActive to false and modifying SKU to avoid conflicts
    product.isActive = false;
    // Append timestamp to SKU to free it up for reuse
    if (!product.sku.includes('_DELETED_')) {
      product.sku = `${product.sku}_DELETED_${Date.now()}`;
    }
    await product.save();

    logger.info(`Product deleted: ${product.name} by admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .select('name slug price images category sku material isFeatured')
      .populate('category', 'name slug')
      .limit(8)
      .sort('-createdAt')
      .lean();

    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    
    res.status(200).json({
      success: true,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name slug price images category sku material createdAt')
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(12)
      .lean();

    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    
    res.status(200).json({
      success: true,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name slug price images category sku material soldCount')
      .populate('category', 'name slug')
      .sort('-soldCount')
      .limit(12)
      .lean();

    res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    
    res.status(200).json({
      success: true,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
const updateStock = async (req, res, next) => {
  try {
    const { stockQuantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.stockQuantity = stockQuantity;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products with autocomplete
// @route   GET /api/products/search/autocomplete
// @access  Public
async function searchProducts(req, res, next) {
  try {
    const { q, limit = 10, autocomplete = false } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: {
          products: [],
          suggestions: [],
        },
      });
    }

    const searchTerm = q.trim();
    const searchRegex = new RegExp(searchTerm, 'i');

    // Build search query
    const query = {
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ],
    };

    // For autocomplete, return minimal data
    if (autocomplete === 'true') {
      const products = await Product.find(query)
        .select('name slug image price category')
        .populate('category', 'name')
        .limit(Number.parseInt(limit))
        .sort({ popularity: -1, createdAt: -1 })
        .lean();

      // Extract unique product name suggestions
      const suggestions = products
        .map(p => p.name)
        .filter((name, index, self) => self.indexOf(name) === index)
        .slice(0, 5);

      return res.status(200).json({
        success: true,
        data: {
          products,
          suggestions,
          count: products.length,
        },
      });
    }

    // For full search results
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .limit(Number.parseInt(limit))
      .sort({ popularity: -1, createdAt: -1 })
      .lean();

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        count,
        searchTerm,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Bulk upload products from CSV data
// @route   POST /api/products/bulk-upload
// @access  Private/Admin
const bulkUploadProducts = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of products',
      });
    }

    const results = {
      success: [],
      errors: [],
      total: products.length,
    };

    // Get all categories for validation
    const categories = await Category.find({ isActive: true });
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.name.toLowerCase(), cat._id.toString());
      categoryMap.set(cat.slug, cat._id.toString());
    });

    // Process each product
    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      const rowNumber = i + 2; // +2 for header row and 0-index

      try {
        // Validate required fields
        const errors = [];
        if (!productData.name || productData.name.trim() === '') {
          errors.push('Name is required');
        }
        if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
          errors.push('Valid price is required');
        }
        if (!productData.sku || productData.sku.trim() === '') {
          errors.push('SKU is required');
        }
        if (!productData.category || productData.category.trim() === '') {
          errors.push('Category is required');
        }

        if (errors.length > 0) {
          results.errors.push({
            row: rowNumber,
            name: productData.name || 'N/A',
            errors: errors,
          });
          continue;
        }

        // Find category
        const categoryKey = productData.category.toLowerCase().trim();
        const categoryId = categoryMap.get(categoryKey);
        
        if (!categoryId) {
          results.errors.push({
            row: rowNumber,
            name: productData.name,
            errors: [`Category "${productData.category}" not found`],
          });
          continue;
        }

        // Check for duplicate SKU (only among active products)
        const existingProduct = await Product.findOne({ 
          sku: productData.sku.trim().toUpperCase(),
          isActive: true
        });
        
        if (existingProduct) {
          results.errors.push({
            row: rowNumber,
            name: productData.name,
            errors: [`SKU "${productData.sku}" already exists in active products`],
          });
          continue;
        }

        // Prepare product data
        const newProduct = {
          name: productData.name.trim(),
          description: productData.description || productData.name,
          shortDescription: productData.shortDescription || '',
          price: parseFloat(productData.price),
          comparePrice: productData.comparePrice ? parseFloat(productData.comparePrice) : 0,
          discount: productData.discount ? parseFloat(productData.discount) : 0,
          sku: productData.sku.trim().toUpperCase(),
          stock: productData.stock ? parseInt(productData.stock) : 0,
          lowStockThreshold: productData.lowStockThreshold ? parseInt(productData.lowStockThreshold) : 10,
          category: categoryId,
          subCategory: productData.subCategory || '',
          weight: productData.weight ? parseFloat(productData.weight) : undefined,
          materials: productData.materials ? productData.materials.split('|').map(m => m.trim()) : [],
          tags: productData.tags ? productData.tags.split('|').map(t => t.trim()) : [],
          isFeatured: productData.isFeatured === 'true' || productData.isFeatured === '1',
          isTrending: productData.isTrending === 'true' || productData.isTrending === '1',
          isNewArrival: productData.isNewArrival === 'true' || productData.isNewArrival === '1',
          isActive: productData.isActive !== 'false' && productData.isActive !== '0',
          metaTitle: productData.metaTitle || productData.name,
          metaDescription: productData.metaDescription || productData.description,
          metaKeywords: productData.metaKeywords ? productData.metaKeywords.split('|').map(k => k.trim()) : [],
        };

        // Add images if provided (URLs)
        if (productData.imageUrl) {
          const imageUrls = productData.imageUrl.split('|').map(url => url.trim());
          newProduct.images = imageUrls.map((url, index) => ({
            url: url,
            alt: productData.name,
            isPrimary: index === 0,
          }));
        }

        // Add specifications if provided
        if (productData.specifications) {
          const specs = productData.specifications.split('|').map(spec => {
            const [label, value] = spec.split(':').map(s => s.trim());
            return label && value ? { label, value } : null;
          }).filter(Boolean);
          newProduct.specifications = specs;
        }

        // Create product
        const product = await Product.create(newProduct);
        
        results.success.push({
          row: rowNumber,
          name: product.name,
          sku: product.sku,
          id: product._id,
        });

      } catch (error) {
        results.errors.push({
          row: rowNumber,
          name: productData.name || 'N/A',
          errors: [error.message || 'Unknown error occurred'],
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed ${results.total} products. Success: ${results.success.length}, Errors: ${results.errors.length}`,
      data: results,
    });

  } catch (error) {
    logger.error('Error in bulk upload:', error);
    next(error);
  }
};

// @desc    Cleanup deleted products SKUs
// @route   POST /api/products/cleanup-deleted
// @access  Private/Admin
const cleanupDeletedProducts = async (req, res, next) => {
  try {
    // Find all deleted products with original SKUs
    const deletedProducts = await Product.find({ 
      isActive: false,
      sku: { $not: /(_DELETED_|_deleted_)/ }
    });

    let updated = 0;
    for (const product of deletedProducts) {
      product.sku = `${product.sku}_DELETED_${Date.now()}_${product._id}`;
      await product.save();
      updated++;
    }

    res.status(200).json({
      success: true,
      message: `Cleaned up ${updated} deleted products`,
      data: { updated }
    });
  } catch (error) {
    logger.error('Error cleaning up deleted products:', error);
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  updateStock,
  searchProducts,
  bulkUploadProducts,
  cleanupDeletedProducts,
};
