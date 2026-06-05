const mongoose = require('mongoose')
const salesModel = new mongoose.Schema({
    product: {
        type: String,
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
        type: String
    },
    customerName: {
        type: String
    },
    saleDate: {
        type: Date
    }

}, {timestamps: true});

module.exports = mongoose.model('sales', salesModel);