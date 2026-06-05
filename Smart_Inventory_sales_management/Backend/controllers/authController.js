const userModel = require('../Model/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const signUpController = async(req, res)=>{
    try{
        const {username, password,role,email} = req.body;
        //check if user is already in Existence with email;
        const userExistence = await userModel.findOne({email});
        if(userExistence) return res.status(400).json({
            status: "failed",
            message: "user is already Existing, Login Instead"
        })

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            username,
            role,
            email,
            password: hashedPassword
        })

        await newUser.save();

        res.status(201).json({
            status: "success",
            message: "You have registered successfully",
            newUser
        })
    }catch(e){
        console.error(e);
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        })
    }
}

//Login COntroller
const loginController = async(req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password) res.status(400).json({
             status: "failed",
            message: "Email or password is empty"
        })

        //confirm the email is registered in my database
        const userExistence = await userModel.findOne({email});
        //Control if not existing
        if(!userExistence) return res.status(404).json({
             status: "failed",
            message: "Your Email is not registered"
        })

        const isPassword = await bcrypt.compare(password, userExistence.password);
        //control if its not right
        if(!isPassword) return res.status(400).json({
             status: "failed",
            message: "Password is not correct"
        })

        //Create a token with jsonwebtoken
        const createToken = jwt.sign({
            username: userExistence.username,
            email: userExistence.email,
            role: userExistence.role
        }, JWT_SECRET_KEY , {expiresIn:"60m"} )

        
        res.status(200).json({
             status: "Success",
            message: "You Logged In successfully!!",
            createToken
        })
    }catch(e){
        console.error(e)
        res.status(500).json({
             status: "failed",
            message: "Internal Server Error"
        })
    }
}

const userProfileController = async(req,res)=>{
    try{
        res.send("Yo how are you doing");
    }catch(e){
        console.error(e);
        res.status(500).json({
             status: "failed",
            message: "Internal Server Error"
        })
    }
}
module.exports = {
    signUpController, loginController, userProfileController
}