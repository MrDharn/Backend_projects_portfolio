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
        enum: ['DEPOSIT','WITHRAWAL','MERCHANT_PAYMENT']
    },
    status: {
        enum: ['PENDING','SUCCESS','FAILED']
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

module.exports = mongoos.model('transaction', TransactionSchema)