const mongoose = require('mongoose')
const productModel = new mongoose.Schema({
    productName:{
        type: String
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
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
        ref: 'supplier'
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users'
    }
})

module.exports = mongoose.model('products', productModel);
