const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediction'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    summary: {
      type: String,
      required: true
    },
    keyRiskFactors: {
      type: String
    },
    recommendedActions: {
      type: String
    },
    retentionStrategy: {
      type: String
    },
    rawResponse: {
      type: String
    },
    model: {
      type: String,
      default: 'openai/gpt-oss-20b'
    },
    disclaimer: {
      type: String,
      default: 'AI-generated insights are decision-support tools and should be reviewed by qualified HR professionals. They should not be used as the sole basis for employment decisions.'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AIInsight', aiInsightSchema);
