const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modelVersion: {
      type: String,
      default: 'Logistic Regression v1.0'
    },
    prediction: {
      type: String,
      enum: ['Yes', 'No'],
      required: true
    },
    probabilityLeaving: {
      type: Number,
      required: true
    },
    probabilityStaying: {
      type: Number,
      required: true
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true
    },
    recommendation: {
      type: String
    },
    topRiskDrivers: [
      {
        feature: String,
        contribution: Number,
        weight: Number,
        scaled_value: Number
      }
    ],
    topProtectiveFactors: [
      {
        feature: String,
        contribution: Number,
        weight: Number,
        scaled_value: Number
      }
    ],
    inputSnapshot: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Prediction', predictionSchema);
