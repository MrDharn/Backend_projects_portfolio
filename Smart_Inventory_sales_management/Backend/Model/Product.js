const mongoose = require('mongoose')
const productModel = new mongoose.Schema({
    productName:{
        type: String
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoryModel'
    },
    description:{
        type: String
    },
    quantity:{
        type: Number
    },
    costPrice:{
        type: Number
    },
    sellingPrice:{
        type: Number
    },
    supplier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplierModel'
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'userModel'
    }
})

module.exports = mongoose.model('Products', productModel);
