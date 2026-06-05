const mongoose = require('mongoose')
const productModel = new mongoose.Schema({
    productName:{
        type: String
    },
    category:{
        type:String
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
        type: String
    },
    createdBy:{
        type: String
    }
})

module.exports = mongoose.model('Products', productModel);
