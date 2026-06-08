const managerMiddleware = async(req, res, next)=>{
    try{
        if(req.userInfo.role !== "Manager") return res.status(400).json({
            status:"failed",
            message:"YOu are not authorized"
        })

        console.log("welcome here , Manager")
        
        next()

    }catch(e){
        console.error(e);
        console.log("Something went wrong")
    }

}

module.exports = managerMiddleware