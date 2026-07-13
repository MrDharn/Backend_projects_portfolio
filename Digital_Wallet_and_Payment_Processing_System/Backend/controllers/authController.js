//Models

const userModel = require("../Models/Users");
const walletModel = require("../Models/Wallet");
const { getWelcomeEmail, getPasswordChangeEmail } = require("../utils/emailHtmlTemplate");
const sendEmail = require("../utils/mailer");
//Encryption
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const { auditLogger, fraudLogger } = require('../utils/logger');
/**
 * USER REGISTRATION CONTROLLER
 */

const Register = async (req, res) => {
  try {
    const { name, password, email, phone } = req.body;

    if (!name || !password || !email || !phone)
      return res.status(400).json({
        status: "failed",
        message: "Invalid Inputs",
      });

    const checkUser = await userModel.findOne({ email: email });
    if (checkUser)
      return res.status(400).json({
        status: "failed",
        message: "The email is already in use, Login Instead",
      });

    // Hash Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await user.save();

    //Generate Random Account Number that is unique
    let walletNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    let checkWalletNumber = await walletModel.findOne({
      walletNumber: walletNumber,
    });

    while (checkWalletNumber) {
      walletNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
      checkWalletNumber = await walletModel.findOne({
        walletNumber: walletNumber,
      });
    }

    const createNewWallet = new walletModel({ userId: user._id, walletNumber });
    await createNewWallet.save();

    sendEmail(
      user.email,
      "👋 Welcome to Wallet App!",
      `Welcome to Wallet App, ${user.name}! and your wallet number is ${createNewWallet.walletNumber}`,
      getWelcomeEmail(user.name),
    );

    res.status(201).json({
      status: "successful",
      message: "user Created successfully",
      name,
      email,
      phone,
      walletNumber,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something Went wrong",
    });
  }
};

/**
 * 
 * LOGIN CONTROLLER
 */

