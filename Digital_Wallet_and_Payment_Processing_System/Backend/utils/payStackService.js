const axios  = require('axios')
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const initiateTransaction = async(email, amount, reference)=>{
    try{
        const response = await axios.post("https://api.paystack.co/transaction/initialize", {
            email,
            amount: amount * 100,
            reference,
            callback_url
        }, {
            headers:{
                Authorization: `Bearers ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": 'application/json'
            }
        })

        return response.data
    }
    catch(e){
        throw new Error(`This is error is coming from paystack , ${e}`)
    }
}

const verifyReference = async(reference)=> {
    try{
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,{
            headers: {
                Authorization: `Bearers ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": 'application/json'
            }
        })

        return response.data
    }catch(e){
        throw new Error(`This is error from my verification, ${e}`)
    }
}

module.exports = {initiateTransaction, verifyReference}