const jwt = require('jsonwebtoken')
const authenticationMiddleware = async(req, res, next)=>{
    try{
        const authHeader = req.get('authorization');
        const token = authHeader && authHeader.split(' ')[1];
        if(!token) return res.status(403).json({status: 'failed', message: "You are not authorized"})

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decodedToken) return res.status(400).json({
            status: "Failed",
            message: "Invalid Token is passed"
        })

        req.user = decodedToken
        next()
    }catch(e){
        console.log('you are not authorized')
    }
}

module.exports = authenticationMiddleware