const Login = async (req, res) => {
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const deviceInfo = req.headers['user-agent'] || 'unknown';

  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        status: "failed",
        message: "Bad requests",
      });

    const user = await userModel.findOne({ email: email }).select("+password");
    if (!user) {
      // FRAUD LOG: Logging an unauthenticated target email query anomaly
      fraudLogger.warn(`Authentication rejected: Unregistered email login attempt (${email})`, {
        userId: null,
        transactionId: null,
        status: "INVESTIGATING"
      });

      return res.status(400).json({
        status: "failed",
        message: "This email is not registered",
      });
    }

    // Check if password is correct
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      // FRAUD LOG: Track bad password verification attempts explicitly
      fraudLogger.warn(`Authentication failed: Incorrect password attempt for email ${email}`, {
        userId: user._id,
        transactionId: null,
        status: "INVESTIGATING"
      });

      return res.status(400).json({
        status: "failed",
        message: "Incorrect password",
      });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id, email, role: user.role, name: user.name },
      JWT_SECRET_KEY,
      { expiresIn: "60m" },
    );

    const refreshToken = jwt.sign(
      { email: user.email, role: user.role, name: user.name },
      JWT_REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    // AUDIT LOG: Direct success track matching AuditLog schema requirements
    auditLogger.info(`User identity successfully authenticated for session`, {
      userId: user._id,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    res.status(200).json({
      status: "successful",
      message: "you have been logged in successfully",
      token,
    });
  } catch (e) {
    auditLogger.error(`System runtime crash during user login flow: ${e.message}`, {
      userId: null,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    res.status(500).json({
      status: "failed",
      message: "Something Went wrong",
    });
  }
};

/**
 * CHANGE PASSWORD
 */
const ChangePassword = async (req, res) => {
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const deviceInfo = req.headers['user-agent'] || 'unknown';

  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword)
      return res.status(400).json({
        status: "failed",
        message: "invalid input",
      });

    const user = await userModel.findById(req.user.id).select("+password");
    if (!user)
      return res.status(404).json({
        status: "failed",
        message: "invalid user",
      });

    const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkOldPassword) {
      // FRAUD LOG: Malicious attempt to change password without knowing historical keys
      fraudLogger.warn("Security Alert: Unauthorized password change attempt due to verification mismatch", {
        userId: user._id,
        transactionId: null,
        status: "INVESTIGATING"
      });

      return res.status(403).json({
        status: "failed",
        message: "Old password is not correct",
      });
    }

    if (newPassword !== confirmPassword)
      return res.status(400).json({
        status: "failed",
        message: "Passwords mismatch",
      });

    if (oldPassword === newPassword)
      return res.status(400).json({
        status: "failed",
        message: "Old password is same as new password",
      });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // AUDIT LOG: Log sensitive user record mutations
    auditLogger.info("User account password configuration updated successfully", {
      userId: user._id,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    sendEmail(
      req.user.email,
      "🔒 Security Update:Account Password Changed",
      "Your transaction Password has been successfully modified.",
      getPasswordChangeEmail(),
    );

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (e) {
    auditLogger.error(`System runtime exception during account password change: ${e.message}`, {
      userId: req.user?.id || null,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};

/**
 * SET TRANSACTION PIN
 */
const SetPin = async(req, res)=>{
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const deviceInfo = req.headers['user-agent'] || 'unknown';

  try {
    const { pin } = req.body;
    if(!pin || pin.length !== 4) return res.status(400).json({
      status:"failed",
      message: "invalid input(pin length is not 4 )"
    })

    const wallet = await walletModel.findOne({userId: req.user.id});
    if(!wallet) return res.status(404).json({
      status:"failed",
      message: "Wallet cannot be found"
    })

    if(wallet.isPinSet) return res.status(400).json({
      status:"failed",
      message:"Pin is already set, you can change pin instead"
    })

    const hashPin = await bcrypt.hash(pin, 10);
    if(!hashPin) return res.status(400).json({
      status: "failed",
      message: "Please try again later"
    })

    wallet.isPinSet = true
    wallet.pin = hashPin
    await wallet.save();

    // AUDIT LOG: Financial credentials configuration update tracking
    auditLogger.info("Secure wallet transaction PIN configured for the first time", {
      userId: req.user.id,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    res.status(201).json({
      status: "success",
      message:"pin i set successfully",
    })

  } catch(e) {
    auditLogger.error(`System runtime crash during wallet PIN configuration initialization: ${e.message}`, {
      userId: req.user?.id || null,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    res.status(500).json({
      status:"failed",
      message:"Something went wrong"
    })
  }
}

/**
 * CHANGE TRANSACTION PIN
 */
const ChangePin = async(req,res)=>{
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const deviceInfo = req.headers['user-agent'] || 'unknown';

  try {
    const { oldPin, newPin, confirmPin } = req.body

    if(!oldPin || !newPin || !confirmPin) return res.status(400).json({
      status:"failed",
      message:"Invalid inputs"
    })

    const wallet = await walletModel.findOne({userId: req.user.id}).select("+pin");
    if(!wallet) return res.status(404).json({
      status: "Failed",
      message: "user has no wallet"
    })

    // Check if pin is not set at all
    if(wallet.isPinSet === false) return res.status(400).json({
      status:"failed",
      message: "you have not set up your pin"
    })

    // Check oldPin validity
    const oldPinValidity = await bcrypt.compare(oldPin, wallet.pin);
    if(!oldPinValidity) {
      // FRAUD LOG: Attempted manipulation of wallet payment validation paths
      fraudLogger.warn("Security Alert: Attempted change of transaction PIN failed due to old PIN mismatch", {
        userId: req.user.id,
        transactionId: null,
        status: "INVESTIGATING"
      });

      return res.status(400).json({
        status: "failed",
        message: "Old Pin is incorrect"
      })
    }

    // Check if newPin is same as confirmPin
    if(newPin !== confirmPin) return res.status(400).json({
      status: "failed",
      message: "Pin mismatch"
    })

    // Hash pin
    const hashNewPin = await bcrypt.hash(newPin, 10);
    if(!hashNewPin) return res.status(403).json({
      status: "failed",
      message: "try again later"
    })

    wallet.pin = hashNewPin
    await wallet.save();

    // AUDIT LOG: Track credential modification
    auditLogger.info("User transaction PIN successfully updated", {
      userId: req.user.id,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    res.status(200).json({
      status: "success",
      message: "Pin is Changed successfully!!!"
    })

  } catch(e) {
    auditLogger.error(`System pipeline failure while updating transaction PIN configurations: ${e.message}`, {
      userId: req.user?.id || null,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    res.status(500).json({
      status:"failed",
      message:"Something went wrong"
    })
  }
}

module.exports = { Login, ChangePassword, SetPin, ChangePin };