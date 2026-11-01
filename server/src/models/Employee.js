const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    avatar: {
      type: String,
      default: ''
    },
    organization: {
      type: String,
      default: 'Empyrict Enterprise'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // ==========================================
    // 30 ML MODEL FEATURES (IBM HR DATASET CONTRACT)
    // ==========================================
    
    // Categorical (7 features)
    BusinessTravel: {
      type: String,
      enum: ['Travel_Rarely', 'Travel_Frequently', 'Non-Travel'],
      default: 'Travel_Rarely'
    },
    Department: {
      type: String,
      enum: ['Sales', 'Research & Development', 'Human Resources'],
      default: 'Research & Development'
    },
    EducationField: {
      type: String,
      enum: ['Life Sciences', 'Medical', 'Marketing', 'Technical Degree', 'Human Resources', 'Other'],
      default: 'Life Sciences'
    },
    Gender: {
      type: String,
      enum: ['Female', 'Male'],
      default: 'Male'
    },
    JobRole: {
      type: String,
      enum: [
        'Sales Executive',
        'Research Scientist',
        'Laboratory Technician',
        'Manufacturing Director',
        'Healthcare Representative',
        'Manager',
        'Sales Representative',
        'Research Director',
        'Human Resources'
      ],
      default: 'Research Scientist'
    },
    MaritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced'],
      default: 'Married'
    },
    OverTime: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No'
    },

    // Numerical (23 features)
    Age: { type: Number, required: true, min: 18, max: 65, default: 35 },
    DailyRate: { type: Number, default: 800 },
    DistanceFromHome: { type: Number, min: 1, max: 50, default: 5 },
    Education: { type: Number, min: 1, max: 5, default: 3 }, // 1: Below College, 2: College, 3: Bachelor, 4: Master, 5: Doctor
    EnvironmentSatisfaction: { type: Number, min: 1, max: 4, default: 3 }, // 1: Low, 2: Medium, 3: High, 4: Very High
    HourlyRate: { type: Number, default: 65 },
    JobInvolvement: { type: Number, min: 1, max: 4, default: 3 },
    JobLevel: { type: Number, min: 1, max: 5, default: 2 },
    JobSatisfaction: { type: Number, min: 1, max: 4, default: 3 },
    MonthlyIncome: { type: Number, required: true, default: 5000 },
    MonthlyRate: { type: Number, default: 14000 },
    NumCompaniesWorked: { type: Number, min: 0, max: 15, default: 2 },
    PercentSalaryHike: { type: Number, min: 0, max: 50, default: 14 },
    PerformanceRating: { type: Number, min: 1, max: 4, default: 3 },
    RelationshipSatisfaction: { type: Number, min: 1, max: 4, default: 3 },
    StockOptionLevel: { type: Number, min: 0, max: 3, default: 1 },
    TotalWorkingYears: { type: Number, min: 0, max: 50, default: 10 },
    TrainingTimesLastYear: { type: Number, min: 0, max: 10, default: 3 },
    WorkLifeBalance: { type: Number, min: 1, max: 4, default: 3 },
    YearsAtCompany: { type: Number, min: 0, max: 45, default: 5 },
    YearsInCurrentRole: { type: Number, min: 0, max: 30, default: 3 },
    YearsSinceLastPromotion: { type: Number, min: 0, max: 20, default: 1 },
    YearsWithCurrManager: { type: Number, min: 0, max: 25, default: 3 },

    // Active Prediction & Risk State
    currentPrediction: {
      prediction: { type: String, enum: ['Yes', 'No', 'Pending'], default: 'Pending' },
      probabilityLeaving: { type: Number, default: 0 },
      probabilityStaying: { type: Number, default: 100 },
      riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Unknown'], default: 'Unknown' },
      recommendation: { type: String, default: 'Not analyzed yet.' },
      topRiskDrivers: [String],
      topProtectiveFactors: [String],
      predictedAt: { type: Date }
    },

    currentAiInsight: {
      priority: { type: String, enum: ['Low', 'Medium', 'High', 'Unknown'], default: 'Unknown' },
      summary: { type: String, default: '' },
      generatedAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

// Method to format employee record into exact ML input dictionary
employeeSchema.methods.toMLPayload = function () {
  return {
    Age: this.Age,
    BusinessTravel: this.BusinessTravel,
    DailyRate: this.DailyRate,
    Department: this.Department,
    DistanceFromHome: this.DistanceFromHome,
    Education: this.Education,
    EducationField: this.EducationField,
    EnvironmentSatisfaction: this.EnvironmentSatisfaction,
    Gender: this.Gender,
    HourlyRate: this.HourlyRate,
    JobInvolvement: this.JobInvolvement,
    JobLevel: this.JobLevel,
    JobRole: this.JobRole,
    JobSatisfaction: this.JobSatisfaction,
    MaritalStatus: this.MaritalStatus,
    MonthlyIncome: this.MonthlyIncome,
    MonthlyRate: this.MonthlyRate,
    NumCompaniesWorked: this.NumCompaniesWorked,
    OverTime: this.OverTime,
    PercentSalaryHike: this.PercentSalaryHike,
    PerformanceRating: this.PerformanceRating,
    RelationshipSatisfaction: this.RelationshipSatisfaction,
    StockOptionLevel: this.StockOptionLevel,
    TotalWorkingYears: this.TotalWorkingYears,
    TrainingTimesLastYear: this.TrainingTimesLastYear,
    WorkLifeBalance: this.WorkLifeBalance,
    YearsAtCompany: this.YearsAtCompany,
    YearsInCurrentRole: this.YearsInCurrentRole,
    YearsSinceLastPromotion: this.YearsSinceLastPromotion,
    YearsWithCurrManager: this.YearsWithCurrManager
  };
};

module.exports = mongoose.model('Employee', employeeSchema);
