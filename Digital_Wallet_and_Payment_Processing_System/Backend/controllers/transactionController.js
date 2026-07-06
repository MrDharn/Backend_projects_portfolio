const transactionModel = require("../Models/Transaction");
const walletModel = require("../Models/Wallet");
const generateReference = require("../utils/generateReference");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const initiateTransaction = async (req, res) => {
  const session = mongoose.startSession();
  session.startTransaction();

  try {
    let { walletNumber, amount, pin } = req.body;

    if (!walletNumber || !amount || !pin) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "Empty Fields",
      });
    }

    // Initiate Transfer → User specifies recipient account Number
    const sender = await walletModel
      .findOne({ userId: req.user._id }).select("+pin")
      .session(session);
    if (!sender) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "Failed",
        message: "user account does not exist",
      });
    }

    // Verify Recipient Wallet → Check if recipient exists and wallet is active.
    const recipient = await walletModel
      .findOne({ walletNumber: walletNumber })
      .session(session);
    if (!recipient) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "recipient does not exist",
      });
    }

    //Turn amount to Number if its a String
    if (typeof amount === "string") {
      amount = Number(amount);
    }

    if (amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "Input amount that is valid",
      });
    }

    // Check Balance → Ensure sender has enough funds.

    if (sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "Insufficient Balance",
      });
    }

    //Prevent self Transfer

    if (sender.walletNumber === walletNumber) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "You can not tranfer to yourself",
      });
    }

    //Check if Pin is Correct
    if (typeof pin === "number") {
      pin = String(pin);
    }

    const checkPin = await bcrypt.compare(pin, sender.pin);
    if (!checkPin) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "Incorrect Pin",
      });
    }

    const referenceId = generateReference();

    // Debit & Credit → Deduct from sender’s wallet, crredit recipient’s wallet.
    recipient.balance += amount;
    sender.balance -= amount;
    await sender.save({ session });
    await recipient.save({ session });
    // Transaction Logging → Create two transaction records (debit + credit).
    const debit = new transactionModel({
      walletId: sender._id,
      userId: sender.userId,
      type_of_transaction: "DEBIT",
      status: "SUCCESS",
      referenceId: referenceId,
      amount: String(amount),
    });

    
    const credit = new transactionModel({
        walletId: recipient._id,
        userId: recipient.userId,
        type_of_transaction: "CREDIT",
        status: "SUCCESS",
        referenceId: referenceId,
        amount: String(amount),
    });
    
    await debit.save({session})
    await credit.save({session})

    await session.commitTransaction()
    res.status(200).json({
      status: "success",
      referenceId: referenceId,
      amount,
      receiver: recipient.walletNumber
    });
  } catch (e) {
    await session.abortTransaction();
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Transaction failed",
    });
  } finally {
    await session.endSession();
  }
};

module.exports = {initiateTransaction}