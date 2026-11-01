const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max CSV
});

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  analyzeEmployeeForm,
  uploadCSV,
  clearAllEmployees
} = require('../controllers/employeeController');
const { predictEmployee, getEmployeePredictions } = require('../controllers/predictionController');
const { generateInsight, getEmployeeInsights } = require('../controllers/aiInsightController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/upload-csv', upload.single('file'), uploadCSV);
router.post('/clear-all', clearAllEmployees);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.post('/analyze', analyzeEmployeeForm);

router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

router.post('/:id/predict', predictEmployee);
router.get('/:id/predictions', getEmployeePredictions);

router.post('/:id/ai-analysis', generateInsight);
router.get('/:id/ai-insights', getEmployeeInsights);

module.exports = router;
