const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Get dashboard overview statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number.parseInt(period, 10));

    // Revenue statistics
    const revenueStats = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
        },
      },
    ]);

    // Previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - Number.parseInt(period, 10));

    const prevRevenueStats = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: prevStartDate, $lt: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startDate } },
      },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: {
            $sum: { $multiply: ['$items.quantity', '$items.price'] },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          name: '$product.name',
          image: { $arrayElemAt: ['$product.images', 0] },
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // Customer statistics
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const newCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startDate },
    });

    // Low stock products
    const lowStockProducts = await Product.find({
      stockQuantity: { $lt: 10, $gt: 0 },
      isActive: true,
    })
      .select('name stockQuantity images')
      .limit(5);

    // Calculate growth percentages
    const currentRevenue = revenueStats[0]?.totalRevenue || 0;
    const prevRevenue = prevRevenueStats[0]?.totalRevenue || 0;
    const revenueGrowth =
      prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    const currentOrders = revenueStats[0]?.totalOrders || 0;
    const prevOrders = prevRevenueStats[0]?.totalOrders || 0;
    const ordersGrowth =
      prevOrders > 0 ? ((currentOrders - prevOrders) / prevOrders) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          total: currentRevenue,
          growth: revenueGrowth,
          orders: currentOrders,
          avgOrderValue: revenueStats[0]?.avgOrderValue || 0,
        },
        orders: {
          total: currentOrders,
          growth: ordersGrowth,
          byStatus: ordersByStatus,
        },
        customers: {
          total: totalCustomers,
          new: newCustomers,
        },
        topProducts,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue chart data
// @route   GET /api/analytics/revenue
// @access  Private/Admin
const getRevenueChart = async (req, res, next) => {
  try {
    const { period = '30', groupBy = 'day' } = req.query; // day, week, month
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number.parseInt(period, 10));

    let groupFormat;
    let dateFormat;

    switch (groupBy) {
      case 'week':
        groupFormat = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' },
        };
        break;
      case 'month':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        };
        break;
      default: // day
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        };
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: { revenueData },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales by category
// @route   GET /api/analytics/sales-by-category
// @access  Private/Admin
const getSalesByCategory = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number.parseInt(period, 10));

    const salesByCategory = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          name: { $first: '$category.name' },
          totalRevenue: {
            $sum: { $multiply: ['$items.quantity', '$items.price'] },
          },
          totalQuantity: { $sum: '$items.quantity' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: { salesByCategory },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer insights
// @route   GET /api/analytics/customer-insights
// @access  Private/Admin
const getCustomerInsights = async (req, res, next) => {
  try {
    // Customer lifetime value distribution
    const customerValueDistribution = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $bucket: {
          groupBy: '$totalSpent',
          boundaries: [0, 10000, 25000, 50000, 100000, 200000, 500000],
          default: '500000+',
          output: {
            count: { $sum: 1 },
            customers: { $push: '$_id' },
          },
        },
      },
    ]);

    // Customer retention (repeat purchase rate)
    const repeatCustomers = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          repeatCustomers: {
            $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] },
          },
        },
      },
    ]);

    const retentionRate =
      repeatCustomers[0]?.totalCustomers > 0
        ? (repeatCustomers[0]?.repeatCustomers / repeatCustomers[0]?.totalCustomers) * 100
        : 0;

    // Average time between orders
    const customerOrderFrequency = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $sort: { user: 1, createdAt: 1 } },
      {
        $group: {
          _id: '$user',
          orders: { $push: { date: '$createdAt' } },
        },
      },
      {
        $project: {
          orderCount: { $size: '$orders' },
          orders: 1,
        },
      },
      { $match: { orderCount: { $gt: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        customerValueDistribution,
        retentionRate,
        repeatCustomers: repeatCustomers[0] || { totalCustomers: 0, repeatCustomers: 0 },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product performance
// @route   GET /api/analytics/product-performance
// @access  Private/Admin
const getProductPerformance = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number.parseInt(period, 10));

    // Best performers
    const bestPerformers = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          unitsSold: { $sum: '$items.quantity' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          sku: '$product.sku',
          price: '$product.price',
          image: { $arrayElemAt: ['$product.images', 0] },
          revenue: 1,
          unitsSold: 1,
          orderCount: 1,
        },
      },
    ]);

    // Products with no sales
    const noSalesProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            {
              $match: {
                $expr: { $eq: ['$items.product', '$$productId'] },
                createdAt: { $gte: startDate },
              },
            },
          ],
          as: 'sales',
        },
      },
      {
        $match: {
          sales: { $size: 0 },
          isActive: true,
        },
      },
      {
        $project: {
          name: 1,
          sku: 1,
          price: 1,
          stockQuantity: 1,
          images: { $arrayElemAt: ['$images', 0] },
        },
      },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        bestPerformers,
        noSalesProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRevenueChart,
  getSalesByCategory,
  getCustomerInsights,
  getProductPerformance,
};
