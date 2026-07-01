const mongoose = require('mongoose')
const RefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    refreshToken: {
        type: String
    },
    revoked: {
        type: Boolean,
        default: false
    }

},{timestamps: true})

module.exports = mongoose.model('refreshToken', RefreshToken)
