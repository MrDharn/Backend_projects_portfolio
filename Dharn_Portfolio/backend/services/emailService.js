const transporter =  require('./emailTransporter')
const contactNotification = require('../templates/contactConfirmation')
const confirmation = require('../templates/contactConfirmation')

const sendPortfolioNotification = async(data)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact - ${data.subject}`,
        html: contactNotification(data)
    });
}

const sendConfirmationEmail = async(data)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: "Thanks for reaching out",
        html: confirmation(data.name)
    })
}


module.exports = {sendPortfolioNotification, sendConfirmationEmail}
