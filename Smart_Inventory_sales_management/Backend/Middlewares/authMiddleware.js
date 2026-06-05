const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const authController = async(req, res, next)=>{
    const authHeader = req.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    //check if there is token
    if(!token) return res.status(403).json({
         status: "failed",
            message: "No token generated, Kindly Login"
    })

    try{
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY)
        if(!decodedToken) return res.status(400).json({
             status: "failed",
            message: "Error Token"
        })

        req.userInfo = decodedToken
        console.log("Token is decoded successfully:", decodedToken);
        next()
    } catch(e){
        console.error(e);
        return res.status(500).json({
             status: "failed",
            message: "Error Token Inputted"
        })
    }
}

module.exports = authController