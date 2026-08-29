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

/**
 * =========================================================
 * WITHDRAW FUNDS
 * =========================================================
 */
const withdrawFunds = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { pin, bankAccount, bankName, amount } = req.body;

    const userId = req.user.id;

    // -----------------------------------------------------
    // 1. Validate request
    // -----------------------------------------------------
    if (!pin || !bankAccount || !bankName || !amount) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    const withdrawalAmount = Number(amount);

    if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid withdrawal amount",
      });
    }

    // -----------------------------------------------------
    // 2. Validate PIN format
    // -----------------------------------------------------
    let userPin = pin;

    if (typeof userPin === "number") {
      userPin = String(userPin);
    }

    if (typeof userPin !== "string") {
      return res.status(400).json({
        status: "failed",
        message: "Invalid PIN",
      });
    }

    // -----------------------------------------------------
    // 3. Get wallet
    // -----------------------------------------------------
    const wallet = await walletModel.findOne({ userId }).select("+pin");

    if (!wallet) {
      return res.status(404).json({
        status: "failed",
        message: "Wallet could not be found",
      });
    }

    // -----------------------------------------------------
    // 4. Check if PIN is set
    // -----------------------------------------------------
    if (!wallet.isPinSet || !wallet.pin) {
      return res.status(400).json({
        status: "failed",
        message: "You have not set your PIN",
      });
    }

    // -----------------------------------------------------
    // 5. Validate PIN
    // -----------------------------------------------------
    const isPinValid = await bcrypt.compare(userPin, wallet.pin);

    if (!isPinValid) {
      return res.status(400).json({
        status: "failed",
        message: "PIN is invalid",
      });
    }

    // -----------------------------------------------------
    // 6. Validate balance
    // -----------------------------------------------------
    if (wallet.balance < withdrawalAmount) {
      return res.status(400).json({
        status: "failed",
        message: "Insufficient balance",
      });
    }

    // -----------------------------------------------------
    // 7. Get bank code
    // -----------------------------------------------------
    const bankCode = await getBankCode(bankName);

    if (!bankCode) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid bank name",
      });
    }

    // -----------------------------------------------------
    // 8. Resolve bank account
    // -----------------------------------------------------
    const accountName = await resolveAccountNumber(bankAccount, bankCode);

    if (!accountName) {
      return res.status(400).json({
        status: "failed",
        message: "Could not resolve bank account",
      });
    }

    // -----------------------------------------------------
    // 9. Create Paystack recipient
    // -----------------------------------------------------
    const recipientCode = await initiateRecipient(
      accountName,
      bankAccount,
      bankCode,
    );

    if (!recipientCode) {
      return res.status(400).json({
        status: "failed",
        message: "Could not create transfer recipient",
      });
    }

    // -----------------------------------------------------
    // 10. Generate our own reference
    // -----------------------------------------------------
    const referenceId = generateReference();

    // -----------------------------------------------------
    // 11. Start MongoDB transaction
    // -----------------------------------------------------
    session.startTransaction();

    // Re-fetch wallet inside transaction to avoid stale balance
    const updatedWallet = await walletModel
      .findOne({ userId })
      .select("+pin")
      .session(session);

    if (!updatedWallet) {
      await session.abortTransaction();

      return res.status(404).json({
        status: "failed",
        message: "Wallet could not be found",
      });
    }

    // -----------------------------------------------------
    // 12. Re-check balance inside transaction
    // -----------------------------------------------------
    if (updatedWallet.balance < withdrawalAmount) {
      await session.abortTransaction();

      return res.status(400).json({
        status: "failed",
        message: "Insufficient balance",
      });
    }

    // -----------------------------------------------------
    // 13. Deduct / reserve money
    // -----------------------------------------------------
    updatedWallet.balance -= withdrawalAmount;

    await updatedWallet.save({ session });

    // -----------------------------------------------------
    // 14. Create PENDING transaction
    // -----------------------------------------------------
    const transaction = new transactionModel({
      walletId: updatedWallet._id,
      userId,
      type_of_transaction: "WITHDRAWAL",
      status: "PENDING",
      referenceId,
      amount: withdrawalAmount,
      bankName,
      bankAccount,
      recipientCode,
    });

    await transaction.save({ session });

    // -----------------------------------------------------
    // 15. Commit MongoDB transaction
    // -----------------------------------------------------
    await session.commitTransaction();

    // -----------------------------------------------------
    // 16. Initiate Paystack transfer AFTER DB commit
    // -----------------------------------------------------
    let paystackResponse;

    try {
      paystackResponse = await initiateWithdrawal(
        withdrawalAmount,
        recipientCode,
        referenceId,
        "balance",
      );
    } catch (paystackError) {
      console.error("Paystack withdrawal initiation error:", paystackError);

      // Mark transaction as failed and refund wallet
      await refundFailedWithdrawal(referenceId, userId, withdrawalAmount);

      return res.status(500).json({
        status: "failed",
        message: "Could not initiate withdrawal",
      });
    }

    // -----------------------------------------------------
    // 17. Validate Paystack response
    // -----------------------------------------------------
    if (!paystackResponse || !paystackResponse.status) {
      await refundFailedWithdrawal(referenceId, userId, withdrawalAmount);

      return res.status(400).json({
        status: "failed",
        message:
          paystackResponse?.message ||
          "Paystack could not initiate the withdrawal",
      });
    }

    // -----------------------------------------------------
    // 18. Save Paystack transfer information
    // -----------------------------------------------------
    await transactionModel.findOneAndUpdate(
      {
        referenceId,
        userId,
      },
      {
        $set: {
          paystackTransferCode: paystackResponse.data?.transfer_code || null,

          paystackReference: paystackResponse.data?.reference || referenceId,
        },
      },
    );

    // -----------------------------------------------------
    // 19. Send email
    // -----------------------------------------------------
    if (req.user?.email) {
      try {
        await sendEmail(
          req.user.email,
          "Withdrawal has been initiated",
          `Hello, you have initiated a withdrawal of ₦${withdrawalAmount.toLocaleString()} to ${bankName} (${bankAccount}). Your reference is ${referenceId}. We will notify you once processing is complete.`,
        );
      } catch (emailError) {
        console.error("Withdrawal email error:", emailError);
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Withdrawal initiated successfully",
      referenceId,
      transaction: {
        amount: withdrawalAmount,
        bankName,
        bankAccount,
        status: "PENDING",
        referenceId,
      },
    });
  } catch (error) {
    console.error("Withdrawal error:", error);

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  } finally {
    await session.endSession();
  }
};

