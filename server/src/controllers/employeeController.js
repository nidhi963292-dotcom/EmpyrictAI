const Employee = require('../models/Employee');
const Prediction = require('../models/Prediction');
const AIInsight = require('../models/AIInsight');
const ActivityLog = require('../models/ActivityLog');
const mlService = require('../services/mlService');
const groqService = require('../services/groqService');

// @desc    Get all employees with search, filter, sort & pagination
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    const {
      search,
      department,
      riskLevel,
      jobRole,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Search by name, employeeId, or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by department
    if (department && department !== 'All') {
      query.Department = department;
    }

    // Filter by risk level
    if (riskLevel && riskLevel !== 'All') {
      query['currentPrediction.riskLevel'] = riskLevel;
    }

    // Filter by job role
    if (jobRole && jobRole !== 'All') {
      query.JobRole = jobRole;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Fetch predictions and AI insights history
    const predictions = await Prediction.find({ employeeId: employee._id }).sort({ createdAt: -1 });
    const aiInsights = await AIInsight.find({ employeeId: employee._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        employee,
        predictions,
        aiInsights
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
exports.createEmployee = async (req, res, next) => {
  try {
    const employeeData = { ...req.body, createdBy: req.user.id };

    // Auto-generate employeeId if not provided
    if (!employeeData.employeeId) {
      const count = await Employee.countDocuments();
      employeeData.employeeId = `EMP-${(count + 1).toString().padStart(4, '0')}`;
    }

    // Auto-generate email if missing
    if (!employeeData.email && employeeData.name) {
      const cleanName = employeeData.name.toLowerCase().replace(/\s+/g, '.');
      employeeData.email = `${cleanName}@empyrict.ai`;
    }

    const employee = await Employee.create(employeeData);

    await ActivityLog.create({
      userId: req.user.id,
      userName: req.user.name,
      action: 'EMPLOYEE_CREATED',
      entityType: 'Employee',
      entityId: employee._id,
      description: `Added employee ${employee.name} (${employee.employeeId})`
    });

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await ActivityLog.create({
      userId: req.user.id,
      userName: req.user.name,
      action: 'EMPLOYEE_UPDATED',
      entityType: 'Employee',
      entityId: employee._id,
      description: `Updated details for ${employee.name} (${employee.employeeId})`
    });

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    await Employee.findByIdAndDelete(req.params.id);
    await Prediction.deleteMany({ employeeId: req.params.id });
    await AIInsight.deleteMany({ employeeId: req.params.id });

    await ActivityLog.create({
      userId: req.user.id,
      userName: req.user.name,
      action: 'EMPLOYEE_DELETED',
      entityType: 'Employee',
      entityId: employee._id,
      description: `Deleted employee ${employee.name} (${employee.employeeId})`
    });

    res.status(200).json({
      success: true,
      message: `Employee ${employee.name} deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Update employee & immediately run full ML Prediction + Groq AI Analysis
// @route   POST /api/employees/analyze
// @access  Private
exports.analyzeEmployeeForm = async (req, res, next) => {
  try {
    const payload = req.body;
    let employee;

    // Check if updating existing or creating new
    if (payload._id) {
      employee = await Employee.findByIdAndUpdate(payload._id, payload, { new: true, runValidators: true });
    } else if (payload.employeeId) {
      const existing = await Employee.findOne({ employeeId: payload.employeeId });
      if (existing) {
        employee = await Employee.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true });
      }
    }

    if (!employee) {
      if (!payload.employeeId) {
        const count = await Employee.countDocuments();
        payload.employeeId = `EMP-${(count + 1).toString().padStart(4, '0')}`;
      }
      if (!payload.email && payload.name) {
        const cleanName = payload.name.toLowerCase().replace(/\s+/g, '.');
        payload.email = `${cleanName}@empyrict.ai`;
      }
      payload.createdBy = req.user.id;
      employee = await Employee.create(payload);
    }

    // Step 1: Run ML Prediction
    const mlPayload = employee.toMLPayload();
    const mlResult = await mlService.predictSingle(mlPayload);

    // Step 2: Save Prediction Record
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

    // Step 3: Run Groq AI Analysis
    let aiInsightRecord = null;
    try {
      const aiResult = await groqService.generateAnalysis(mlPayload, {
        prediction: mlResult.Prediction,
        probabilityLeaving: mlResult.Probability_Leaving,
        probabilityStaying: mlResult.Probability_Staying,
        riskLevel: mlResult.Risk_Level,
        recommendation: mlResult.Recommendation,
        topRiskDrivers: mlResult.Top_Risk_Drivers || [],
        topProtectiveFactors: mlResult.Top_Protective_Factors || []
      });

      aiInsightRecord = await AIInsight.create({
        employeeId: employee._id,
        predictionId: predictionRecord._id,
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
    } catch (aiErr) {
      console.warn('[AI Analysis Failed in Analyze Flow]', aiErr.message);
    }

    // Update Employee active state
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

    if (aiInsightRecord) {
      employee.currentAiInsight = {
        priority: aiInsightRecord.priority,
        summary: aiInsightRecord.summary,
        generatedAt: new Date()
      };
    }

    await employee.save();

    await ActivityLog.create({
      userId: req.user.id,
      userName: req.user.name,
      action: 'FULL_ANALYSIS_COMPLETED',
      entityType: 'Employee',
      entityId: employee._id,
      description: `Completed AI analysis for ${employee.name} (${mlResult.Risk_Level} Risk - ${mlResult.Probability_Leaving}% Attrition)`
    });

    res.status(200).json({
      success: true,
      data: {
        employee,
        prediction: predictionRecord,
        aiInsight: aiInsightRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all employees and prediction records for a clean slate
// @route   POST /api/employees/clear-all
// @access  Private
exports.clearAllEmployees = async (req, res, next) => {
  try {
    const deletedCount = await Employee.countDocuments();
    await Employee.deleteMany({});
    await Prediction.deleteMany({});
    await AIInsight.deleteMany({});

    await ActivityLog.create({
      userId: req.user.id,
      userName: req.user.name,
      action: 'WORKFORCE_CLEARED',
      entityType: 'Employee',
      description: `Cleared entire workforce directory (${deletedCount} records removed)`
    });

    res.status(200).json({
      success: true,
      message: `Successfully cleared ${deletedCount} employee records. Your directory is now a clean slate.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload & parse CSV dataset (IBM HR format) with batch ML predictions
// @route   POST /api/employees/upload-csv
// @access  Private
exports.uploadCSV = async (req, res, next) => {
  try {
    let rows = [];

    // Parse CSV from uploaded file buffer OR from text in request body
    let csvText = '';
    if (req.file && req.file.buffer) {
      csvText = req.file.buffer.toString('utf-8');
    } else if (req.body.csvData) {
      csvText = req.body.csvData;
    } else {
      return res.status(400).json({
        success: false,
        message: 'No CSV file or data provided. Please upload a .csv file.'
      });
    }

    // Split lines and parse headers
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is empty or does not contain data rows.'
      });
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];
      if (!currentLine.trim()) continue;

      // Handle quoted commas properly
      const values = [];
      let inQuote = false;
      let buffer = '';

      for (let char of currentLine) {
        if (char === '"' || char === "'") {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          values.push(buffer.trim().replace(/^["']|["']$/g, ''));
          buffer = '';
        } else {
          buffer += char;
        }
      }
      values.push(buffer.trim().replace(/^["']|["']$/g, ''));

      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] !== undefined ? values[idx] : '';
      });

      rows.push(rowObj);
    }

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid rows could be parsed from the CSV.'
      });
    }

    // Check if user requested replace existing
    const replaceExisting = req.body.replaceExisting === 'true' || req.body.replaceExisting === true;
    if (replaceExisting) {
      await Employee.deleteMany({});
      await Prediction.deleteMany({});
      await AIInsight.deleteMany({});
    }

    const importedEmployees = [];
    let existingCount = await Employee.countDocuments();

    // Map each CSV row to 30 IBM HR model features and run ML prediction
    for (let idx = 0; idx < rows.length; idx++) {
      const r = rows[idx];

      const empNum = r.EmployeeNumber || (existingCount + idx + 1);
      const empId = `EMP-${empNum.toString().padStart(4, '0')}`;
      const name = r.name || r.EmployeeName || `Employee ${empNum}`;
      const email = r.email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@empyrict.ai`;

      const empData = {
        name,
        employeeId: empId,
        email,
        Age: Number(r.Age) || 30,
        Gender: r.Gender || 'Male',
        MaritalStatus: r.MaritalStatus || 'Single',
        Department: r.Department || 'Research & Development',
        JobRole: r.JobRole || 'Research Scientist',
        JobLevel: Number(r.JobLevel) || 1,
        BusinessTravel: r.BusinessTravel || 'Travel_Rarely',
        OverTime: r.OverTime || 'No',
        NumCompaniesWorked: Number(r.NumCompaniesWorked) || 1,
        YearsAtCompany: Number(r.YearsAtCompany) || 3,
        YearsInCurrentRole: Number(r.YearsInCurrentRole) || 2,
        YearsSinceLastPromotion: Number(r.YearsSinceLastPromotion) || 1,
        YearsWithCurrManager: Number(r.YearsWithCurrManager) || 2,
        TotalWorkingYears: Number(r.TotalWorkingYears) || 6,
        TrainingTimesLastYear: Number(r.TrainingTimesLastYear) || 2,
        MonthlyIncome: Number(r.MonthlyIncome) || 4500,
        MonthlyRate: Number(r.MonthlyRate) || 14000,
        DailyRate: Number(r.DailyRate) || 800,
        HourlyRate: Number(r.HourlyRate) || 65,
        PercentSalaryHike: Number(r.PercentSalaryHike) || 12,
        StockOptionLevel: Number(r.StockOptionLevel) || 0,
        JobSatisfaction: Number(r.JobSatisfaction) || 3,
        EnvironmentSatisfaction: Number(r.EnvironmentSatisfaction) || 3,
        WorkLifeBalance: Number(r.WorkLifeBalance) || 3,
        JobInvolvement: Number(r.JobInvolvement) || 3,
        RelationshipSatisfaction: Number(r.RelationshipSatisfaction) || 3,
        PerformanceRating: Number(r.PerformanceRating) || 3,
        DistanceFromHome: Number(r.DistanceFromHome) || 5,
        Education: Number(r.Education) || 3,
        EducationField: r.EducationField || 'Life Sciences',
        createdBy: req.user.id
      };

      // Run ML Prediction for this row
      try {
        const mlPayload = { ...empData };
        const mlResult = await mlService.predictSingle(mlPayload);

        empData.currentPrediction = {
          prediction: mlResult.Prediction,
          probabilityLeaving: mlResult.Probability_Leaving,
          probabilityStaying: mlResult.Probability_Staying,
          riskLevel: mlResult.Risk_Level,
          recommendation: mlResult.Recommendation,
          topRiskDrivers: mlResult.Top_Risk_Drivers || [],
          topProtectiveFactors: mlResult.Top_Protective_Factors || [],
          predictedAt: new Date()
        };

        const createdEmployee = await Employee.create(empData);

        // Record prediction
        await Prediction.create({
          employeeId: createdEmployee._id,
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

        importedEmployees.push(createdEmployee);
      } catch (err) {
        // Fallback create without prediction if ML service is down
        const createdEmployee = await Employee.create(empData);
        importedEmployees.push(createdEmployee);
      }
    }

    await ActivityLog.create({
      userId: req.user.id,
      userName: req.user.name,
      action: 'CSV_DATASET_IMPORTED',
      entityType: 'Employee',
      description: `Imported and analyzed ${importedEmployees.length} employees from CSV dataset (${replaceExisting ? 'Replaced existing' : 'Appended'})`
    });

    res.status(200).json({
      success: true,
      message: `Successfully imported and analyzed ${importedEmployees.length} employees from CSV dataset!`,
      count: importedEmployees.length
    });
  } catch (error) {
    next(error);
  }
};
