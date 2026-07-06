const asyncHandler = require("../utils/asyncHandler")
const {saveContact} = require('../services/contactService')
const {successResponse} = require('../utils/apiResponse')
const { sendPortfolioNotification, sendConfirmationEmail } = require("../services/emailService")
const createContact = asyncHandler(async(req, res)=>{
    const message = await saveContact(req.body)
    await sendPortfolioNotification(req.body)
    await sendConfirmationEmail(req.body)
    successResponse(res, message, "message sent successfully", 201)
})

module.exports = createContact