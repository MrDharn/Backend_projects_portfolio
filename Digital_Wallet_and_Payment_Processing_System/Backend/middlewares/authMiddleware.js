const jwt = require('jsonwebtoken')
const authenticationMiddleware = async(req, res, next)=>{
    try{
        const authHeader = req.get('authorization');
        const token = authHeader && authHeader.split(' ')[1];
        if(!token) return res.status(401).json({status: 'failed', message: "Authorization token is missing"})

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decodedToken) return res.status(400).json({
            status: "Failed",
            message: "Invalid Token is passed"
        })

        req.user = decodedToken
        next()
    }catch(e){
        return res.status(401).json({
            status: "failed",
            message: e.name === "TokenExpiredError" ? "Session Expired, Login again" : "Invalid authorization token"
        })
    }
}

module.exports = authenticationMiddleware
