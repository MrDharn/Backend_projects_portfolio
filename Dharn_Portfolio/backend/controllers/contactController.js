const asyncHandler = require("../utils/asyncHandler")
const {saveContact} = require('../services/contactService')
const {successResponse} = require('../utils/apiResponse')
const createContact = asyncHandler(async(req, res)=>{
    const message = await saveContact(req.body)
    successResponse(res, message, "message sent successfully", 201)
})

module.exports = createContact