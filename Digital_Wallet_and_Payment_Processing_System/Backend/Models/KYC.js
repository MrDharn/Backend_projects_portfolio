const mongoose = require('mongoose')

const KYC_Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    documentType: {
        enum: ["ID card", "passport","driver's license"]
    },
    documentUrl: {
        type: String
    },
    status: {
        enum: ['PENDING', 'APPROVED', 'REJECTED']
    }
},{timestamps: true})

module.exports = mongoose.model('kyc', KYC_Schema)