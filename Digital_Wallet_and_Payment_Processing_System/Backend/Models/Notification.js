const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    type_of_transaction: {
        enum: ['DEPOSIT', 'WITHDRAWAL','PASSWORD_RESET']
    },
    status: {
        enum: ['READ','UNREAD']
    }
},{timestamps:true})

module.exports = mongoose.model('notifications', NotificationSchema)
