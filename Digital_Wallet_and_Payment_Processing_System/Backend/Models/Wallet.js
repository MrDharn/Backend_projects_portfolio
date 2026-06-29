const mongoose = require('mongoose')
const WalletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    walletNumber: {
        type: Number
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        enum: ['NGN', 'USD'],
        default: 'NGN'
    },
    pin_hash: {
        type: Number
    },

}, {timestamps: true})

module.exports = mongoose.model('wallet', WalletSchema)