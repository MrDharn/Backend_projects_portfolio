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

// Import logger
const { auditLogger, fraudLogger } = require('../utils/logger');

const fundWallet = async (req, res) => {
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
      fraudLogger.warn("Deposit failed: Authenticated email has no user record", {
        email: req.user.email,
        ipAddress: req.ip || req.headers['x-forwarded-for']
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

    // AUDIT LOG: Track deposit initialization milestones
    auditLogger.info("Deposit payment gateway session initiated", {
      userId: user._id,
      walletId: wallet._id,
      amount,
      referenceId
    });

    return res.status(200).json({
      status: "success",
      message: "Transaction is initialized",
      transaction,
      paystackService: paystackService.data.reference,
      authorizationUrl: paystackService.data.authorization_url
    });
  } catch (e) {
    // System exceptions should always be flagged inside the engineering audit log
    auditLogger.error("Critical error while initializing wallet funding", {
      error: e.message,
      stack: e.stack,
      userEmail: req.user?.email
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

  const ipAddress = req.ip || req.headers['x-forwarded-for'];

  try {
    const { reference } = req.query;

    const transaction = await transactionModel
      .findOne({ referenceId: reference })
      .session(session);
      
    if (!transaction) {
      await session.abortTransaction();
      // FRAUD LOG: Verifying a transaction reference that doesn't exist in our DB
      fraudLogger.warn("Verification failed: Reference ID not found in database", {
        attemptedReference: reference,
        ipAddress
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
      // AUDIT LOG: Harmless double-tap verification (e.g., user refreshing page)
      auditLogger.info("Verification skipped: Transaction already marked successful", {
        referenceId: reference
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
      fraudLogger.error("CRITICAL FRAUD ALERT: Gateway reference mismatch during verification", {
        dbReference: transaction.referenceId,
        gatewayReturnedReference: payment.reference,
        userId: req.user.id,
        ipAddress
      });
      return res.status(400).json({
        status: "failed",
        message: "ReferenceId does not match",
      });
    }

    // DATA INTEGRITY CHECK 2: Amount manipulation mismatch (Paystack tracks in kobo/cents)
    if (payment.amount !== transaction.amount * 100) {
      await session.abortTransaction();
      fraudLogger.error("CRITICAL FRAUD ALERT: Gateway amount mismatch during verification", {
        referenceId: transaction.referenceId,
        dbExpectedAmount: transaction.amount * 100,
        gatewayPaidAmount: payment.amount,
        userId: req.user.id,
        ipAddress
      });
      return res.status(400).json({
        status: "failed",
        message: "amount processed is not Valid",
      });
    }

    // DATA INTEGRITY CHECK 3: Currency tampering
    if (payment.currency !== wallet.currency) {
        await session.abortTransaction();
        fraudLogger.error("CRITICAL FRAUD ALERT: Currency mismatch during deposit verification", {
            referenceId: transaction.referenceId,
            walletCurrency: wallet.currency,
            gatewayCurrency: payment.currency,
            userId: req.user.id
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

      // AUDIT LOG: Factual ledger shift recorded
      auditLogger.info("Wallet successfully funded via gateway deposit", {
        referenceId: transaction.referenceId,
        userId: req.user.id,
        walletId: wallet._id,
        amountAdded: transaction.amount,
        newBalance: wallet.balance
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

    auditLogger.info("Deposit transaction marked as failed by payment processor", {
      referenceId: transaction.referenceId,
      userId: req.user.id
    });

    return res.status(400).json({
      status: "failed",
      message: "The transaction failed",
    });

  } catch (e) {
    if (session.inTransaction()) {
        await session.abortTransaction();
    }
    auditLogger.error("System crash during payment verification pipeline", {
      error: e.message,
      stack: e.stack,
      attemptedQueryReference: req.query?.reference
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