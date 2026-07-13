const mongoose = require("mongoose");
const sendEmail = require('../utils/mailer');
const { getDepositEmail } = require('../utils/emailHtmlTemplate');

const {
  initiateTransaction,
  verifyReferenceForDeposit,
} = require("../utils/payStackService");
const generateReference = require("../utils/generateReference");
const userModel = require("../Models/Users");
const transactionModel = require("../Models/Transaction");
const walletModel = require("../Models/Wallet");

// Import decoupled database-backed loggers
const { auditLogger, fraudLogger } = require('../utils/logger');

const fundWallet = async (req, res) => {
  // Extract client metadata info early for accurate system context tracking
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const deviceInfo = req.headers['user-agent'] || 'unknown';

  try {
    const { amount } = req.body;
    if (!amount)
      return res.status(400).json({
        status: "Failed",
        message: "Bad input",
      });

    if (amount <= 0)
      return res.status(400).json({
        status: "Failed",
        message: "You cannot transfer amount of 0",
      });

    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      // FRAUD LOG: Attempting to fund an account with a token that doesn't map to a real user email
      fraudLogger.warn("Deposit initialization failed: Authenticated email has no user record", {
        userId: req.user?.id || null,
        transactionId: null,
        status: "INVESTIGATING"
      });

      return res.status(404).json({
        status: "failed",
        message: "user does not exist",
      });
    }

    const wallet = await walletModel.findOne({ userId: user._id });
    if (!wallet)
      return res.status(404).json({
        status: "failed",
        message: "Invalid Account",
      });

    const referenceId = generateReference();

    const transaction = new transactionModel({
      walletId: wallet._id,
      userId: user._id,
      type_of_transaction: "DEPOSIT",
      status: "PENDING",
      referenceId: referenceId,
      amount,
    });
    await transaction.save();
    
    const paystackService = await initiateTransaction(
      user.email,
      amount,
      referenceId,
    );

    // AUDIT LOG: Maps to user audit pipeline tracking system metrics
    auditLogger.info(`Initiated deposit payment gateway session for ₦${amount}`, {
      userId: user._id,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    return res.status(200).json({
      status: "success",
      message: "Transaction is initialized",
      transaction,
      paystackService: paystackService.data.reference,
      authorizationUrl: paystackService.data.authorization_url
    });
  } catch (e) {
    // Audit Log for unexpected software errors
    auditLogger.error(`System exception while initializing wallet funding: ${e.message}`, {
      userId: req.user?.id || null,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

const verificationController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const deviceInfo = req.headers['user-agent'] || 'unknown';

  try {
    const { reference } = req.query;

    const transaction = await transactionModel
      .findOne({ referenceId: reference })
      .session(session);
      
    if (!transaction) {
      await session.abortTransaction();
      
      // FRAUD LOG: Parameter validation tracking anomaly
      fraudLogger.warn(`Verification engine rejected: Reference ID ${reference} not found in database`, {
        userId: req.user?.id || null,
        transactionId: null,
        status: "INVESTIGATING"
      });

      return res.status(404).json({
        status: "failed",
        message: "Cannot find such transaction",
      });
    }

    const wallet = await walletModel.findOne({ userId: req.user.id }).session(session);
    if (!wallet) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "Cannot find wallet",
      });
    }

    if (transaction.status === "SUCCESS") {
      await session.abortTransaction();

      // AUDIT LOG: Normal duplicate query trace
      auditLogger.info(`Verification bypassed: Transaction reference ${reference} already updated`, {
        userId: req.user.id,
        ipAddress: ipAddress,
        deviceInfo: deviceInfo
      });

      return res.status(404).json({
        status: "failed",
        message: "This transaction is already processed",
      });
    }

    const initialWalletBalance = wallet.balance;

    // Contact the gateway directly
    const verification = await verifyReferenceForDeposit(transaction.referenceId);
    const payment = verification.data;

    // DATA INTEGRITY CHECK 1: Reference mismatch
    if (payment.reference !== transaction.referenceId) {
      await session.abortTransaction();

      // FRAUD LOG: Flag reference signature modification attempt
      fraudLogger.error(`CRITICAL FRAUD: Payment gateway verification reference mismatch (DB: ${transaction.referenceId} vs Gateway: ${payment.reference})`, {
        userId: req.user.id,
        transactionId: transaction._id,
        status: "INVESTIGATING"
      });
      
      return res.status(400).json({
        status: "failed",
        message: "ReferenceId does not match",
      });
    }

    // DATA INTEGRITY CHECK 2: Amount manipulation mismatch
    if (payment.amount !== transaction.amount * 100) {
      await session.abortTransaction();

      // FRAUD LOG: Critical verification value attack
      fraudLogger.error(`CRITICAL FRAUD: Amount manipulation mismatch. Expected kobo/cents amount: ${transaction.amount * 100}, Gateway returned: ${payment.amount}`, {
        userId: req.user.id,
        transactionId: transaction._id,
        status: "INVESTIGATING"
      });

      return res.status(400).json({
        status: "failed",
        message: "amount processed is not Valid",
      });
    }

    // DATA INTEGRITY CHECK 3: Currency tampering
    if (payment.currency !== wallet.currency) {
        await session.abortTransaction();

        // FRAUD LOG: Processing currency parameter attack vector
        fraudLogger.error(`CRITICAL FRAUD: Local wallet settlement currency mismatch (${wallet.currency} vs Gateway: ${payment.currency})`, {
            userId: req.user.id,
            transactionId: transaction._id,
            status: "INVESTIGATING"
        });

        return res.status(400).json({
            status: "failed",
            message: "currency mismatch"
        });
    }

    // Process Ledger Update if Gateway state confirms success
    if (verification.data.status === "success") {
      wallet.balance = Number(transaction.amount) + initialWalletBalance;
      transaction.status = "SUCCESS";
      
      await transaction.save({ session });
      await wallet.save({ session });
      await session.commitTransaction();

      // AUDIT LOG: Log full ledger update success context matching the model structure
      auditLogger.info(`Successfully credited user account with ₦${transaction.amount} via online deposit`, {
        userId: req.user.id,
        ipAddress: ipAddress,
        deviceInfo: deviceInfo
      });

      // DISPATCH DEPOSIT TEMPLATE EMAIL
      if (req.user && req.user.email) {
          sendEmail(
              req.user.email,
              "✨ Wallet Credit Notification",
              `Your account has been credited with ₦${transaction.amount}.`,
              getDepositEmail(transaction.amount, transaction.referenceId, wallet.balance)
          );
      }

      return res.status(200).json({
        status: "success",
        message: `You have been credited with ${transaction.amount}`,
        balance: wallet.balance,
        transaction
      });
    }

    // Gateway explicitly marked transaction as failed/declined
    transaction.status = "FAILED";
    await transaction.save({ session });
    await session.commitTransaction();

    // AUDIT LOG: Business process failure trace
    auditLogger.info(`Deposit verification closed: Marked as FAILED by external payment terminal for ref: ${transaction.referenceId}`, {
      userId: req.user.id,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    return res.status(400).json({
      status: "failed",
      message: "The transaction failed",
    });

  } catch (e) {
    if (session.inTransaction()) {
        await session.abortTransaction();
    }

    // AUDIT LOG: Unhandled tracking capture point
    auditLogger.error(`Database atomic verification workflow collapsed: ${e.message}`, {
      userId: req.user?.id || null,
      ipAddress: ipAddress,
      deviceInfo: deviceInfo
    });

    return res.status(500).json({
      status: "failed",
      message: "verification could not be completed",
    });
  } finally {
    await session.endSession();
  }
};

module.exports = { fundWallet, verificationController };