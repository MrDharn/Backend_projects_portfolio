const mongoose = require('mongoose')
const generateReference = require('../utils/generateReference')
const {getBankCode, verifyReference, initiateWithdrawal} = require('../utils/payStackService')

const walletModel = require('../Models/Wallet')
const transactionModel = require('../Models/Transaction')

const withdrawFunds = async(req, res)=>{

    const session = await mongoose.session()
    session.startTransaction();
    try{
        //user Wallet
        const {walletNumber, pin, bankAccount, bankName, amount} = req.body;
        
        if(!walletNumber || !pin || !bankAccount || !bankName || !amount){
            session.abortTransaction()
            return res.status(400).json({
                status: "failed",
                message: ""
            })
        }
        //Validate wallet Number
        const wallet = await walletModel.findOne({walletNumber: walletNumber}).select("+pin")
        //Request Withrawal

        //Validate Pin

        //validate Balance

        //validate bank Account

        //Create transfer recipient

        //initiate transfer

        //process tranfere(PAYSTACk)

        //verify Status

        //Debit wallet

        //make transaction status success
    }catch(e){
        console.error(e)
        res.status(500).json({
            status: 'failed',
            message: "Something went wrong"
        })
    }
}
module.exports = {withdrawFunds}