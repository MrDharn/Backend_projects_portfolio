const asyncHandler = require("../utils/asyncHandler")
const {saveContact} = require('../services/contactService')
const {successResponse} = require('../utils/apiResponse')
const { sendPortfolioNotification, sendConfirmationEmail } = require("../services/emailService")

const createContact = async(req, res)=>{
    try{
        const message = await saveContact(req.body);
        await sendPortfolioNotification(req.body)
        await sendConfirmationEmail(req.body)

        res.status(200).json({
            status: "success",
            message: "Message sent successfully" 
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: "Server Error"
        })
    }
}
module.exports = createContact