/**
 * =========================================================
 * VERIFY WITHDRAWAL
 * =========================================================
 */
const verificationController = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { reference } = req.params;

    const userId = req.user.id;

    if (!reference) {
      return res.status(400).json({
        status: "failed",
        message: "Transaction reference is required",
      });
    }

    // -----------------------------------------------------
    // 1. Find transaction belonging to this user
    // -----------------------------------------------------
    const transaction = await transactionModel.findOne({
      referenceId: reference,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction could not be found",
      });
    }

    // -----------------------------------------------------
    // 2. Find wallet belonging to this user
    // -----------------------------------------------------
    const wallet = await walletModel.findOne({
      userId,
    });

    if (!wallet) {
      return res.status(404).json({
        status: "failed",
        message: "Wallet could not be found",
      });
    }

    // -----------------------------------------------------
    // 3. Prevent processing completed transaction
    // -----------------------------------------------------
    if (transaction.status === "SUCCESS") {
      return res.status(200).json({
        status: "success",
        message: "This transaction has already been completed",
        transaction,
        balance: wallet.balance,
      });
    }

    // -----------------------------------------------------
    // 4. Verify transfer with Paystack
    // -----------------------------------------------------
    const verification = await verifyReferenceForTransfer(reference);

    if (!verification || !verification.status) {
      return res.status(400).json({
        status: "failed",
        message:
          verification?.message || "Could not verify transaction with Paystack",
      });
    }

    const payment = verification.data;

    // -----------------------------------------------------
    // 5. Verify reference
    // -----------------------------------------------------
    if (payment.reference !== transaction.referenceId) {
      return res.status(400).json({
        status: "failed",
        message: "Transaction reference does not match",
      });
    }

    // -----------------------------------------------------
    // 6. Verify amount
    // -----------------------------------------------------
    const expectedAmountInKobo = Number(transaction.amount) * 100;

    if (Number(payment.amount) !== expectedAmountInKobo) {
      return res.status(400).json({
        status: "failed",
        message: "Transaction amount does not match",
      });
    }

    // -----------------------------------------------------
    // 7. Verify currency
    // -----------------------------------------------------
    if (payment.currency !== wallet.currency) {
      return res.status(400).json({
        status: "failed",
        message: "Currency mismatch",
      });
    }

    // -----------------------------------------------------
    // 8. Handle SUCCESS
    // -----------------------------------------------------
    if (payment.status === "success") {
      session.startTransaction();

      // Atomic status transition
      const updatedTransaction = await transactionModel.findOneAndUpdate(
        {
          _id: transaction._id,
          status: "PENDING",
        },
        {
          $set: {
            status: "SUCCESS",
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedTransaction) {
        await session.abortTransaction();

        return res.status(200).json({
          status: "success",
          message: "Transaction has already been processed",
        });
      }

      await session.commitTransaction();

      if (req.user?.email) {
        try {
          await sendEmail(
            req.user.email,
            "Withdrawal Successful",
            `Great news! Your withdrawal of ₦${Number(
              transaction.amount,
            ).toLocaleString()} has been successfully dispatched to your bank account. Ref: ${transaction.referenceId}.`,
          );
        } catch (emailError) {
          console.error("Withdrawal success email error:", emailError);
        }
      }

      const latestWallet = await walletModel.findOne({
        userId,
      });

      return res.status(200).json({
        status: "success",
        message: "Withdrawal completed successfully",
        balance: latestWallet?.balance,
        transaction: updatedTransaction,
      });
    }

    // -----------------------------------------------------
    // 9. Handle PENDING
    // -----------------------------------------------------
    if (payment.status === "pending" || payment.status === "queued") {
      return res.status(200).json({
        status: "pending",
        message: "Your withdrawal is still being processed",
        transaction,
      });
    }

    // -----------------------------------------------------
    // 10. Handle FAILED / REVERSED
    // -----------------------------------------------------
    if (payment.status === "failed" || payment.status === "reversed") {
      session.startTransaction();

      // Only PENDING transactions can be refunded
      const updatedTransaction = await transactionModel.findOneAndUpdate(
        {
          _id: transaction._id,
          status: "PENDING",
        },
        {
          $set: {
            status: payment.status === "reversed" ? "REVERSED" : "FAILED",
          },
        },
        {
          new: true,
          session,
        },
      );

      // Someone else already processed this transaction
      if (!updatedTransaction) {
        await session.abortTransaction();

        return res.status(200).json({
          status: "success",
          message: "Transaction has already been processed",
        });
      }

      // Refund wallet
      const updatedWallet = await walletModel.findOneAndUpdate(
        {
          userId,
        },
        {
          $inc: {
            balance: Number(transaction.amount),
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedWallet) {
        await session.abortTransaction();

        return res.status(500).json({
          status: "failed",
          message:
            "Transaction failed but wallet refund could not be completed",
        });
      }

      await session.commitTransaction();

      if (req.user?.email) {
        try {
          await sendEmail(
            req.user.email,
            "Withdrawal Failed - Wallet Refunded",
            `Your withdrawal request of ₦${Number(
              transaction.amount,
            ).toLocaleString()} could not be completed. The amount has been refunded to your wallet. Reference: ${transaction.referenceId}.`,
          );
        } catch (emailError) {
          console.error("Withdrawal failed email error:", emailError);
        }
      }

      return res.status(400).json({
        status: "failed",
        message: "The withdrawal failed and your wallet has been refunded",
        balance: updatedWallet.balance,
        transaction: updatedTransaction,
      });
    }

    // -----------------------------------------------------
    // 11. Unknown Paystack status
    // -----------------------------------------------------
    return res.status(400).json({
      status: "failed",
      message: `Unknown Paystack transaction status: ${payment.status}`,
      transaction,
    });
  } catch (error) {
    console.error("Withdrawal verification error:", error);

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      status: "failed",
      message: "Verification could not be completed",
    });
  } finally {
    await session.endSession();
  }
};

