const jwt = require("jsonwebtoken")

const adminAuth = async(req, res, next)=>{
    try{
        const authHeader = req.get("authorization")
        const token = authHeader && authHeader.split(" ")[1]
        if(!token) {
            return res.status(401).json({
                status: "Failed",
                message: "Access denied. No token"
            })
        }

        // IF TOKEN IS VALIDATED, THEN DECODE
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decodedToken.isAdmin){
             return res.status(403).json({
                status: false,
                message: "ACcess Denied"
            })
        }

        req.admin = decodedToken
        next()
    }catch(e){
        return res.status(401).json({
            status: false,
            message: "Invalid or token expired "
        })
    }

    return res.status(401).json({
        status: false,
        message: "No token Provided"
    })
}

module.exports = adminAuth