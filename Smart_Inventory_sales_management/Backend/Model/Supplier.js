const mongoose = require('mongoose')
const supplierModel = new mongoose.Schema({
    supplierName: {
        type: String
    },
    phoneNumber:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Supplier', supplierModel);