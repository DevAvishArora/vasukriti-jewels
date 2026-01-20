const WhyChooseUs = require('../models/WhyChooseUs');

// Get all features
exports.getAll = async (req, res) => {
  try {
    const features = await WhyChooseUs.find({ isActive: true }).sort({ order: 1 });
    res.json({
      success: true,
      data: features,
    });
  } catch (error) {
    console.error('Error fetching why-choose-us features:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch features',
    });
  }
};

// Get all features (admin - including inactive)
exports.getAllAdmin = async (req, res) => {
  try {
    const features = await WhyChooseUs.find().sort({ order: 1 });
    res.json({
      success: true,
      data: features,
    });
  } catch (error) {
    console.error('Error fetching why-choose-us features:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch features',
    });
  }
};

// Create feature
exports.create = async (req, res) => {
  try {
    const { title, description, icon, order } = req.body;

    const feature = new WhyChooseUs({
      title,
      description,
      icon: icon || 'award',
      order: order || 0,
    });

    await feature.save();

    res.status(201).json({
      success: true,
      message: 'Feature created successfully',
      data: feature,
    });
  } catch (error) {
    console.error('Error creating feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feature',
    });
  }
};

// Update feature
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, order, isActive } = req.body;

    const feature = await WhyChooseUs.findByIdAndUpdate(
      id,
      { title, description, icon, order, isActive },
      { new: true, runValidators: true }
    );

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }

    res.json({
      success: true,
      message: 'Feature updated successfully',
      data: feature,
    });
  } catch (error) {
    console.error('Error updating feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feature',
    });
  }
};

// Delete feature
exports.deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await WhyChooseUs.findByIdAndDelete(id);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }

    res.json({
      success: true,
      message: 'Feature deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feature',
    });
  }
};

// Apply template
exports.applyTemplate = async (req, res) => {
  try {
    const { template } = req.body;

    // Delete existing features
    await WhyChooseUs.deleteMany({});

    let features = [];

    switch (template) {
      case 'trust':
        features = [
          { title: '100% Certified', description: 'BIS Hallmarked & Certified', icon: 'certificate', order: 1 },
          { title: 'Premium Quality', description: 'Finest materials with strict quality control', icon: 'shield', order: 2 },
          { title: 'Lifetime Warranty', description: 'Complete coverage on manufacturing defects', icon: 'award', order: 3 },
          { title: 'Easy Returns', description: '30-day hassle-free return policy', icon: 'refresh', order: 4 },
        ];
        break;

      case 'service':
        features = [
          { title: 'Free Shipping', description: 'Complimentary insured shipping across India', icon: 'truck', order: 1 },
          { title: 'Expert Consultation', description: 'Personalized guidance from jewelry experts', icon: 'heart', order: 2 },
          { title: '24/7 Support', description: 'Always here to help with any questions', icon: 'sparkles', order: 3 },
          { title: 'Gift Wrapping', description: 'Complimentary premium gift packaging', icon: 'gift', order: 4 },
        ];
        break;

      case 'value':
        features = [
          { title: 'Best Prices', description: 'Competitive pricing with best value guarantee', icon: 'diamond', order: 1 },
          { title: 'Unique Designs', description: 'Exclusive designs you won\'t find elsewhere', icon: 'sparkles', order: 2 },
          { title: 'Master Artisans', description: 'Handcrafted by experienced craftsmen', icon: 'hammer', order: 3 },
          { title: 'Trusted Brand', description: '20+ years of excellence and customer trust', icon: 'star', order: 4 },
        ];
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid template',
        });
    }

    await WhyChooseUs.insertMany(features);

    const savedFeatures = await WhyChooseUs.find().sort({ order: 1 });

    res.json({
      success: true,
      message: 'Template applied successfully',
      data: savedFeatures,
    });
  } catch (error) {
    console.error('Error applying template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply template',
    });
  }
};
