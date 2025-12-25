const User = require('../models/User');
const Order = require('../models/Order');
const logger = require('../utils/logger');

// @desc    Get all customers with filtering and pagination
// @route   GET /api/customers
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      isActive,
      isVerified,
      sort = '-createdAt',
    } = req.query;

    // Build query - only get customers (not admins)
    const query = { role: 'customer' };

    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    // Execute query with pagination
    const customers = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken')
      .sort(sort)
      .limit(Number.parseInt(limit, 10))
      .skip((Number.parseInt(page, 10) - 1) * Number.parseInt(limit, 10));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get order counts for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ user: customer._id });
        const totalSpent = await Order.aggregate([
          { $match: { user: customer._id, paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        return {
          ...customer.toObject(),
          orderCount,
          totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        customers: customersWithStats,
        pagination: {
          page: Number.parseInt(page, 10),
          limit: Number.parseInt(limit, 10),
          total,
          pages: Math.ceil(total / Number.parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer with detailed information
// @route   GET /api/customers/:id
// @access  Private/Admin
const getCustomer = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id)
      .select('-password -verificationToken -resetPasswordToken')
      .populate('wishlist', 'name price images');

    if (!customer || customer.role !== 'customer') {
      res.status(404);
      throw new Error('Customer not found');
    }

    // Get customer's order statistics
    const orders = await Order.find({ user: customer._id })
      .sort('-createdAt')
      .populate('items.product', 'name images');

    const orderStats = await Order.aggregate([
      { $match: { user: customer._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] },
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] },
          },
          averageOrderValue: {
            $avg: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] },
          },
        },
      },
    ]);

    // Get last order date
    const lastOrder = await Order.findOne({ user: customer._id })
      .sort('-createdAt')
      .select('createdAt');

    const customerData = {
      ...customer.toObject(),
      stats: orderStats.length > 0 ? orderStats[0] : {
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        averageOrderValue: 0,
      },
      lastOrderDate: lastOrder ? lastOrder.createdAt : null,
      recentOrders: orders.slice(0, 10), // Last 10 orders
    };

    res.status(200).json({
      success: true,
      data: { customer: customerData },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's order history
// @route   GET /api/customers/:id/orders
// @access  Private/Admin
const getCustomerOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Verify customer exists
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      res.status(404);
      throw new Error('Customer not found');
    }

    // Build query
    const query = { user: req.params.id };
    if (status) {
      query.orderStatus = status;
    }

    // Get orders
    const orders = await Order.find(query)
      .populate('items.product', 'name price images')
      .sort('-createdAt')
      .limit(Number.parseInt(limit, 10))
      .skip((Number.parseInt(page, 10) - 1) * Number.parseInt(limit, 10));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number.parseInt(page, 10),
          limit: Number.parseInt(limit, 10),
          total,
          pages: Math.ceil(total / Number.parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer status (active/inactive)
// @route   PUT /api/customers/:id/status
// @access  Private/Admin
const updateCustomerStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      res.status(404);
      throw new Error('Customer not found');
    }

    customer.isActive = isActive;
    await customer.save();

    logger.info(
      `Customer ${customer.email} status updated to ${isActive ? 'active' : 'inactive'} by admin ${req.user.id}`
    );

    res.status(200).json({
      success: true,
      message: 'Customer status updated successfully',
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer analytics/statistics
// @route   GET /api/customers/analytics/stats
// @access  Private/Admin
const getCustomerStats = async (req, res, next) => {
  try {
    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCustomers = await User.countDocuments({
      role: 'customer',
      isActive: true,
    });
    const verifiedCustomers = await User.countDocuments({
      role: 'customer',
      isVerified: true,
    });

    // New customers this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startOfMonth },
    });

    // Top customers by total spent
    const topCustomers = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        $project: {
          _id: 1,
          totalSpent: 1,
          orderCount: 1,
          'customer.fullName': 1,
          'customer.email': 1,
          'customer.avatar': 1,
        },
      },
    ]);

    // Customer growth over last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const customerGrowth = await User.aggregate([
      {
        $match: {
          role: 'customer',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          activeCustomers,
          verifiedCustomers,
          newCustomersThisMonth,
        },
        topCustomers,
        customerGrowth,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer (soft delete - set inactive)
// @route   DELETE /api/customers/:id
// @access  Private/Admin
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer || customer.role !== 'customer') {
      res.status(404);
      throw new Error('Customer not found');
    }

    // Soft delete - just set to inactive
    customer.isActive = false;
    await customer.save();

    logger.info(`Customer ${customer.email} deactivated by admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Customer deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  getCustomerOrders,
  updateCustomerStatus,
  getCustomerStats,
  deleteCustomer,
};
