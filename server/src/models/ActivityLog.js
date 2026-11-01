const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: {
      type: String,
      default: 'System'
    },
    action: {
      type: String,
      required: true // e.g. 'EMPLOYEE_CREATED', 'PREDICTION_RUN', 'AI_INSIGHT_GENERATED', 'EMPLOYEE_DELETED'
    },
    entityType: {
      type: String,
      enum: ['Employee', 'Prediction', 'AIInsight', 'User', 'System'],
      default: 'Employee'
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId
    },
    description: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
