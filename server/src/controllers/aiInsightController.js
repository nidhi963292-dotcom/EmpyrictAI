const Employee = require('../models/Employee');
const Prediction = require('../models/Prediction');
const AIInsight = require('../models/AIInsight');
const ActivityLog = require('../models/ActivityLog');
const groqService = require('../services/groqService');

// @desc    Generate Groq AI Insight for an employee
// @route   POST /api/employees/:id/ai-analysis
// @access  Private
exports.generateInsight = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Get latest prediction or run one
    let latestPrediction = await Prediction.findOne({ employeeId: employee._id }).sort({ createdAt: -1 });
    if (!latestPrediction) {
      return res.status(400).json({
        success: false,
        message: 'Please run an ML prediction first before generating AI insights.'
      });
    }

    const mlPayload = employee.toMLPayload();
    const aiResult = await groqService.generateAnalysis(mlPayload, {
      prediction: latestPrediction.prediction,
      probabilityLeaving: latestPrediction.probabilityLeaving,
      probabilityStaying: latestPrediction.probabilityStaying,
      riskLevel: latestPrediction.riskLevel,
      recommendation: latestPrediction.recommendation,
      topRiskDrivers: latestPrediction.topRiskDrivers || [],
      topProtectiveFactors: latestPrediction.topProtectiveFactors || []
    });

    const aiInsight = await AIInsight.create({
      employeeId: employee._id,
      predictionId: latestPrediction._id,
      userId: req.user.id,
      priority: aiResult.priority,
      summary: aiResult.summary,
      keyRiskFactors: aiResult.keyRiskFactors,
      recommendedActions: aiResult.recommendedActions,
      retentionStrategy: aiResult.retentionStrategy,
      rawResponse: aiResult.rawResponse,
      model: aiResult.model,
      disclaimer: aiResult.disclaimer
    });

    employee.currentAiInsight = {
      priority: aiInsight.priority,
      summary: aiInsight.summary,
      generatedAt: new Date()
    };
    await employee.save();

    await ActivityLog.create({
      userId: req.user.id,
      userName: req.user.name,
      action: 'AI_INSIGHT_GENERATED',
      entityType: 'AIInsight',
      entityId: aiInsight._id,
      description: `Generated AI HR Retention strategy for ${employee.name} (${aiResult.priority} Priority)`
    });

    res.status(200).json({
      success: true,
      data: aiInsight
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all insights for an employee
// @route   GET /api/employees/:id/ai-insights
// @access  Private
exports.getEmployeeInsights = async (req, res, next) => {
  try {
    const insights = await AIInsight.find({ employeeId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: insights.length,
      data: insights
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all company AI insights with filters & pagination
// @route   GET /api/ai-insights
// @access  Private
exports.getAllInsights = async (req, res, next) => {
  try {
    const { priority, page = 1, limit = 10 } = req.query;
    const query = {};

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await AIInsight.countDocuments(query);
    const insights = await AIInsight.find(query)
      .populate('employeeId', 'employeeId name Department JobRole avatar currentPrediction')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: insights.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: insights
    });
  } catch (error) {
    next(error);
  }
};
