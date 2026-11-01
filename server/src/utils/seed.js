const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const User = require('../models/User');
const Employee = require('../models/Employee');
const Prediction = require('../models/Prediction');
const AIInsight = require('../models/AIInsight');
const ActivityLog = require('../models/ActivityLog');
const mlService = require('../services/mlService');
const groqService = require('../services/groqService');

const sampleNames = [
  { name: 'Sarah Jenkins', gender: 'Female', email: 'sarah.jenkins@empyrict.ai' },
  { name: 'Marcus Chen', gender: 'Male', email: 'marcus.chen@empyrict.ai' },
  { name: 'Elena Rostova', gender: 'Female', email: 'elena.rostova@empyrict.ai' },
  { name: 'David Kim', gender: 'Male', email: 'david.kim@empyrict.ai' },
  { name: 'Amara Okafor', gender: 'Female', email: 'amara.okafor@empyrict.ai' },
  { name: 'James Wilson', gender: 'Male', email: 'james.wilson@empyrict.ai' },
  { name: 'Priya Sharma', gender: 'Female', email: 'priya.sharma@empyrict.ai' },
  { name: 'Carlos Mendez', gender: 'Male', email: 'carlos.mendez@empyrict.ai' },
  { name: 'Rachel Green', gender: 'Female', email: 'rachel.green@empyrict.ai' },
  { name: 'Alexander Vance', gender: 'Male', email: 'alexander.vance@empyrict.ai' },
  { name: 'Fatima Al-Mansoor', gender: 'Female', email: 'fatima.almansoor@empyrict.ai' },
  { name: 'Liam O’Connor', gender: 'Male', email: 'liam.oconnor@empyrict.ai' },
  { name: 'Zoe Martinez', gender: 'Female', email: 'zoe.martinez@empyrict.ai' },
  { name: 'Lucas Dubois', gender: 'Male', email: 'lucas.dubois@empyrict.ai' },
  { name: 'Maya Patel', gender: 'Female', email: 'maya.patel@empyrict.ai' }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/empyrict_ai';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Prediction.deleteMany({});
    await AIInsight.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('[Seed] Creating demo admin and HR users...');
    const adminUser = await User.create({
      name: 'Dr. Evelyn Vance',
      email: 'admin@empyrict.ai',
      passwordHash: 'Admin@123',
      organization: 'Empyrict Global Tech',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    });

    const hrUser = await User.create({
      name: 'Jordan Miller',
      email: 'hr@empyrict.ai',
      passwordHash: 'Admin@123',
      organization: 'Empyrict Global Tech',
      role: 'hr',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    console.log('[Seed] Reading raw IBM HR dataset for realistic employee records...');
    const datasetPath = path.join(__dirname, '../../../dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv');
    const rawCsv = fs.readFileSync(datasetPath, 'utf8');
    const lines = rawCsv.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());

    const employeesToInsert = [];

    for (let i = 1; i <= sampleNames.length && i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const row = {};
      headers.forEach((h, idx) => {
        const val = values[idx];
        row[h] = isNaN(val) ? val : Number(val);
      });

      const profile = sampleNames[i - 1];

      const empData = {
        employeeId: `EMP-${i.toString().padStart(4, '0')}`,
        name: profile.name,
        email: profile.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`,
        organization: 'Empyrict Global Tech',
        createdBy: adminUser._id,

        Age: row.Age || 30,
        BusinessTravel: row.BusinessTravel || 'Travel_Rarely',
        DailyRate: row.DailyRate || 800,
        Department: row.Department || 'Research & Development',
        DistanceFromHome: row.DistanceFromHome || 5,
        Education: row.Education || 3,
        EducationField: row.EducationField || 'Life Sciences',
        EnvironmentSatisfaction: row.EnvironmentSatisfaction || 3,
        Gender: profile.gender,
        HourlyRate: row.HourlyRate || 65,
        JobInvolvement: row.JobInvolvement || 3,
        JobLevel: row.JobLevel || 2,
        JobRole: row.JobRole || 'Research Scientist',
        JobSatisfaction: row.JobSatisfaction || 3,
        MaritalStatus: row.MaritalStatus || 'Married',
        MonthlyIncome: row.MonthlyIncome || 5000,
        MonthlyRate: row.MonthlyRate || 14000,
        NumCompaniesWorked: row.NumCompaniesWorked || 2,
        OverTime: row.OverTime || 'No',
        PercentSalaryHike: row.PercentSalaryHike || 14,
        PerformanceRating: row.PerformanceRating || 3,
        RelationshipSatisfaction: row.RelationshipSatisfaction || 3,
        StockOptionLevel: row.StockOptionLevel || 1,
        TotalWorkingYears: row.TotalWorkingYears || 10,
        TrainingTimesLastYear: row.TrainingTimesLastYear || 3,
        WorkLifeBalance: row.WorkLifeBalance || 3,
        YearsAtCompany: row.YearsAtCompany || 5,
        YearsInCurrentRole: row.YearsInCurrentRole || 3,
        YearsSinceLastPromotion: row.YearsSinceLastPromotion || 1,
        YearsWithCurrManager: row.YearsWithCurrManager || 3
      };

      employeesToInsert.push(empData);
    }

    console.log(`[Seed] Inserting and running real ML predictions for ${employeesToInsert.length} employees...`);

    for (const empData of employeesToInsert) {
      const emp = await Employee.create(empData);

      // Run ML Prediction
      const mlPayload = emp.toMLPayload();
      const mlResult = await mlService.predictSingle(mlPayload);

      const prediction = await Prediction.create({
        employeeId: emp._id,
        userId: adminUser._id,
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

      emp.currentPrediction = {
        prediction: mlResult.Prediction,
        probabilityLeaving: mlResult.Probability_Leaving,
        probabilityStaying: mlResult.Probability_Staying,
        riskLevel: mlResult.Risk_Level,
        recommendation: mlResult.Recommendation,
        topRiskDrivers: mlResult.Top_Risk_Drivers || [],
        topProtectiveFactors: mlResult.Top_Protective_Factors || [],
        predictedAt: new Date()
      };

      await emp.save();
      console.log(`  ✓ ${emp.name} (${emp.employeeId}): ${mlResult.Risk_Level} Risk (${mlResult.Probability_Leaving}% Attrition)`);
    }

    // Generate 3 sample AI Insights
    console.log('[Seed] Generating initial AI insights for high-risk profiles...');
    const atRiskEmployees = await Employee.find({ 'currentPrediction.riskLevel': { $in: ['High', 'Medium'] } }).limit(3);

    for (const emp of atRiskEmployees) {
      try {
        const pred = await Prediction.findOne({ employeeId: emp._id }).sort({ createdAt: -1 });
        const aiResult = await groqService.generateAnalysis(emp.toMLPayload(), {
          prediction: pred.prediction,
          probabilityLeaving: pred.probabilityLeaving,
          probabilityStaying: pred.probabilityStaying,
          riskLevel: pred.riskLevel,
          recommendation: pred.recommendation,
          topRiskDrivers: pred.topRiskDrivers || [],
          topProtectiveFactors: pred.topProtectiveFactors || []
        });

        const aiInsight = await AIInsight.create({
          employeeId: emp._id,
          predictionId: pred._id,
          userId: adminUser._id,
          priority: aiResult.priority,
          summary: aiResult.summary,
          keyRiskFactors: aiResult.keyRiskFactors,
          recommendedActions: aiResult.recommendedActions,
          retentionStrategy: aiResult.retentionStrategy,
          rawResponse: aiResult.rawResponse,
          model: aiResult.model,
          disclaimer: aiResult.disclaimer
        });

        emp.currentAiInsight = {
          priority: aiInsight.priority,
          summary: aiInsight.summary,
          generatedAt: new Date()
        };
        await emp.save();
        console.log(`  ✓ AI Retention Plan created for ${emp.name}`);
      } catch (err) {
        console.warn(`  ⚠️ Could not generate Groq AI for ${emp.name}: ${err.message}`);
      }
    }

    // Seed Activity Logs
    console.log('[Seed] Creating initial audit trail logs...');
    await ActivityLog.create([
      {
        userId: adminUser._id,
        userName: adminUser.name,
        action: 'SYSTEM_INITIALIZED',
        entityType: 'System',
        description: 'Empyrict-AI Enterprise system initialized with 15 employee records and calibrated ML pipeline.'
      },
      {
        userId: adminUser._id,
        userName: adminUser.name,
        action: 'BATCH_PREDICTIONS_RUN',
        entityType: 'Prediction',
        description: 'Initial company-wide attrition risk baseline computed for all 15 active employees.'
      },
      {
        userId: hrUser._id,
        userName: hrUser.name,
        action: 'HR_REVIEW_STARTED',
        entityType: 'AIInsight',
        description: 'HR team commenced review of high-priority retention action items.'
      }
    ]);

    console.log('\n========================================================');
    console.log('✅ EMPYRICT-AI DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('========================================================');
    console.log('Demo Credentials:');
    console.log('  Admin User : admin@empyrict.ai / Admin@123');
    console.log('  HR User    : hr@empyrict.ai    / Admin@123');
    console.log('========================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
