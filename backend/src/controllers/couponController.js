const Coupon = require('../models/Coupon');

/**
 * @desc    Get all coupons with filters
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
exports.getAllCoupons = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Status filter (active/expired/upcoming)
    if (status === 'active') {
      query.isActive = true;
      query.validFrom = { $lte: new Date() };
      query.validUntil = { $gte: new Date() };
    } else if (status === 'expired') {
      query.validUntil = { $lt: new Date() };
    } else if (status === 'upcoming') {
      query.validFrom = { $gt: new Date() };
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Type filter
    if (type) {
      query.discountType = type;
    }

    // Search filter
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .sort({ [sortBy]: sortOrder })
        .limit(Number.parseInt(limit))
        .skip(skip)
        .lean(),
      Coupon.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        coupons,
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
 * @desc    Get coupon by ID
 * @route   GET /api/coupons/:id
 * @access  Private/Admin
 */
exports.getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id).lean();

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new coupon
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
exports.createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      usageLimit,
      usageLimitPerUser,
      isActive,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      res.status(400);
      throw new Error('Coupon code already exists');
    }

    // Validate discount value
    if (discountType === 'percentage' && discountValue > 100) {
      res.status(400);
      throw new Error('Percentage discount cannot exceed 100%');
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumOrderValue: minOrderAmount || 0,
      maximumDiscount: maxDiscountAmount || null,
      validFrom: validFrom || new Date(),
      validUntil,
      usageLimit: usageLimit || null,
      isActive: isActive === false ? false : true,
    });

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update coupon
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      usageLimit,
      isActive,
    } = req.body;

    // Check if new code already exists (excluding current coupon)
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        res.status(400);
        throw new Error('Coupon code already exists');
      }
      coupon.code = code.toUpperCase();
    }

    // Validate percentage
    if (
      discountType === 'percentage' &&
      discountValue &&
      discountValue > 100
    ) {
      res.status(400);
      throw new Error('Percentage discount cannot exceed 100%');
    }

    // Update fields
    if (description !== undefined) coupon.description = description;
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minOrderAmount !== undefined)
      coupon.minimumOrderValue = minOrderAmount;
    if (maxDiscountAmount !== undefined)
      coupon.maximumDiscount = maxDiscountAmount;
    if (validFrom) coupon.validFrom = validFrom;
    if (validUntil) coupon.validUntil = validUntil;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      data: {
        message: 'Coupon deleted successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle coupon status
 * @route   PATCH /api/coupons/:id/toggle
 * @access  Private/Admin
 */
exports.toggleCouponStatus = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      data: {
        couponId: coupon._id,
        isActive: coupon.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Validate and apply coupon
 * @route   POST /api/coupons/validate
 * @access  Private
 */
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      res.status(400);
      throw new Error('Coupon code and order amount are required');
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404);
      throw new Error('Invalid coupon code');
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      res.status(400);
      throw new Error('This coupon is not active');
    }

    // Check if coupon is valid (date range)
    const now = new Date();
    if (coupon.validFrom > now) {
      res.status(400);
      throw new Error('This coupon is not yet valid');
    }
    if (coupon.validUntil < now) {
      res.status(400);
      throw new Error('This coupon has expired');
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      res.status(400);
      throw new Error('This coupon has reached its usage limit');
    }

    // Check minimum order amount
    if (orderAmount < coupon.minimumOrderValue) {
      res.status(400);
      throw new Error(
        `Minimum order amount of ₹${coupon.minimumOrderValue} required`
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    const finalAmount = Math.max(0, orderAmount - discountAmount);

    res.status(200).json({
      success: true,
      data: {
        valid: true,
        couponId: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        originalAmount: orderAmount,
        finalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get coupon statistics
 * @route   GET /api/coupons/stats
 * @access  Private/Admin
 */
exports.getCouponStats = async (req, res, next) => {
  try {
    const now = new Date();

    const stats = await Coupon.aggregate([
      {
        $facet: {
          totalCoupons: [{ $count: 'count' }],
          activeCoupons: [
            {
              $match: {
                isActive: true,
                validFrom: { $lte: now },
                validUntil: { $gte: now },
              },
            },
            { $count: 'count' },
          ],
          expiredCoupons: [
            { $match: { validUntil: { $lt: now } } },
            { $count: 'count' },
          ],
          totalUsage: [
            { $group: { _id: null, total: { $sum: '$usedCount' } } },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: stats[0].totalCoupons[0]?.count || 0,
        active: stats[0].activeCoupons[0]?.count || 0,
        expired: stats[0].expiredCoupons[0]?.count || 0,
        totalUsage: stats[0].totalUsage[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
