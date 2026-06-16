const mongoose = require('mongoose')
const salesModel = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    quantitySold: {
        type: Number,
    },
    unitPrice: {
        type: Number
    },
    totalAmount:{
        type: Number
    },
    profit:{
        type: Number
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    customerName: {
        type: String
    }

}, {timestamps: true});

module.exports = mongoose.model('sales', salesModel);