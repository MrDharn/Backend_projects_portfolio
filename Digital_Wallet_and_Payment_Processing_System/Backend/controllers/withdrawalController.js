const mongoose = require("mongoose");
const generateReference = require("../utils/generateReference");
const sendEmail = require("../utils/mailer");
const {
  getBankCode,
  verifyReferenceForTransfer,
  initiateWithdrawal,
  initiateRecipient,
  resolveAccountNumber,
} = require("../utils/payStackService");
const bcrypt = require("bcrypt");

const walletModel = require("../Models/Wallet");
const transactionModel = require("../Models/Transaction");

const withdrawFunds = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //user Wallet
    let { pin, bankAccount, bankName, amount } = req.body;

    if (!pin || !bankAccount || !bankName || !amount) {
      session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "Empty fields",
      });
    }
    //Validate wallet Number
    const wallet = await walletModel
      .findOne({ userId: req.user.id })
      .select("+pin")
      .session(session);
    if (!wallet) {
      session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "Wallet could not be found",
      });
    }
    //Request Withrawal

    const referenceId = generateReference();

    //Check if pin is not set

    if(!wallet.isPinSet){
      session.abortTransaction()
      return res.status(400).json({
        status: "failed",
        message: "you have not set your pin "
      })
    }

    //Validate Pin
    if (typeof pin === "number") {
      pin = String(pin);
    }

    //Compare pin
    const isPin = await bcrypt.compare(pin, wallet.pin);
    if (!isPin) {
      session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "pin in Invalid",
      });
    }
    //validate Balance
    if (wallet.balance < Number(amount)) {
      session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "Insufficient balance",
      });
    }

    //validate bank Account
    const validateBank = await getBankCode(bankName);

    console.log(validateBank)

    if (!validateBank) {
      session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "Invalid bank name or Account",
      });
    }

    /**
     *
     * DEDUCT FUNDS HERE EVEN AT PENDING STAGE
     */

    wallet.balance -= Number(amount);
    await wallet.save({ session });

    //Create transfer recipient
    const transaction = new transactionModel({
      walletId: wallet._id,
      userId: req.user._id,
      type_of_transaction: "WITHDRAWAL",
      status: "PENDING",
      referenceId: referenceId,
      amount: String(amount),
    });

    await transaction.save({ session });

    /**
     *
     * Resolve Account Number
     */

    const accountName = await resolveAccountNumber(bankAccount, validateBank);
    // console.log(accountName)

    if (!accountName) {
      session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "Could not resolved the bank account",
      });
    }

    //Make Account A  Beneficiary if possible
    const RecipientCode = await initiateRecipient(
      accountName,
      bankAccount,
      validateBank,
    );

    await transaction.save({ session });

    //initiate transfer
    const initiatePaystackWithdrawal = await initiateWithdrawal(
      Number(amount),
      RecipientCode,
      referenceId,
      "balance",
    );

    if (req.user && req.user.email) {
      sendEmail(
        req.user.email,
        "Withdrawal has been initiated",
        `Hello, you have initiated a withdrawal of ₦${amount} to ${bankName} (${bankAccount}). Your reference is ${referenceId}. We will notify you once processing is complete.`,
      );
    }
    await session.commitTransaction();
    res.status(200).json({
      status: "success",
      message: "withdrawal is initiated successfully",
    });
  } catch (e) {
    session.abortTransaction();
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  } finally {
    session.endSession();
  }
};

const verificationController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { reference } = req.params;

    //validate the transaction model with the reference
    const transaction = await transactionModel
      .findOne({ referenceId: reference })
      .session(session);
    const wallet = await walletModel
      .findByOne({ userId: req.user._id })
      .session(session);

    //Validate the wallet and transaction
    if (!transaction || !wallet) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "Cannot find wallet or transaction",
      });
    }

    //If the transaction is already Completed, then abort the transaction to improve the integrity

    if (transaction.status === "SUCCESS") {
      await session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "This transaction is already processed",
      });
    }

    //Check the integrity of the transaction using reference ID
    const verification = await verifyReferenceForTransfer(transaction.referenceId);

    //Improving the integrity by ensuring that payment referenceId in paystack is same as the transaction referemce
    const payment = verification.data;
    if (payment.reference !== transaction.referenceId) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "ReferenceId does not match",
      });
    }

    // Verify that the amount is the same (Integrity improvement)
    if (payment.amount !== transaction.amount * 100) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "amount processed is not Valid",
      });
    }

    //Check for currency Integrity
    if (payment.currency !== wallet.currency) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "currency mismatch",
      });
    }

    //perform transaction and update the status of the transaction
    if (verification.data.status === "success") {
      transaction.status = "SUCCESS";
      await transaction.save({ session });
      await wallet.save({ session });
      await session.commitTransaction();

      //  TRIGGER EMAIL NOTIFICATION: Bank Transfer Success
      if (req.user && req.user.email) {
        sendEmail(
          req.user.email,
          "Withdrawal Successful",
          `Great news! Your withdrawal of ₦${transaction.amount} has been successfully dispatched to your commercial bank account. Ref: ${transaction.referenceId}.`,
        );
      }
      return res.status(200).json({
        status: "success",
        message: `You have been debited with ${transaction.amount}`,
        balance: wallet.balance,
        transaction,
      });
    }

    transaction.status = "FAILED";
    wallet.balance += Number(transaction.amount);
    await transaction.save({ session });
    await session.commitTransaction();

    if (req.user && req.user.email) {
      sendEmail(
        req.user.email,
        "Withdrawal Failed - Wallet Refunded",
        `We wanted to let you know that your withdrawal request of ₦${transaction.amount} failed at the bank processing stage. The full amount has been reversed to your app wallet balance.`,
      );
    }

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

module.exports = { withdrawFunds, verificationController };
