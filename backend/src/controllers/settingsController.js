const Settings = require('../models/Settings');

/**
 * @desc    Get all settings
 * @route   GET /api/settings
 * @access  Private/Admin
 */
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update settings
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.updateSettings(req.body);
    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public settings (non-sensitive data)
 * @route   GET /api/settings/public
 * @access  Public
 */
exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();

    // Return only public-safe settings
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      tax: {
        enabled: settings.tax.enabled,
        gstRate: settings.tax.gstRate,
        includedInPrice: settings.tax.includedInPrice,
      },
      shipping: {
        enabled: settings.shipping.enabled,
        freeShippingThreshold: settings.shipping.freeShippingThreshold,
        defaultShippingCharge: settings.shipping.defaultShippingCharge,
        estimatedDeliveryDays: settings.shipping.estimatedDeliveryDays,
      },
      paymentGateways: {
        cod: {
          enabled: settings.paymentGateways.cod.enabled,
          minOrderAmount: settings.paymentGateways.cod.minOrderAmount,
          maxOrderAmount: settings.paymentGateways.cod.maxOrderAmount,
        },
        razorpay: {
          enabled: settings.paymentGateways.razorpay.enabled,
          keyId: settings.paymentGateways.razorpay.keyId,
        },
        stripe: {
          enabled: settings.paymentGateways.stripe.enabled,
          publishableKey: settings.paymentGateways.stripe.publishableKey,
        },
      },
      order: {
        orderPrefix: settings.order.orderPrefix,
        minOrderAmount: settings.order.minOrderAmount,
        allowCancellation: settings.order.allowCancellation,
        cancellationPeriodHours: settings.order.cancellationPeriodHours,
      },
      socialMedia: settings.socialMedia,
      seo: {
        metaTitle: settings.seo.metaTitle,
        metaDescription: settings.seo.metaDescription,
        metaKeywords: settings.seo.metaKeywords,
      },
      maintenance: settings.maintenance,
    };

    res.status(200).json({
      success: true,
      data: publicSettings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update specific setting section
 * @route   PATCH /api/settings/:section
 * @access  Private/Admin
 */
exports.updateSettingsSection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    const validSections = [
      'siteName',
      'siteDescription',
      'contactEmail',
      'contactPhone',
      'address',
      'currency',
      'currencySymbol',
      'timezone',
      'tax',
      'shipping',
      'paymentGateways',
      'email',
      'order',
      'inventory',
      'socialMedia',
      'seo',
      'maintenance',
    ];

    if (!validSections.includes(section)) {
      res.status(400);
      throw new Error('Invalid settings section');
    }

    const settings = await Settings.getSettings();
    settings[section] = updates;
    await settings.save();

    res.status(200).json({
      success: true,
      data: settings,
      message: `${section} settings updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset settings to default
 * @route   POST /api/settings/reset
 * @access  Private/Admin
 */
exports.resetSettings = async (req, res, next) => {
  try {
    // Delete existing settings
    await Settings.deleteMany({});

    // Create new default settings
    const settings = await Settings.create({});

    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings reset to default values',
    });
  } catch (error) {
    next(error);
  }
};
