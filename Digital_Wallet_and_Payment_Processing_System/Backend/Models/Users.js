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
        type:String,
        select: false
    },
    role: {
        type: String,
        enum: ['ADMIN','CUSTOMER','MERCHANT'],
        default: 'CUSTOMER'
    },
    KYC_STATUS:{
        type: String,
        enum: ['PENDING','VERIFIED','REJECTED'],
        default: 'PENDING'
    },
    token: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('users', userSchema);
