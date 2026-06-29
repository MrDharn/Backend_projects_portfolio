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
      return res.status(403).json({
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

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    //Generate Random Account Number that is unique
    let walletNumber = Math.floor(Math.random() * 10000000000)
    const checkWalletNumber = await walletModel.findOne({walletNumber: walletNumber})

    while(walletNumber === checkWalletNumber.walletNumber){
        walletNumber = Math.floor(Math.random() * 10000000000)
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
      return res.status(403).json({
        status: "failed",
        message: "This email is not registered",
      });

    //Check if password is correct

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res.status(403).json({
        status: "failed",
        message: "Incorrect password",
      });

    // Generate Token

    const token = await jwt.sign(
      { email, role: user.role, name: user.name },
      { JWT_SECRET_KEY },
      { expiresIn: "60m" },
    );

    const refreshToken = await jwt.sign({
        email:user.email, role:user.role, name:user.name
    }, {JWT_REFRESH_TOKEN}, {expiresIn: '7d'})

    console.log(refreshToken);

    req.user = token

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
module.exports = { Register, Login };
