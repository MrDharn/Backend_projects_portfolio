const userModel = require('../Models/Users')

const getProfileDetails = async(req, res)=>{
    try{
        const profile = await userModel.findOne({email: req.user.email})
        if(!profile)return res.status(404).json({
            status: "failed",
            message: "User does not exist"
        })

        const data = {
            name: profile.name,
            email: profile.name,
            phoneNumber: profile.phoneNumber,
            
        }
    }catch(e){
        console.error(e);
        res.status(500).json({
            status: "failed",
            mesage: "Something went wrong"
        })
    }
}