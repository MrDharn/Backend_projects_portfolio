const initiateTransaction = require('../utils/payStackService')
const generateReference = require('../utils/generateReference')
const userModel = require('../Models/Users')
const transactionModel = require("../Models/Transaction")

const fundWallet = async(req, res)=>{
    try{
        const {amount} = req.body;
        if(!amount) return res.status(400).json({
            status:"Failed",
            message: "Bad input"
        })

        if(amount <=0)return res.status(400).json({
            status:"Failed",
            message: "You cannot transfer amount of 0"
        })

        const user = await userModel.findOne({email: req.user.email})
        if(!user)return res.status(404).json({
            status: "failed",
            message: "user does not exist"
        })

        const wallet = await walletModel.findOne({userId: user._id})
        if(!wallet)return res.status(404).json({
            status: "failed",
            message: "Invalid Account"
        })

        const referenceId =  generateReference()

        const transaction = await transactionModel.create({
            walletId: wallet._id,
            userId: user._id,
            type_of_transaction: "DEPOSIT",
            status: "PENDING",
            referenceId: referenceId,
            amount
        })

        const paystackService = await initiateTransaction(user.email, amount, referenceId)

    }catch(e){
        console.error(e)
        res.status(500).json({
            status: "failed",
            message: "Something went wrong"
        })
    }
}