/**
 * =========================================================
 * REFUND FAILED WITHDRAWAL
 * =========================================================
 *
 * Used when Paystack cannot even initiate the transfer.
 *
 * It only refunds a transaction that is still PENDING.
 * This prevents double refunds.
 */
const refundFailedWithdrawal = async (referenceId, userId, amount) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Atomically change PENDING → FAILED
    const transaction = await transactionModel.findOneAndUpdate(
      {
        referenceId,
        userId,
        status: "PENDING",
      },
      {
        $set: {
          status: "FAILED",
        },
      },
      {
        new: true,
        session,
      },
    );

    // Already processed
    if (!transaction) {
      await session.abortTransaction();
      return;
    }

    // Refund wallet
    await walletModel.findOneAndUpdate(
      { userId },
      {
        $inc: {
          balance: Number(amount),
        },
      },
      {
        session,
      },
    );

    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Withdrawal refund error:", error);

    throw error;
  } finally {
    await session.endSession();
  }
};


/**
 * =========================================================
 * RESOLVE BANK ACCOUNT
 * =========================================================
 */
const resolveBankAccount = async (req, res) => {
  try {
    const { bankName, accountNumber } = req.body;

    // Validate bank
    if (!bankName) {
      return res.status(400).json({
        status: "failed",
        message: "Bank name is required",
      });
    }

    // Validate account number
    if (!accountNumber) {
      return res.status(400).json({
        status: "failed",
        message: "Account number is required",
      });
    }

    // Remove spaces just in case
    const cleanAccountNumber = String(accountNumber).trim();

    // Nigerian bank account numbers should be 10 digits
    if (!/^\d{10}$/.test(cleanAccountNumber)) {
      return res.status(400).json({
        status: "failed",
        message: "Account number must be exactly 10 digits",
      });
    }

    // Get Paystack bank code
    const bankCode = await getBankCode(bankName);

    if (!bankCode) {
      return res.status(404).json({
        status: "failed",
        message: "Bank could not be found",
      });
    }

    // Resolve account with Paystack
    const accountName = await resolveAccountNumber(
      cleanAccountNumber,
      bankCode
    );

    if (!accountName) {
      return res.status(404).json({
        status: "failed",
        message: "Could not resolve this bank account",
      });
    }

    // Return account details to frontend
    return res.status(200).json({
      status: "success",
      message: "Account resolved successfully",
      data: {
        accountName,
        accountNumber: cleanAccountNumber,
        bankName,
        bankCode,
      },
    });

  } catch (error) {
    console.error(
      "Resolve Bank Account Error:",
      error
    );

    return res.status(500).json({
      status: "failed",
      message:
        error.message ||
        "Could not resolve bank account",
    });
  }
};

module.exports = {
  withdrawFunds,
  verificationController,
  resolveBankAccount
};
