const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   GET /api/page-content
// @desc    Get all page content (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page, isActive } = req.query;
    
    const query = {};
    if (page) query.page = page;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const content = await PageContent.find(query)
      .populate('lastUpdatedBy', 'name email')
      .sort({ page: 1 });
    
    res.json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page content',
      error: error.message,
    });
  }
});

// @route   GET /api/page-content/:page
// @desc    Get specific page content by page name
// @access  Public
router.get('/:page', async (req, res) => {
  try {
    const content = await PageContent.findOne({ 
      page: req.params.page,
      isActive: true 
    }).populate('lastUpdatedBy', 'name email');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Page content not found',
      });
    }
    
    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page content',
      error: error.message,
    });
  }
});

// @route   POST /api/page-content
// @desc    Create new page content
// @access  Admin only
router.post('/', protect, admin, async (req, res) => {
  try {
    const { page, title, subtitle, sections, metadata, isActive } = req.body;
    
    // Check if page content already exists
    const existingContent = await PageContent.findOne({ page });
    if (existingContent) {
      return res.status(400).json({
        success: false,
        message: `Content for page '${page}' already exists. Use PUT to update.`,
      });
    }
    
    const content = await PageContent.create({
      page,
      title,
      subtitle,
      sections,
      metadata,
      isActive,
      lastUpdatedBy: req.user._id,
    });
    
    res.status(201).json({
      success: true,
      message: 'Page content created successfully',
      data: content,
    });
  } catch (error) {
    console.error('Error creating page content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create page content',
      error: error.message,
    });
  }
});

// @route   PUT /api/page-content/:page
// @desc    Update page content
// @access  Admin only
router.put('/:page', protect, admin, async (req, res) => {
  try {
    const { title, subtitle, sections, metadata, isActive } = req.body;
    
    const content = await PageContent.findOne({ page: req.params.page });
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Page content not found',
      });
    }
    
    // Update fields
    if (title !== undefined) content.title = title;
    if (subtitle !== undefined) content.subtitle = subtitle;
    if (sections !== undefined) content.sections = sections;
    if (metadata !== undefined) content.metadata = metadata;
    if (isActive !== undefined) content.isActive = isActive;
    content.lastUpdatedBy = req.user._id;
    
    await content.save();
    
    const updatedContent = await PageContent.findById(content._id)
      .populate('lastUpdatedBy', 'name email');
    
    res.json({
      success: true,
      message: 'Page content updated successfully',
      data: updatedContent,
    });
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update page content',
      error: error.message,
    });
  }
});

// @route   DELETE /api/page-content/:page
// @desc    Delete page content
// @access  Admin only
router.delete('/:page', protect, admin, async (req, res) => {
  try {
    const content = await PageContent.findOne({ page: req.params.page });
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Page content not found',
      });
    }
    
    await content.deleteOne();
    
    res.json({
      success: true,
      message: 'Page content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting page content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete page content',
      error: error.message,
    });
  }
});

// @route   PATCH /api/page-content/:page/toggle
// @desc    Toggle page content active status
// @access  Admin only
router.patch('/:page/toggle', protect, admin, async (req, res) => {
  try {
    const content = await PageContent.findOne({ page: req.params.page });
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Page content not found',
      });
    }
    
    content.isActive = !content.isActive;
    content.lastUpdatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: `Page content ${content.isActive ? 'activated' : 'deactivated'} successfully`,
      data: content,
    });
  } catch (error) {
    console.error('Error toggling page content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle page content',
      error: error.message,
    });
  }
});

module.exports = router;
