const mongoose = require('mongoose')
const categoryModel = new mongoose.Schema({
    categoryName:{
        type: String
    },
    description:{
        type: String
    }
})

module.exports = mongoose.model('category', categoryModel);