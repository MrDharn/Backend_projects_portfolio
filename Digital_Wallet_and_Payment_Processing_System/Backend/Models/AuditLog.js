const mongoose = require('mongoose')

const AuditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    action: {
        type: String
    }, 
    ip_address: {
        type: String
    },
    deviceInfo: {
        type: String
    }
}, {timestamps: true})
module.exports = mongoose.model('auditLog', AuditLogSchema)