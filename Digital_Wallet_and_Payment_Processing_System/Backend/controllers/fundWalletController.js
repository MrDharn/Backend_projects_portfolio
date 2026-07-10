const mongoose = require("mongoose");
const sendEmail = require('../utils/mailer')
const {getDepositEmail} = require('../utils/emailHtmlTemplate')

const {
  initiateTransaction,
  verifyReferenceForDeposit,
} = require("../utils/payStackService");
const generateReference = require("../utils/generateReference");
const userModel = require("../Models/Users");
const transactionModel = require("../Models/Transaction");
const walletModel = require("../Models/Wallet");

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
    if (!user)
      return res.status(404).json({
        status: "failed",
        message: "user does not exist",
      });

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

    console.log(paystackService)

    res.status(200).json({
      status: "success",
      message: "Transaction is initialized",
      transaction,
      paystackService: paystackService.data.reference,
      authorizationUrl: paystackService.data.authorization_url
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

const verificationController = async (req, res) => {
  const session = await mongoose.startSession();
 session.startTransaction();

  try {
    const { reference } = req. query;
    console.log(req.user)

    const transaction = await transactionModel
      .findOne({ referenceId: reference })
      .session(session);
      
      if (!transaction) {
        await session.abortTransaction();
        return res.status(404).json({
          status: "failed",
          message: "Cannot find such transaction",
        });
      }
    const wallet = await walletModel.findOne({userId: req.user.id}).session(session);

    if (!wallet) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "Cannot find wallet",
      });
    }



    if (transaction.status === "SUCCESS") {
      await session.abortTransaction();
     
      return res.status(404).json({
        status: "failed",
        message: "This transaction is already processed",
      });
    }

    const initialWalletBalance = wallet.balance;

    const verification = await verifyReferenceForDeposit(transaction.referenceId);
    console.log(verification)
    //Check the integrity of the transaction using reference ID
    const payment = verification.data;
    if (payment.reference !== transaction.referenceId) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "ReferenceId does not match",
      });
    }

    // Verify that the amount is the same

    if (payment.amount !== transaction.amount * 100) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "amount processed is not Valid",
      });
    }


    //Check for currency Integrity
    if(payment.currency !== wallet.currency){
        await session.abortTransaction()
        return res.status(400).json({
            status: "failed",
            message: "currency mismatch"
        })
    }

    //perform transaction and update the status of the transaction

    if (verification.data.status === "success") {
      wallet.balance = Number(transaction.amount) + initialWalletBalance;
      transaction.status = "SUCCESS";
      await transaction.save({ session });
      await wallet.save({ session });
      await session.commitTransaction();

       // DISPATCH DEPOSIT TEMPLATE EMAIL
      if (req.user && req.user.email) {
          sendEmail(
              req.user.email,
              "✨ Wallet Credit Notification",
              `Your account has been credited with ₦${transaction.amount}.`,
              getDepositEmail(transaction.amount, transaction.referenceId, wallet.balance)
          )
      }

      return res.status(200).json({
        status: "success",
        message: `You have been credited with ${transaction.amount}`,
        balance: wallet.balance,
        transaction
      });
    }

    transaction.status = "FAILED";
    await transaction.save({ session });
    await session.commitTransaction();

    return res.status(400).json({
      status: "failed",
      message: "The transaction failed",
    });
  } catch (e) {
    session.abortTransaction();
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "verification could not be completed",
    });
  } finally {
    session.endSession();
  }
};

module.exports = { fundWallet , verificationController};
