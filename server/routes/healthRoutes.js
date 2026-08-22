const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// GET /api/health — confirms the server is up and reports DB connection state.
router.get('/', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.status(200).json({
    success: true,
    message: 'AiraFi API is alive',
    timestamp: new Date().toISOString(),
    db: dbStates[mongoose.connection.readyState] || 'unknown',
  });
});

module.exports = router;
