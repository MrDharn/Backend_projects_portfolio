const userModel = require('../Models/Users')
const walletModel = require('../Models/Wallet')
const transactionModel = require('../Models/Transaction')
const getProfileDetails = async(req, res)=>{
    try{
        const profile = await userModel.findOne({email: req.user.email})
        if(!profile)return res.status(404).json({
            status: "failed",
            message: "User does not exist"
        })

        const wallet = await walletModel.findOne({userId: profile._id});
        if(!wallet)return res.status(404).json({
            status: "failed",
            message: "wallet is not attached to this user"
        })

        let transactionLength
        const transactions = await transactionModel.findOne({userId: profile._id});
        if(!transactions){
            transactionLength = 0
        } else{
            transactionLength = transactions.countDocuments()
        }

        const data = {
            name: profile.name,
            email: profile.email,
            phoneNumber: profile.phone,
            KYC_STATUS: profile.KYC_STATUS,
            walletNumber: wallet.walletNumber,
            balance: wallet.balance,
            transactions: transactionLength,
            isPinSet: Boolean(wallet.isPinSet)
        }

        console.log(data)
        res.status(200).json({
            status: "success",
            message: "fetched successfully",
            data
        })
    }catch(e){
        console.error(e);
        res.status(500).json({
            status: "failed",
            mesage: "Something went wrong"
        })
    }
}

module.exports = getProfileDetails