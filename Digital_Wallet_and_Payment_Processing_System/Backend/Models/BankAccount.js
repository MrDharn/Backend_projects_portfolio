const mongoose = require('mongoose')

const BankAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    bankName,
    accountNumber,
    verified: {
        type: Boolean,
        default: false
    },
},{timestamps: true})

module.exports = mongoose.model('bankAccount', BankAccountSchema)
