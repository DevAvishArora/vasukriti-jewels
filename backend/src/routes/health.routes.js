const express = require('express');
const router = express.Router();

// Health check endpoint for monitoring
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
    },
  });
});

// Liveness probe (Kubernetes/Docker compatibility)
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe
router.get('/ready', async (req, res) => {
  try {
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'not ready',
        reason: 'database not connected',
      });
    }

    res.status(200).json({
      status: 'ready',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
    });
  }
});

module.exports = router;
