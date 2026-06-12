const mongoose = require('mongoose');
const stockMovementModel = new mongoose.Schema({
    product: mongoose.Schema.Types.ObjectId,
    movementType: String, // IN or OUT
    quantity: Number,
    performedBy: mongoose.Schema.Types.ObjectId,
    date: Date
})

module.exports = mongoose.model('stockMovement', stockMovementModel)