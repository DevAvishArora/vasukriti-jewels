const HeroSection = require('../models/HeroSection');
const StaticContent = require('../models/StaticContent');
const FAQ = require('../models/FAQ');

// ==================== HERO SECTION ====================

// Get active hero sections
exports.getActiveHeroSections = async (req, res) => {
  try {
    const { preview } = req.query;
    
    const query = preview === 'true' 
      ? { isDraft: true }
      : { isActive: true, isDraft: false };

    const heroSections = await HeroSection.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: heroSections,
    });
  } catch (error) {
    console.error('Error fetching hero sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero sections',
      error: error.message,
    });
  }
};

// Get all hero sections (Admin)
exports.getAllHeroSections = async (req, res) => {
  try {
    const heroSections = await HeroSection.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: heroSections,
    });
  } catch (error) {
    console.error('Error fetching hero sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero sections',
      error: error.message,
    });
  }
};

// Get hero section by ID (Admin)
exports.getHeroSectionById = async (req, res) => {
  try {
    const heroSection = await HeroSection.findById(req.params.id);

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found',
      });
    }

    res.status(200).json({
      success: true,
      data: heroSection,
    });
  } catch (error) {
    console.error('Error fetching hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero section',
      error: error.message,
    });
  }
};

// Create hero section (Admin)
exports.createHeroSection = async (req, res) => {
  try {
    const heroSection = await HeroSection.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hero section created successfully',
      data: heroSection,
    });
  } catch (error) {
    console.error('Error creating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hero section',
      error: error.message,
    });
  }
};

// Update hero section (Admin)
exports.updateHeroSection = async (req, res) => {
  try {
    const heroSection = await HeroSection.findByIdAndUpdate(
      req.params.id,
      { ...req.body, version: req.body.version ? req.body.version + 1 : 1 },
      { new: true, runValidators: true }
    );

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      data: heroSection,
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hero section',
      error: error.message,
    });
  }
};

// Delete hero section (Admin)
exports.deleteHeroSection = async (req, res) => {
  try {
    const heroSection = await HeroSection.findByIdAndDelete(req.params.id);

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found',
      });
    }

    // Delete images from Cloudinary
    // TODO: Implement cloudinary deletion if needed
    // if (heroSection.images && heroSection.images.length > 0) {
    //   for (const image of heroSection.images) {
    //     if (image.publicId) {
    //       await deleteFromCloudinary(image.publicId);
    //     }
    //   }
    // }

    res.status(200).json({
      success: true,
      message: 'Hero section deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hero section',
      error: error.message,
    });
  }
};

// Publish hero section (Admin)
exports.publishHeroSection = async (req, res) => {
  try {
    const heroSection = await HeroSection.findByIdAndUpdate(
      req.params.id,
      { isActive: true, isDraft: false },
      { new: true }
    );

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hero section published successfully',
      data: heroSection,
    });
  } catch (error) {
    console.error('Error publishing hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish hero section',
      error: error.message,
    });
  }
};

// ==================== STATIC CONTENT ====================

// Get static content by key
exports.getStaticContentByKey = async (req, res) => {
  try {
    const { preview } = req.query;
    const { key } = req.params;
    
    const query = preview === 'true' 
      ? { sectionKey: key, isDraft: true }
      : { sectionKey: key, isActive: true, isDraft: false };

    const content = await StaticContent.findOne(query);

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Error fetching static content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch static content',
      error: error.message,
    });
  }
};

// Get all static content (Admin)
exports.getAllStaticContent = async (req, res) => {
  try {
    const content = await StaticContent.find().sort({ sectionKey: 1 });

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Error fetching static content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch static content',
      error: error.message,
    });
  }
};

// Update or create static content (Admin)
exports.upsertStaticContent = async (req, res) => {
  try {
    const { sectionKey } = req.params;

    const content = await StaticContent.findOneAndUpdate(
      { sectionKey },
      { ...req.body, sectionKey },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Static content updated successfully',
      data: content,
    });
  } catch (error) {
    console.error('Error updating static content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update static content',
      error: error.message,
    });
  }
};

// Publish static content (Admin)
exports.publishStaticContent = async (req, res) => {
  try {
    const { sectionKey } = req.params;

    const content = await StaticContent.findOneAndUpdate(
      { sectionKey },
      { isActive: true, isDraft: false },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Static content not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Static content published successfully',
      data: content,
    });
  } catch (error) {
    console.error('Error publishing static content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish static content',
      error: error.message,
    });
  }
};

// ==================== FAQ ====================

// Get active FAQs
exports.getActiveFAQs = async (req, res) => {
  try {
    const { category, preview } = req.query;
    
    const query = preview === 'true' 
      ? { isDraft: true }
      : { isActive: true, isDraft: false };

    if (category) {
      query.category = category;
    }

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message,
    });
  }
};

// Get all FAQs (Admin)
exports.getAllFAQs = async (req, res) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    
    const query = category ? { category } : {};

    const faqs = await FAQ.find(query)
      .sort({ category: 1, order: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await FAQ.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        faqs,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message,
    });
  }
};

// Get FAQ by ID (Admin)
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ',
      error: error.message,
    });
  }
};

// Create FAQ (Admin)
exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create FAQ',
      error: error.message,
    });
  }
};

// Update FAQ (Admin)
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
      error: error.message,
    });
  }
};

// Delete FAQ (Admin)
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ',
      error: error.message,
    });
  }
};

// Bulk update FAQ order (Admin)
exports.updateFAQOrder = async (req, res) => {
  try {
    const { faqs } = req.body; // Array of { id, order }

    const updatePromises = faqs.map(({ id, order }) =>
      FAQ.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'FAQ order updated successfully',
    });
  } catch (error) {
    console.error('Error updating FAQ order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ order',
      error: error.message,
    });
  }
};

// Publish FAQ (Admin)
exports.publishFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { isActive: true, isDraft: false },
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ published successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Error publishing FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish FAQ',
      error: error.message,
    });
  }
};
