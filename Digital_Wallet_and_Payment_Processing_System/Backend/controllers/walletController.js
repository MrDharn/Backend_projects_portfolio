const walletModel = require('../Models/Wallet')
const bcrypt = require('bcrypt')


const getAllWallet = async(req, res)=>{
    try{
        const wallets = await walletModel.find({})

        if(wallets.length === 0) return res.status(404).json({
            status:"failed",
            message: "No wallet is registered"
        })

        res.status(200).json({
            status: "success",
            message: "All wallets have been fetched successfully",
            wallets
        })

    }catch(e){
        console.error(e)
        res.status(500).json({
            status: "failed",
            message: "Something went wrong"
        })
    }
}


const CreatePin = async(req, res)=>{
    try{
        let {pin, confirmPin} = req.body
        const wallet = await walletModel.findOne({userId: req.user._id});
        if(!wallet)return res.status(404).json({
            status: "Failed",
            message: "Cannot find user"
        })

        if(!pin || !confirmPin) return res.status(400).json({
            status: "failed",
            message: "invalid inputs"
        })

        if(typeof pin === "number" && typeof confirmPin === 'number'){
            pin = String(pin)
            confirmPin = String(confirmPin)
        }

        if(pin.length !== 4) return res.status(400).json({
            status: "failed",
            message: "Pin length is not 4"
        })


        if(pin !== confirmPin)return res.status(400).json({
            status: "failed",
            message: "Pin mismatch"
        })

        const salt = await bcrypt.genSalt(10)
        const hashedPin = await bcrypt.hash(pin, salt)

        if(wallet.isPinSet !== false) return res.status(403).json({
            status: "failed",
            message: "Pin is already set, Change Pin instead"
        })

        wallet.pin = hashedPin
        wallet.isPinSet = true

        await wallet.save()

        res.status(200).json({
            status: "success",
            message: "You have set your PIN"
        })

    }catch(e){
        console.error(e);
        res.status(500).json({
            status: "failed",
            message: "Something went wrong!!!"
        })
    }
}


const ChangePin = async(req, res)=> {
    try{
        //get the user wallet
        let {oldPin, newPin, confirmNewPin} = req.body
        const wallet = await walletModel.findOne({userId: req.user._id}).select("+pin");
        if(!newPin || !oldPin || !confirmNewPin) return res.status(400).json({
            status: "failed",
            message: "Invalid inputs"
        })

        if(!wallet) return res.status(404).json({
            status: "failed",
            message: "Cannot found wallet"
        })

        if(typeof newPin !== 'number' && typeof confirmNewPin !== 'number' && typeof oldPin !== 'number') return res.status(400).json({
            status: "failed",
            message: "Not a Number"
        })

        oldPin = String(oldPin)
        newPin = String(newPin)
        confirmNewPin = String(confirmNewPin)

        //if the pin is not set
        if(wallet.isPinSet === false) return res.status(400).json({
            status: "failed",
            message: "You have not set Pin yet"
        })

        if(newPin.length !== 4 )return res.status(400).json({
            status: "Failed",
            message: "Invalid Pin Length"
        })
        //Checkif the oldPin is Equal to Original Pin

        const checkPin = await bcrypt.compare(oldPin, wallet.pin)
        if(!checkPin)return res.status(403).json({
            status:"failed",
            message: "Old Pin Is Incorrect"
        })

        //Check if the oldPin is same as NewPin

        if(oldPin === newPin)return res.status(400).json({
            status: "failed",
            message: "OldPin is same as New Pin"
        })

        if(newPin !== confirmNewPin)return res.status(400).json({
            status: "failed",
            message: "Pin Mismatch"
        })

        //hash pin
        const salt = await bcrypt.genSalt(10)
        const hashedPin = await bcrypt.hash(newPin, salt)
        //save new pin

        wallet.pin = hashedPin

        await wallet.save()

        res.status(200).json({
            status: "success",
            message: "PIN changed successfully!!!"
        })
    }catch(e){
        console.error(e)
        res.status(500).json({
            status:"Failed",
            message: "Something went wrong !!"
        })
    }
}


const ResetPin = async(req, res)=>{
    try{

    }catch(e){

    }
}


module.exports = {getAllWallet,CreatePin, ChangePin}