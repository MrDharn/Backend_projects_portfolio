const mongoose = require('mongoose')

const MerchantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    businessName: {
        type: String
    }, 
    businessEmail: {
        type: String
    },
    wallerId: {
        type: mongoose.Types.ObjectId,
        ref: 'wallet'
    },
    status: {
        enum: ['ACTIVE', 'SUSPENDED']
    }
}, {timestamps: true})

module.exports = mongoose.model('merchant', MerchantSchema);
