const userModel = require('../Models/Users')
const walletModel = require('../Models/Wallet')

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

        const data = {
            name: profile.name,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            KYC_STATUS: profile.KYC_STATUS,
            walletNumber: wallet.walletNumber,
            balance: wallet.balance

        }

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