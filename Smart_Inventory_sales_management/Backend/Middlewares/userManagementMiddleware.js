const userManagementMiddleware = async(req, res, next)=>{
    try{
        if(req.userInfo.role !== "Admin") return res.status(403).json({
            status: "failed",
            message: "You are not authorized"
        })
      console.log('You are authorized!!!')
     next()
    }catch(e){
        console.error(e)
        res.status("Something went wrong");
    }
}

module.exports = userManagementMiddleware