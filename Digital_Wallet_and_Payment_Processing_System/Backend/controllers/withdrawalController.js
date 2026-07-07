const mongoose = require("mongoose");
const generateReference = require("../utils/generateReference");
const {
  getBankCode,
  verifyReference,
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

    if (!walletNumber || !pin || !bankAccount || !bankName || !amount) {
      session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "Empty fields",
      });
    }
    //Validate wallet Number
    const wallet = await walletModel
      .findOne({ userId: req.user._id })
      .select("+pin");
    if (!wallet) {
      session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "Wallet could not be found",
      });
    }
    //Request Withrawal

    const referenceId = generateReference();

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
      "undefined",
    );
  } catch (e) {
    session.abortTransaction()
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }finally{
    session.endSession()
  }
};

const verificationController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { reference } = req.params;

    const transaction = await transactionModel
      .findOne({ referenceId: reference })
      .session(session);
    const wallet = await walletModel
      .findByOne({ userId: req.user._id })
      .session(session);

    if (!transaction || !wallet) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "failed",
        message: "Cannot find wallet or transaction",
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

    const verification = await verifyReference(transaction.referenceId);

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
    if (payment.currency !== wallet.currency) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "failed",
        message: "currency mismatch",
      });
    }

    //perform transaction and update the status of the transaction

    if (verification.data.status === "success") {
      wallet.balance = Number(transaction.amount) + initialWalletBalance;
      transaction.status = "SUCCESS";
      await transaction.save({ session });
      await wallet.save({ session });
      await session.commitTransaction();

      return res.status(200).json({
        status: "success",
        message: `You have been credited with ${transaction.amount}`,
        balance: wallet.balance,
        transaction,
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

module.exports = { withdrawFunds };
