const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    type_of_transaction: {
        enum: ['deposit','transfer', 'withdrawal','password_reset']
    },
    status: {
        enum: ['read','unread']
    }
},{timestamps:true})

module.exports = mongoose.model('notifications', NotificationSchema)
