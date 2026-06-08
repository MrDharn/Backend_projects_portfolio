const mongoose = require('mongoose')
const salesModel = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productModel',
        required: true
    },
    quantitySold: {
        type: Number,
    },
    unitPrice,
    totalAmount:{
        type: Number
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    customerName: {
        type: String
    },
    saleDate: {
        type: Date
    }

}, {timestamps: true});

module.exports = mongoose.model('sales', salesModel);