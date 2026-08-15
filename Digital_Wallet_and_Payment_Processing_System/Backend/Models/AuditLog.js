const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', 
      index: true, 
    },
    action: {
      type: String,
      required: true, 
      trim: true,
    },
    ip_address: {
      type: String,
      default: 'unknown',
    },
    deviceInfo: {
      type: String,
      default: 'unknown',
    },
  },
  { 
    timestamps: true 
  }
);

AuditLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema); 