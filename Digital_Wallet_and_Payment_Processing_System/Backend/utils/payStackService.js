const axios  = require('axios')
const PAYSTACK_KEY = process.env.PAYSTACK_KEY
const initiateTransaction = async(email, amount, reference)=>{
    try{
        const response = await axios("https://api.paystack.co/transaction/initialize", {
            email,
            amount: amount * 100,
            reference,
            callback_url
        }, {
            headers:{
                Authorization: `Bearers ${PAYSTACK_KEY}`,
                "ContentType": 'application/json'
            }
        })

        return response.data
    }
    catch(e){
        throw new Error(e)
    }
}

module.exports = initiateTransaction