const jwt = require("jsonwebtoken")

const adminLogin = async(req, res)=>{
    const {email, password}= req.body
    if(!email || !password) return res.status(400).json({
        status: false,
        message: "Invalid inputs"
    })

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        const token = jwt.sign({isAdmin: true, email}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})
    };

    return res.status(200).json({
        status: true,
        message: "Logged In Successfully",
        token
})

    return res.status(401).json({
        status: false,
        message: "Invalid Admin Credentials"
    });

}

module.exports = adminLogin