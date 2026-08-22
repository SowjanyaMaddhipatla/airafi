const express = require('express');
const { createProfile, getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/onboarding', createProfile);
router.get('/', getProfile);

module.exports = router;
