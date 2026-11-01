const express = require('express');
const router = express.Router();
const { getAllPredictions } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllPredictions);

module.exports = router;
