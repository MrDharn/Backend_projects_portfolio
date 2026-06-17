const mongoose = require('mongoose');
const stockMovementModel = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    } ,

    movementType: String, // IN or OUT
    quantity: Number,
    performedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    } 
},{timestamps: true})

module.exports = mongoose.model('stockMovement', stockMovementModel)