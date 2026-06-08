const mongoose = require('mongoose')
const userModel = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['Admin', 'Manager','Staff'],
        default: 'Staff'
    }
}, {timestamps: true});

module.exports = mongoose.model('user', userModel);