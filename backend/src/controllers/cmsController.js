const PromotionalBar = require('../models/PromotionalBar');

// Get active promotional bar
exports.getActivePromotionalBar = async (req, res) => {
  try {
    const { preview } = req.query;
    
    const query = preview === 'true' 
      ? { isDraft: true }
      : { isActive: true, isDraft: false };

    const promotionalBar = await PromotionalBar.findOne(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: promotionalBar,
    });
  } catch (error) {
    console.error('Error fetching promotional bar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotional bar',
      error: error.message,
    });
  }
};

// Get all promotional bars (Admin)
exports.getAllPromotionalBars = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const promotionalBars = await PromotionalBar.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await PromotionalBar.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        promotionalBars,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
    });
  } catch (error) {
    console.error('Error fetching promotional bars:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotional bars',
      error: error.message,
    });
  }
};

// Get promotional bar by ID (Admin)
exports.getPromotionalBarById = async (req, res) => {
  try {
    const promotionalBar = await PromotionalBar.findById(req.params.id);

    if (!promotionalBar) {
      return res.status(404).json({
        success: false,
        message: 'Promotional bar not found',
      });
    }

    res.status(200).json({
      success: true,
      data: promotionalBar,
    });
  } catch (error) {
    console.error('Error fetching promotional bar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotional bar',
      error: error.message,
    });
  }
};

// Create promotional bar (Admin)
exports.createPromotionalBar = async (req, res) => {
  try {
    const promotionalBar = await PromotionalBar.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Promotional bar created successfully',
      data: promotionalBar,
    });
  } catch (error) {
    console.error('Error creating promotional bar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create promotional bar',
      error: error.message,
    });
  }
};

// Update promotional bar (Admin)
exports.updatePromotionalBar = async (req, res) => {
  try {
    const promotionalBar = await PromotionalBar.findByIdAndUpdate(
      req.params.id,
      { ...req.body, version: req.body.version ? req.body.version + 1 : 1 },
      { new: true, runValidators: true }
    );

    if (!promotionalBar) {
      return res.status(404).json({
        success: false,
        message: 'Promotional bar not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promotional bar updated successfully',
      data: promotionalBar,
    });
  } catch (error) {
    console.error('Error updating promotional bar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update promotional bar',
      error: error.message,
    });
  }
};

// Delete promotional bar (Admin)
exports.deletePromotionalBar = async (req, res) => {
  try {
    const promotionalBar = await PromotionalBar.findByIdAndDelete(req.params.id);

    if (!promotionalBar) {
      return res.status(404).json({
        success: false,
        message: 'Promotional bar not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promotional bar deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting promotional bar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete promotional bar',
      error: error.message,
    });
  }
};

// Publish promotional bar (Admin)
exports.publishPromotionalBar = async (req, res) => {
  try {
    // Deactivate all active promotional bars
    await PromotionalBar.updateMany({ isActive: true }, { isActive: false });

    // Publish the selected one
    const promotionalBar = await PromotionalBar.findByIdAndUpdate(
      req.params.id,
      { isActive: true, isDraft: false },
      { new: true }
    );

    if (!promotionalBar) {
      return res.status(404).json({
        success: false,
        message: 'Promotional bar not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promotional bar published successfully',
      data: promotionalBar,
    });
  } catch (error) {
    console.error('Error publishing promotional bar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish promotional bar',
      error: error.message,
    });
  }
};
