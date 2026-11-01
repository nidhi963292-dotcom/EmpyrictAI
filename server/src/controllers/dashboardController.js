const Employee = require('../models/Employee');
const Prediction = require('../models/Prediction');
const AIInsight = require('../models/AIInsight');
const ActivityLog = require('../models/ActivityLog');
const mlService = require('../services/mlService');

// @desc    Get top-level dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const highRiskCount = await Employee.countDocuments({ 'currentPrediction.riskLevel': 'High' });
    const mediumRiskCount = await Employee.countDocuments({ 'currentPrediction.riskLevel': 'Medium' });
    const lowRiskCount = await Employee.countDocuments({ 'currentPrediction.riskLevel': 'Low' });
    const pendingCount = await Employee.countDocuments({ 'currentPrediction.riskLevel': { $in: ['Pending', 'Unknown'] } });
    
    const totalPredictions = await Prediction.countDocuments();
    const totalAiInsights = await AIInsight.countDocuments();

    // Calculate percentage at risk
    const atRiskTotal = highRiskCount + mediumRiskCount;
    const atRiskPercentage = totalEmployees > 0 ? ((atRiskTotal / totalEmployees) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        atRiskCount: atRiskTotal,
        atRiskPercentage: Number(atRiskPercentage),
        highRiskCount,
        mediumRiskCount,
        lowRiskCount,
        pendingCount,
        totalPredictions,
        totalAiInsights,
        modelAccuracy: 86.05,
        modelF1Score: 0.4384,
        activeModel: 'Logistic Regression (Optimal F1)'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to build breakdown for any field
const computeFieldBreakdown = async () => {
  const employees = await Employee.find();

  // If no employees, return empty mapping
  if (!employees || employees.length === 0) {
    return {};
  }

  const isAtRisk = (emp) => {
    const risk = emp.currentPrediction?.riskLevel;
    return risk === 'High' || risk === 'Medium';
  };

  const aggregateByKey = (extractKeyFn, sortOrder = null) => {
    const map = {};
    employees.forEach((emp) => {
      const key = extractKeyFn(emp);
      if (!key) return;
      if (!map[key]) {
        map[key] = { category: key, total: 0, atRisk: 0, safe: 0 };
      }
      map[key].total += 1;
      if (isAtRisk(emp)) {
        map[key].atRisk += 1;
      } else {
        map[key].safe += 1;
      }
    });

    let list = Object.values(map).map((item) => ({
      ...item,
      attritionRate: item.total > 0 ? Math.round((item.atRisk / item.total) * 100) : 0
    }));

    if (sortOrder && Array.isArray(sortOrder)) {
      list.sort((a, b) => {
        const idxA = sortOrder.indexOf(a.category);
        const idxB = sortOrder.indexOf(b.category);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.category.localeCompare(b.category);
      });
    }

    return list;
  };

  // 1. Age (Binned)
  const ageSort = ['< 25', '25–34', '35–44', '45–54', '55+'];
  const ageBreakdown = aggregateByKey((emp) => {
    const age = Number(emp.Age);
    if (!age) return 'Unknown';
    if (age < 25) return '< 25';
    if (age <= 34) return '25–34';
    if (age <= 44) return '35–44';
    if (age <= 54) return '45–54';
    return '55+';
  }, ageSort);

  // 2. Attrition
  const attritionBreakdown = [
    {
      category: 'Stable (Low Risk)',
      total: employees.filter((e) => !isAtRisk(e)).length,
      safe: employees.filter((e) => !isAtRisk(e)).length,
      atRisk: 0,
      attritionRate: 0
    },
    {
      category: 'At Risk (High/Medium)',
      total: employees.filter((e) => isAtRisk(e)).length,
      safe: 0,
      atRisk: employees.filter((e) => isAtRisk(e)).length,
      attritionRate: 100
    }
  ];

  // 3. Department
  const deptSort = ['Research & Development', 'Sales', 'Human Resources'];
  const departmentBreakdown = aggregateByKey((emp) => emp.Department || 'Other', deptSort);

  // 4. EducationField
  const eduSort = ['Life Sciences', 'Medical', 'Marketing', 'Technical Degree', 'Human Resources', 'Other'];
  const educationFieldBreakdown = aggregateByKey((emp) => emp.EducationField || 'Other', eduSort);

  // 5. EmployeeCount (Workforce Headcount Distribution by Department)
  const employeeCountBreakdown = aggregateByKey((emp) => emp.Department || 'Other', deptSort);

  // 6. EnvironmentSatisfaction
  const envLabels = { 1: '1 - Low', 2: '2 - Medium', 3: '3 - High', 4: '4 - Very High' };
  const envSort = ['1 - Low', '2 - Medium', '3 - High', '4 - Very High'];
  const environmentSatisfactionBreakdown = aggregateByKey(
    (emp) => envLabels[emp.EnvironmentSatisfaction] || `Level ${emp.EnvironmentSatisfaction}`,
    envSort
  );

  // 7. Gender
  const genderSort = ['Female', 'Male'];
  const genderBreakdown = aggregateByKey((emp) => emp.Gender || 'Other', genderSort);

  // 8. JobLevel
  const jobLevelSort = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
  const jobLevelBreakdown = aggregateByKey((emp) => `Level ${emp.JobLevel || 1}`, jobLevelSort);

  // 9. JobRole
  const roleSort = [
    'Sales Executive',
    'Research Scientist',
    'Laboratory Technician',
    'Manufacturing Director',
    'Healthcare Representative',
    'Manager',
    'Sales Representative',
    'Research Director',
    'Human Resources'
  ];
  const jobRoleBreakdown = aggregateByKey((emp) => emp.JobRole || 'Other', roleSort);

  // 10. JobSatisfaction
  const satLabels = { 1: '1 - Low', 2: '2 - Medium', 3: '3 - High', 4: '4 - Very High' };
  const satSort = ['1 - Low', '2 - Medium', '3 - High', '4 - Very High'];
  const jobSatisfactionBreakdown = aggregateByKey(
    (emp) => satLabels[emp.JobSatisfaction] || `Level ${emp.JobSatisfaction}`,
    satSort
  );

  // 11. MonthlyIncome (Binned)
  const incomeSort = ['< $3,000', '$3k–$6k', '$6k–$10k', '$10k–$15k', '$15,000+'];
  const monthlyIncomeBreakdown = aggregateByKey((emp) => {
    const income = Number(emp.MonthlyIncome);
    if (!income) return 'Unknown';
    if (income < 3000) return '< $3,000';
    if (income < 6000) return '$3k–$6k';
    if (income < 10000) return '$6k–$10k';
    if (income < 15000) return '$10k–$15k';
    return '$15,000+';
  }, incomeSort);

  return {
    Age: ageBreakdown,
    Attrition: attritionBreakdown,
    Department: departmentBreakdown,
    EducationField: educationFieldBreakdown,
    EmployeeCount: employeeCountBreakdown,
    EnvironmentSatisfaction: environmentSatisfactionBreakdown,
    Gender: genderBreakdown,
    JobLevel: jobLevelBreakdown,
    JobRole: jobRoleBreakdown,
    JobSatisfaction: jobSatisfactionBreakdown,
    MonthlyIncome: monthlyIncomeBreakdown
  };
};

// @desc    Get charts data for dashboard
// @route   GET /api/dashboard/charts
// @access  Private
exports.getCharts = async (req, res, next) => {
  try {
    // 1. Risk Distribution
    const highRisk = await Employee.countDocuments({ 'currentPrediction.riskLevel': 'High' });
    const mediumRisk = await Employee.countDocuments({ 'currentPrediction.riskLevel': 'Medium' });
    const lowRisk = await Employee.countDocuments({ 'currentPrediction.riskLevel': 'Low' });
    const pending = await Employee.countDocuments({ 'currentPrediction.riskLevel': { $in: ['Pending', 'Unknown'] } });

    const riskDistribution = [
      { name: 'High Risk', value: highRisk, color: '#e05353' },
      { name: 'Medium Risk', value: mediumRisk, color: '#d0946b' },
      { name: 'Low Risk', value: lowRisk, color: '#2a8693' },
      { name: 'Pending Review', value: pending, color: '#afa997' }
    ];

    // 2. Comprehensive Field-by-Field Breakdown
    const fieldBreakdowns = await computeFieldBreakdown();

    // 3. Department breakdown compatibility
    const departmentBreakdown = (fieldBreakdowns.Department || []).map((d) => ({
      ...d,
      department: d.category === 'Research & Development' ? 'R&D' : d.category
    }));

    // 4. Job Level compatibility
    const jobLevelRisk = (fieldBreakdowns.JobLevel || []).map((j) => ({
      level: j.category,
      total: j.total,
      highRisk: j.atRisk,
      lowRisk: j.safe,
      mediumRisk: 0
    }));

    // 5. Work-Life Balance Breakdown
    const wlbScores = [1, 2, 3, 4];
    const wlbLabels = { 1: 'Poor (1)', 2: 'Fair (2)', 3: 'Good (3)', 4: 'Best (4)' };
    const workLifeBalanceData = await Promise.all(
      wlbScores.map(async (score) => {
        const total = await Employee.countDocuments({ WorkLifeBalance: score });
        const atRisk = await Employee.countDocuments({
          WorkLifeBalance: score,
          'currentPrediction.riskLevel': { $in: ['High', 'Medium'] }
        });
        return {
          score: wlbLabels[score],
          total,
          atRisk,
          safe: total - atRisk
        };
      })
    );

    // 6. Recent Predictions
    const recentPredictions = await Prediction.find()
      .populate('employeeId', 'employeeId name Department JobRole avatar')
      .sort({ createdAt: -1 })
      .limit(6);

    // 7. Recent Activity Logs
    const recentActivity = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(8);

    // 8. Global Explainability Drivers
    const globalExplainability = await mlService.getGlobalExplainability();

    res.status(200).json({
      success: true,
      data: {
        riskDistribution,
        departmentBreakdown,
        jobLevelRisk,
        workLifeBalanceData,
        fieldBreakdowns,
        recentPredictions,
        recentActivity,
        globalDrivers: globalExplainability
      }
    });
  } catch (error) {
    next(error);
  }
};
