const mongoose = require('mongoose')
const TransactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Types.ObjectId,
        ref: 'wallet'
    },
    type_of_transaction: {
        enum: ['deposit','withdrawal','transfer','merchant_payment']
    },
    status: {
        enum: ['pending','success','failed']
    },
    referenceId,
    description: {
        type: String
    }
},{timestamps: true})

module.exports = mongoos.model('transaction', TransactionSchema)