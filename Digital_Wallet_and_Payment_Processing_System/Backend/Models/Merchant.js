const mongoose = require('mongoose')

const MerchantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    businessName,
    businessEmail,
    wallerId: {
        type: mongoose.Types.ObjectId,
        ref: 'wallet'
    },
    status: {
        enum: ['active', 'suspended']
    }
}, {timestamps: true})

module.exports = mongoose.model('merchant', MerchantSchema);
