const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = async(to, subject, text, html)=> {
    try{

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to, 
            subject,
            text,
            html
        })
    }catch(e){
        throw new Error("This is error from nodemailer:", e.message)
    }
}


module.exports = sendEmail