const Category = require('../models/Category');
const Product = require('../models/Product');
const logger = require('../utils/logger');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name slug')
      .sort('name')
      .lean();

    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category tree (hierarchical structure)
// @route   GET /api/categories/tree
// @access  Public
const getCategoryTree = async (req, res, next) => {
  try {
    // Get all active categories
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name slug')
      .lean();

    // Build tree structure
    const categoryMap = {};
    const tree = [];

    // First pass: create map of all categories
    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat, children: [] };
    });

    // Second pass: build tree
    categories.forEach((cat) => {
      if (cat.parentCategory) {
        // Add to parent's children
        const parent = categoryMap[cat.parentCategory._id || cat.parentCategory];
        if (parent) {
          parent.children.push(categoryMap[cat._id]);
        }
      } else {
        // Top-level category
        tree.push(categoryMap[cat._id]);
      }
    });

    res.status(200).json({
      success: true,
      data: { categories: tree },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parentCategory', 'name slug');

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Get subcategories
    const subcategories = await Category.find({ 
      parentCategory: category._id, 
      isActive: true 
    });

    // Get product count
    const productCount = await Product.countDocuments({ 
      category: category._id, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      data: { 
        category: {
          ...category.toObject(),
          subcategories,
          productCount,
        }
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, parentCategory, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(400);
      throw new Error('Category with this name already exists');
    }

    const category = await Category.create({
      name,
      description,
      parentCategory: parentCategory || null,
      image,
    });

    logger.info(`Category created: ${category.name} by admin ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Prevent circular reference (category can't be its own parent)
    if (req.body.parentCategory && req.body.parentCategory === req.params.id) {
      res.status(400);
      throw new Error('Category cannot be its own parent');
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('parentCategory', 'name slug');

    logger.info(`Category updated: ${updatedCategory.name} by admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category: updatedCategory },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ 
      category: category._id 
    });

    if (productCount > 0) {
      res.status(400);
      throw new Error('Cannot delete category with existing products');
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ 
      parentCategory: category._id 
    });

    if (subcategoryCount > 0) {
      res.status(400);
      throw new Error('Cannot delete category with subcategories');
    }

    // Soft delete
    category.isActive = false;
    await category.save();

    logger.info(`Category deleted: ${category.name} by admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryTree,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
