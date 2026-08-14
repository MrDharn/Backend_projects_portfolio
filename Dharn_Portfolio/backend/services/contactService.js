const contactModel = require('../models/contactModel')

const saveContact = async(data)=>{
    return await contactModel.create(data);
}

const getMessages = async()=>{
    return await contactModel.find().sort({createdAt: -1})
}

const getUnreadMessages = async ()=>{
    return await contactModel.find({isRead: false}).sort({createdAt: -1})
}

const countUnreadMessages = async()=>{
    return await contactModel.countDocuments({isRead: false});
}

const markAsRead = async(messageId)=> {
    return await contactModel.findByIdAndUpdate(messageId, {isRead: true}, {new: true})
}
module.exports = {saveContact, getMessages, getUnreadMessages, countUnreadMessages, markAsRead}