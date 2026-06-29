const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email:{ 
        type: String
    },
    phone:{
        type: Number
    },
    password:{
        type:String
    },
    role: {
        type: String,
        enum: ['admin','customer','merchant'],
        default: 'customer'
    },
    KYC_STATUS:{
        type: String,
        enum: ['pending','verified','rejected'],
        default: 'pending'
    },
    token: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('users', userSchema);
