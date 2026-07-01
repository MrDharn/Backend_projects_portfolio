const mongoose = require('mongoose')
const TransactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Types.ObjectId,
        ref: 'wallet'
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
    idempotencyKey:{
        type: String,
    },

    description: {
        type: String
    }
},{timestamps: true})

module.exports = mongoos.model('transaction', TransactionSchema)