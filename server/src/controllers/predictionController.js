const Employee = require('../models/Employee');
const Prediction = require('../models/Prediction');
const ActivityLog = require('../models/ActivityLog');
const mlService = require('../services/mlService');

// @desc    Run prediction on existing employee
// @route   POST /api/employees/:id/predict
// @access  Private
exports.predictEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const mlPayload = employee.toMLPayload();
    const mlResult = await mlService.predictSingle(mlPayload);

    const predictionRecord = await Prediction.create({
      employeeId: employee._id,
      userId: req.user.id,
      modelVersion: mlResult.Explanation?.model_name || 'Logistic Regression v1.0',
      prediction: mlResult.Prediction,
      probabilityLeaving: mlResult.Probability_Leaving,
      probabilityStaying: mlResult.Probability_Staying,
      riskLevel: mlResult.Risk_Level,
      recommendation: mlResult.Recommendation,
      topRiskDrivers: mlResult.Explanation?.top_risk_factors || [],
      topProtectiveFactors: mlResult.Explanation?.top_protective_factors || [],
      inputSnapshot: mlPayload
    });

    employee.currentPrediction = {
      prediction: mlResult.Prediction,
      probabilityLeaving: mlResult.Probability_Leaving,
      probabilityStaying: mlResult.Probability_Staying,
      riskLevel: mlResult.Risk_Level,
      recommendation: mlResult.Recommendation,
      topRiskDrivers: mlResult.Top_Risk_Drivers || [],
      topProtectiveFactors: mlResult.Top_Protective_Factors || [],
      predictedAt: new Date()
    };
    await employee.save();

    await ActivityLog.create({
      userId: req.user.id,
      userName: req.user.name,
      action: 'PREDICTION_RUN',
      entityType: 'Prediction',
      entityId: predictionRecord._id,
      description: `Ran attrition prediction for ${employee.name}: ${mlResult.Risk_Level} Risk (${mlResult.Probability_Leaving}%)`
    });

    res.status(200).json({
      success: true,
      data: predictionRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all historical predictions for an employee
// @route   GET /api/employees/:id/predictions
// @access  Private
exports.getEmployeePredictions = async (req, res, next) => {
  try {
    const predictions = await Prediction.find({ employeeId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all company predictions with filters & pagination
// @route   GET /api/predictions
// @access  Private
exports.getAllPredictions = async (req, res, next) => {
  try {
    const { riskLevel, prediction, page = 1, limit = 15 } = req.query;
    const query = {};

    if (riskLevel && riskLevel !== 'All') {
      query.riskLevel = riskLevel;
    }
    if (prediction && prediction !== 'All') {
      query.prediction = prediction;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Prediction.countDocuments(query);
    const predictions = await Prediction.find(query)
      .populate('employeeId', 'employeeId name Department JobRole avatar')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: predictions.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: predictions
    });
  } catch (error) {
    next(error);
  }
};
