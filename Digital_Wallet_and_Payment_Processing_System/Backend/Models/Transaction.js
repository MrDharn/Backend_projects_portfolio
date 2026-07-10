const mongoose = require('mongoose')
const TransactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Types.ObjectId,
        ref: 'wallet'
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    type_of_transaction: {
        type: String,
        enum: ['DEPOSIT','WITHDRAWAL','MERCHANT_PAYMENT','DEBIT', 'CREDIT'],
        default: ""
    },
    status: {
        type: String,
        enum: ['PENDING','SUCCESS','FAILED'],
        default: "PENDING"
    },
    referenceId:{
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model('transaction', TransactionSchema)