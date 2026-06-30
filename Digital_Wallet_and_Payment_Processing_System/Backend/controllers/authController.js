//Models 

const userModel = require("../Models/Users");
const walletModel = require('../Models/Wallet')
//Encryption
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN

const Register = async (req, res) => {
  try {
    const { name, password, email, phone } = req.body;

    if (!name || !password || !email ||!phone)
      return res.status(400).json({
        status: "failed",
        message: "Invalid Inputs",
      });

    const checkUser = await userModel.findOne({ email: email });
    if (checkUser)
      return res.status(400).json({
        status: "failed",
        message: "The email is already in use",
      });

    // Hash Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({ name, email, password: hashedPassword, phone });
    await user.save();

    //Generate Random Account Number that is unique
    let walletNumber = Math.floor(Math.random() * 9000000000) + 1000000000
    let checkWalletNumber = await walletModel.findOne({walletNumber: walletNumber})

    while(checkWalletNumber){
        walletNumber = Math.floor(Math.random() * 9000000000) + 1000000000
        checkWalletNumber = await walletModel.findOne({walletNumber: walletNumber})
    }

    const createNewWallet = new walletModel({userId: user._id, walletNumber})
    await createNewWallet.save()

    res.status(201).json({
      status: "successful",
      message: "user Created successfully",
      user,
      walletNumber
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something Went wrong",
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        status: "failed",
        message: "Bad requests",
      });

    const user = await userModel.findOne({ email: email });
    if (!user)
      return res.status(400).json({
        status: "failed",
        message: "This email is not registered",
      });

    //Check if password is correct

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res.status(400).json({
        status: "failed",
        message: "Incorrect password",
      });

    // Generate Token

    const token =  jwt.sign(
      { id: user._id, email, role: user.role, name: user.name },
      JWT_SECRET_KEY,
      { expiresIn: "60m" },
    );

    const refreshToken = jwt.sign({
        email:user.email, role:user.role, name:user.name
    }, JWT_REFRESH_TOKEN, {expiresIn: '7d'})

    console.log(refreshToken);

    res.status(200).json({
        status: "successful",
        message: "you have been logged in successfully",
        token
    })
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something Went wrong",
    });
  }
};

const ChangePassword = async(req, res)=>{
  try{
    const {oldPassword, newPassword, confirmPassword} = req.body;

    const user = await userModel.findById(req.user._id);
    
    if(!userser) return res.status(404).json({
      status: "failed",
      message: "invalid user"
    })

    if(!oldPassword|| !newPassword || !confirmPassword) return res.status(400).json({
      status: "failed",
      message: "invalid input"
    })
    
    const checkOldPassword = await bcrypt.compare(oldPassword, user.password);

    if(!checkOldPassword)return res.status(403).json({
      status: "failed",
      message: "Old password is not correct"
    })
    
    //Check if Password matches 
    if(newPassword !== confirmPassword) return res.status(400).json({
      status: "failed",
      message: "Passwords mismatch"
    })
    
    if(oldPassword === newPassword) return res.status(400).json({
      status: "failed",
      message: "Old password is same as new passwor"
    })
    
    //hash the password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    
    user.password = hashedPassword
    await user.save()
    res.status(200).json({
      status: "success",
      message: "Password changed successfully", 
    })
  }catch(e){
    console.error(e);
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong"
    })
  }
}
module.exports = { Register, Login , ChangePassword};
