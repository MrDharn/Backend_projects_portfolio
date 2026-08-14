const {saveContact,getMessages, getUnreadMessages, countUnreadMessages, markAsRead} = require('../services/contactService')
const { sendPortfolioNotification, sendConfirmationEmail } = require("../services/emailService")

const createContact = async(req, res)=>{
    try{
        const message = await saveContact(req.body);

        // await sendPortfolioNotification(req.body)
        // await sendConfirmationEmail(req.body)

        // INCASE THE SERVICES IS NOT FUNCTIONINIG

        Promise.allSettled([sendPortfolioNotification(req.body),
            sendConfirmationEmail(req.body)
        ]).catch((err)=> console.error("Email Delivery backgorund Error:", err))
        res.status(200).json({
            status: "success",
            message: "Message sent successfully",
            data: message
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message:  e.message || "Server Error"
        })
    }
}


//Only for Admin

const getAllContacts = async(req, res)=> {
    try{
        const {unreadOnly} = req.query;
        const messages = unreadOnly === "true" ? await getUnreadMessages() : await getMessages()
        
        return res.status(200).json({
            status: "success",
            count: messages.length,
            data: messages
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message || "Server Error"
        })
    }
}

const markContactAsRead = async(req, res)=> {
    try{

        const updatedMessage = await markAsRead(req.params.id);
        if(!updatedMessage){
            return res.status(404).json({
                status: "failed",
                message: "Message not Found"
            })
        }
        return res.status(200).json({
            status: "Failed",
            message: "Message mark as read",
            data: updatedMessage
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message |  "Server Error"
        })
    }

}
module.exports = {createContact, getAllContacts, markContactAsRead}