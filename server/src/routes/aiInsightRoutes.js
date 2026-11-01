const express = require('express');
const router = express.Router();
const { getAllInsights } = require('../controllers/aiInsightController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllInsights);

module.exports = router;
