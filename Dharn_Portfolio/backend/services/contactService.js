const contactModel = require('../models/contactModel')

const saveContact = async(data)=>{
    return await contactModel.create(data);
}

const getMessages = async()=>{
    return await contactModel.find().sort({createdAt: -1})
}

module.exports = {saveContact, getMessages}