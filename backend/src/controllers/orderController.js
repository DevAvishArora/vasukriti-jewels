const Order = require('../models/Order');
const Product = require('../models/Product');
const logger = require('../utils/logger');
const { sendOrderConfirmation, sendShippingUpdate } = require('../utils/emailService');

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Filter by order status
    if (status) {
      query.orderStatus = status;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Search by order number or customer name
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const orders = await Order.find(query)
      .populate('user', 'fullName email phone')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'fullName email phone')
      .populate('items.product', 'name slug');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is admin or order owner
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    logger.error('Error fetching order:', error);
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };

    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching user orders:', error);
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Calculate final price (after discount)
      const finalPrice = product.discount > 0 
        ? product.price - (product.price * product.discount) / 100 
        : product.price;

      const itemSubtotal = finalPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price: finalPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    // Calculate tax (18% GST)
    const tax = subtotal * 0.18;

    // Calculate shipping (free above 5000, otherwise 200)
    const shippingCharge = subtotal >= 5000 ? 0 : 200;

    // Apply coupon discount (to be implemented with Coupon model)
    const discount = 0;

    const totalAmount = subtotal + tax + shippingCharge - discount;

    // Generate order number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `VJ${year}${month}${random}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      subtotal,
      discount,
      shippingCharge,
      tax,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    // Reduce stock quantity
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Populate order items for email template
    await order.populate('items.product', 'name images');

    // Send order confirmation email
    try {
      await sendOrderConfirmation(
        {
          ...order.toObject(),
          itemsPrice: subtotal,
          shippingPrice: shippingCharge,
          taxPrice: tax,
          discountAmount: discount,
        },
        { email: req.user.email, name: req.user.fullName }
      );
    } catch (emailError) {
      logger.error('Failed to send order confirmation email:', emailError);
      // Don't fail order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;

    // Add status to history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    // Update specific fields based on status
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'completed';
    } else if (status === 'cancelled') {
      order.cancelledAt = new Date();
      order.cancellationReason = note;

      // Restore stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.save();

    // Send shipping update email when order is shipped or delivered
    if (status === 'shipped' || status === 'delivered') {
      try {
        await order.populate('user', 'email fullName');
        await sendShippingUpdate(
          order,
          { email: order.user.email, name: order.user.fullName },
          order.trackingNumber ? { carrier: order.courier, trackingNumber: order.trackingNumber } : null
        );
      } catch (emailError) {
        logger.error('Failed to send shipping update email:', emailError);
        // Don't fail status update if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order },
    });
  } catch (error) {
    logger.error('Error updating order status:', error);
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentDetails } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = paymentStatus;
    if (paymentDetails) {
      order.paymentDetails = paymentDetails;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: { order },
    });
  } catch (error) {
    logger.error('Error updating payment status:', error);
    next(error);
  }
};

// @desc    Add tracking information
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
const addTrackingInfo = async (req, res, next) => {
  try {
    const { trackingNumber, courier, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.trackingNumber = trackingNumber;
    order.courier = courier;
    order.estimatedDelivery = estimatedDelivery;
    order.orderStatus = 'shipped';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Tracking information added successfully',
      data: { order },
    });
  } catch (error) {
    logger.error('Error adding tracking info:', error);
    next(error);
  }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'fullName email');

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        avgOrderValue,
        recentOrders,
      },
    });
  } catch (error) {
    logger.error('Error fetching order stats:', error);
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrder,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  addTrackingInfo,
  getOrderStats,
};
