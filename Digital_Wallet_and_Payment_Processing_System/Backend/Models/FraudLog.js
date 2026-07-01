const mongoose = require('mongoose')

const FraudLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    transactionId: {
        type: mongoose.Types.ObjectId,
        ref: 'transaction'
    },
    reason: {
        type: String
    },
    status: {
        enum: ['INVESTIGATING', 'RESOLVED']
    }
}, {timestamps: true})

module.exports = mongoose.model('fraudLog', FraudLogSchema)
