const {initiateTransaction, verifyReference} = require('../utils/payStackService')
const generateReference = require('../utils/generateReference')
const userModel = require('../Models/Users')
const transactionModel = require("../Models/Transaction")
const walletModel = require('../Models/Wallet')


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

        const referenceId = generateReference()

        const transaction = new transactionModel({
            walletId: wallet._id,
            userId: user._id,
            type_of_transaction: "DEPOSIT",
            status: "PENDING",
            referenceId: referenceId,
            amount
        })
        await transaction.save()
        const paystackService = await initiateTransaction(user.email, amount, referenceId)


        res.status(200).json({
            status: verifyReference.data.status,
            message:"Transaction is initialized",
            transactionId: transaction._id,
            reference: paystackService.data.reference

        })

    }catch(e){
        console.error(e)
        res.status(500).json({
            status: "failed",
            message: "Something went wrong"
        })
    }
}

const verificationController = async(req, res)=> {
    try{
        const transactionModel = await transactionModel.findOne({userId: req.user._id})
        const walletModel = await walletModel.findOne({userId: req.user._id})

        if(!transaction || !walletModel) return res.status(404).json({
            status:"failed",
            message: "Cannot find wallet or transaction"
        });
        
        const initialWalletBalance = walletModel.balance

        const verification = await verifyReference(transactionModel.referenceId);

        if(verification.data.reference === 'pending'){
            transactionModel.status = "PENDING"
        }

        if(verification.data.reference === "success"){
            transactionModel.status = "SUCCESS"
            walletModel.balance = (Number(transactionModel.amount) + initialWalletBalance)

        }

        if(verifcation.data.reference === 'failed'){
            transactionModel.status = "FAILED"
        }
    }catch(e){
        console.error(e);
        res.status(500).json({
            status:"failed",
            message: "verification could not be completed"
        })
    }
}

module.exports = {fundWallet}