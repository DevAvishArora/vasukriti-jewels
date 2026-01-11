const User = require('../models/User');
const Order = require('../models/Order');

/**
 * @desc    Get all users with filters (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
  const {
    page = 1,
    limit = 20,
    role,
    isActive,
    search,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const query = {};

  // Role filter
  if (role) {
    query.role = role;
  }

  // Active status filter
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  // Search by name or email
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);
  const sortOrder = order === 'desc' ? -1 : 1;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -refreshToken')
      .sort({ [sortBy]: sortOrder })
      .limit(Number.parseInt(limit))
      .skip(skip)
      .lean(),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users,
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
 * @desc    Get user by ID with stats (admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUserById = async (req, res, next) => {
  try {
  const user = await User.findById(req.params.id)
    .select('-password -refreshToken')
    .lean();

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get user's order statistics
  const orderStats = await Order.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
        },
      },
    },
  ]);

  const stats = orderStats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
  };

  // Get recent orders
  const recentOrders = await Order.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('orderNumber totalAmount status createdAt')
    .lean();

  res.status(200).json({
    success: true,
    data: {
      user,
      stats,
      recentOrders,
    },
  });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new user (admin/staff) - admin only
 * @route   POST /api/users
 * @access  Private/Admin
 */
exports.createUser = async (req, res, next) => {
  try {
  const { email, fullName, phone, password, role, isActive } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Only allow creating admin/staff users through this endpoint
  if (!['admin', 'staff'].includes(role)) {
    res.status(400);
    throw new Error('Can only create admin or staff users through this endpoint');
  }

  const user = await User.create({
    email,
    fullName,
    phone,
    password,
    role,
    isActive: isActive === undefined ? true : isActive,
    isEmailVerified: true, // Admin-created users are pre-verified
  });

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  res.status(201).json({
    success: true,
    data: userResponse,
  });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user (admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res, next) => {
  try {
  const { fullName, email, phone, role, isActive, isEmailVerified } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from demoting themselves
  if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
    res.status(400);
    throw new Error('Cannot change your own admin role');
  }

  // Update allowed fields
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (isEmailVerified !== undefined) user.isEmailVerified = isEmailVerified;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  res.status(200).json({
    success: true,
    data: userResponse,
  });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active status (admin only)
 * @route   PATCH /api/users/:id/toggle-status
 * @access  Private/Admin
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from deactivating themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot deactivate your own account');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      userId: user._id,
      isActive: user.isActive,
    },
  });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user (admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }

  // Check if user has orders
  const orderCount = await Order.countDocuments({ user: user._id });
  if (orderCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete user with ${orderCount} orders. Deactivate instead.`
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {
      message: 'User deleted successfully',
    },
  });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user statistics (admin only)
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
exports.getUserStats = async (req, res, next) => {
  try {
  const stats = await User.aggregate([
    {
      $facet: {
        totalByRole: [
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 },
            },
          },
        ],
        activeVsInactive: [
          {
            $group: {
              _id: '$isActive',
              count: { $sum: 1 },
            },
          },
        ],
        verifiedVsUnverified: [
          {
            $group: {
              _id: '$isEmailVerified',
              count: { $sum: 1 },
            },
          },
        ],
        recentSignups: [
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 30 },
        ],
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats[0],
  });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, phone } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        email,
        phone,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check current password
    const isPasswordMatch = await user.matchPassword(currentPassword);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
