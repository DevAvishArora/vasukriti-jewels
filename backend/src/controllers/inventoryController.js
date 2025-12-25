const Product = require('../models/Product');

/**
 * @desc    Get inventory overview with low stock alerts
 * @route   GET /api/inventory
 * @access  Private/Admin
 */
exports.getInventoryOverview = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      stockStatus,
      search,
      sortBy = 'stockQuantity',
      order = 'asc',
    } = req.query;

    const query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Stock status filter
    if (stockStatus === 'low') {
      query.stock = { $lte: 10 };
    } else if (stockStatus === 'out') {
      query.stock = 0;
    } else if (stockStatus === 'in') {
      query.stock = { $gt: 10 };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [products, total, stats] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort({ [sortBy]: sortOrder })
        .limit(Number.parseInt(limit))
        .skip(skip)
        .lean(),
      Product.countDocuments(query),
      Product.aggregate([
        {
          $facet: {
            totalProducts: [{ $count: 'count' }],
            lowStock: [
              { $match: { stock: { $lte: 10, $gt: 0 } } },
              { $count: 'count' },
            ],
            outOfStock: [
              { $match: { stock: 0 } },
              { $count: 'count' },
            ],
            totalValue: [
              {
                $group: {
                  _id: null,
                  value: { $sum: { $multiply: ['$price', '$stock'] } },
                },
              },
            ],
          },
        },
      ]),
    ]);

    const inventoryStats = {
      totalProducts: stats[0].totalProducts[0]?.count || 0,
      lowStock: stats[0].lowStock[0]?.count || 0,
      outOfStock: stats[0].outOfStock[0]?.count || 0,
      totalValue: stats[0].totalValue[0]?.value || 0,
    };

    res.status(200).json({
      success: true,
      data: {
        products,
        stats: inventoryStats,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / Number.parseInt(limit)),
          total,
          limit: Number.parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product stock
 * @route   PUT /api/inventory/:id/stock
 * @access  Private/Admin
 */
exports.updateStock = async (req, res, next) => {
  try {
    const { stock: newStock, reason } = req.body;

    if (newStock === undefined || newStock < 0) {
      res.status(400);
      throw new Error('Valid stock quantity is required');
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const oldStock = product.stock;
    product.stock = newStock;

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
      message: `Stock updated from ${oldStock} to ${newStock}. Reason: ${reason || 'Manual adjustment'}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk stock update
 * @route   PUT /api/inventory/bulk-update
 * @access  Private/Admin
 */
exports.bulkStockUpdate = async (req, res, next) => {
  try {
    const { updates } = req.body; // Array of { productId, stock, reason }

    if (!Array.isArray(updates) || updates.length === 0) {
      res.status(400);
      throw new Error('Updates array is required');
    }

    const results = [];

    for (const update of updates) {
      const { productId, stock: newStock, reason } = update;

      if (!productId || newStock === undefined) {
        continue;
      }

      const product = await Product.findById(productId);
      if (!product) {
        results.push({ productId, success: false, error: 'Product not found' });
        continue;
      }

      product.stock = newStock;
      await product.save();
      results.push({ productId, success: true });
    }

    res.status(200).json({
      success: true,
      data: {
        updated: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get stock history for a product
 * @route   GET /api/inventory/:id/history
 * @access  Private/Admin
 */
exports.getStockHistory = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name sku stock')
      .lean();

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      data: {
        product: {
          id: product._id,
          name: product.name,
          sku: product.sku,
          currentStock: product.stock,
        },
        history: [],
      },
      message: 'Stock history feature will be available soon',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get low stock alerts
 * @route   GET /api/inventory/alerts
 * @access  Private/Admin
 */
exports.getLowStockAlerts = async (req, res, next) => {
  try {
    const { threshold = 10 } = req.query;

    const lowStockProducts = await Product.find({
      stock: { $lte: Number.parseInt(threshold) },
    })
      .populate('category', 'name')
      .sort({ stock: 1 })
      .select('name sku stock price images category')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        count: lowStockProducts.length,
        products: lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export inventory report
 * @route   GET /api/inventory/export
 * @access  Private/Admin
 */
exports.exportInventory = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .select('name sku stock price category')
      .lean();

    const inventoryData = products.map((product) => {
      let status = 'In Stock';
      if (product.stock === 0) {
        status = 'Out of Stock';
      } else if (product.stock <= 10) {
        status = 'Low Stock';
      }

      return {
        Name: product.name,
        SKU: product.sku,
        Category: product.category?.name || 'N/A',
        'Stock Quantity': product.stock,
        'Unit Price': product.price,
        'Total Value': product.price * product.stock,
        Status: status,
      };
    });

    res.status(200).json({
      success: true,
      data: inventoryData,
    });
  } catch (error) {
    next(error);
  }
};
