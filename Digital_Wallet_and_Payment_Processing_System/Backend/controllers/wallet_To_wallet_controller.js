/**
 * WALLET CONTROLLER
 */
const userModel = require('../Models/Users');
const walletModel = require("../Models/Wallet");
const transactionModel = require("../Models/Transaction");
const generateReference = require("../utils/generateReference");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { auditLogger, fraudLogger } = require('../utils/logger');

/**
 * TRANSFER FROM WALLET TO WALLET
 */
const transferToWallet = async (req, res) => {
    const session = await mongoose.startSession();
    
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    try {
        let { fromWalletNumber, toWalletNumber, amount, pin } = req.body;

        // 1. Fast Input Validation (Before starting transaction lock)
        if (!fromWalletNumber || !toWalletNumber || !amount || !pin) {
            return res.status(400).json({
                status: "failed",
                message: "Missing required inputs"
            });
        }

        amount = Number(amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid transaction amount"
            });
        }

        if (fromWalletNumber === toWalletNumber) {
            return res.status(400).json({
                status: "failed",
                message: "Cannot transfer to the same wallet"
            });
        }

        if (typeof pin === 'number') pin = String(pin);

        // Start transaction session
        session.startTransaction();

        // 2. Fetch Origin Wallet inside session
        const fromWallet = await walletModel.findOne({ 
            walletNumber: fromWalletNumber,
            userId: req.user.id
        }).select("+pin").session(session);

        if (!fromWallet) { 
            await session.abortTransaction();
            fraudLogger.warn(`Unauthorized transfer attempt: Wallet ${fromWalletNumber} does not belong to user ${req.user.id}`, {
                userId: req.user.id,
                transactionId: null,
                status: "INVESTIGATING"
            });

            return res.status(404).json({
                status: "failed",
                message: "Origin wallet not found or unauthorized access"
            });
        }

        // 3. Security PIN Verification
        if (!fromWallet.isPinSet) {
            await session.abortTransaction();
            return res.status(400).json({
                status: "failed",
                message: "You have not set your transaction PIN"
            });
        }

        const isPinValid = await bcrypt.compare(pin, fromWallet.pin);
        if (!isPinValid) {
            await session.abortTransaction();
            fraudLogger.warn(`Security Alert: Wallet transfer PIN verification failed for wallet ${fromWalletNumber}`, {
                userId: req.user.id,
                transactionId: null,
                status: "INVESTIGATING"
            });

            // 400 Bad Request prevents frontend HTTP interceptors from logging out the user
            return res.status(400).json({ 
                status: "failed",
                message: "Invalid security PIN"
            });
        }

        // 4. Fetch Destination Wallet inside session
        const toWallet = await walletModel.findOne({ walletNumber: toWalletNumber }).session(session);
        if (!toWallet) {
            await session.abortTransaction();
            return res.status(404).json({
                status: "failed",
                message: "Recipient wallet not found"
            });
        }

        // 5. Atomic Balance Updates
        const senderUpdate = await walletModel.findOneAndUpdate(
            { _id: fromWallet._id, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { session, new: true }
        );

        if (!senderUpdate) {
            await session.abortTransaction();
            return res.status(400).json({
                status: "failed",
                message: "Insufficient balance or concurrent transaction processing"
            });
        }

        await walletModel.updateOne(
            { _id: toWallet._id },
            { $inc: { balance: amount } },
            { session }
        );

        // 6. Save Ledger Entry
        const reference = generateReference();
        
        const transaction = new transactionModel({
            userId: req.user.id, 
            walletId: fromWallet._id,
            type_of_transaction: "TRANSFER",
            status: "SUCCESS", 
            referenceId: reference,
            amount: String(amount),
            description: `Transfer of ₦${amount} to wallet ${toWalletNumber}`
        });

        await transaction.save({ session });

        // 7. Commit Transaction
        await session.commitTransaction();
        
        auditLogger.info(`Successfully transferred ₦${amount} from ${fromWalletNumber} to ${toWalletNumber}`, {
            userId: req.user.id,
            ipAddress,
            deviceInfo
        });

        return res.status(200).json({
            status: "success",
            message: `You have successfully transferred ₦${amount} to wallet ${toWalletNumber}`,
            data: { reference }
        });

    } catch (e) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        auditLogger.error(`Transfer system transaction error: ${e.message}`, {
            userId: req.user?.id || null,
            ipAddress,
            deviceInfo
        });

        return res.status(500).json({
            status: "failed",
            message: e.message || "An unexpected error occurred during transfer"
        });
    } finally {
        await session.endSession();
    }
};

/**
 * VERIFY TRANSACTION STATUS BY REFERENCE
 * GET /api/wallet/verify?reference=REF123456
 */
const verificationController = async (req, res) => {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    try {
        const { reference } = req.query;

        if (!reference) {
            return res.status(400).json({
                status: "failed",
                message: "Reference parameter is required"
            });
        }

        const transaction = await transactionModel.findOne({ referenceId: reference });
        if (!transaction) {
            fraudLogger.warn(`Verification lookup failed: Transfer reference ${reference} not found`, {
                userId: req.user?.id || null,
                transactionId: null,
                status: "INVESTIGATING"
            });

            return res.status(404).json({
                status: "failed",
                message: "No such transaction is in existence"
            });
        }

        auditLogger.info(`Transfer verification processed: Reference ${reference}`, {
            userId: req.user?.id || null,
            ipAddress,
            deviceInfo
        });

        return res.status(200).json({
            status: "success",
            message: "Transaction verified successfully",
            data: transaction
        });

    } catch (e) {
        auditLogger.error(`Internal transfer verification subsystem failure: ${e.message}`, {
            userId: req.user?.id || null,
            ipAddress,
            deviceInfo
        });

        return res.status(500).json({
            status: "failed",
            message: "Something went wrong"
        });
    }
};

/**
 * RESOLVE WALLET NAME BEFORE TRANSFER
 * GET /api/wallet/resolve?walletNumber=1234567890
 */
const resolveWalletNameController = async (req, res) => {
    try {
        const { walletNumber } = req.query;

        if (!walletNumber) {
            return res.status(400).json({
                status: "failed",
                message: "Wallet number is required"
            });
        }

        const wallet = await walletModel.findOne({ walletNumber })
            .populate("userId", "name email");

        if (!wallet) {
            return res.status(404).json({
                status: "failed",
                message: "Wallet number not found"
            });
        }

        const user = wallet.userId;
        const accountName = user ? user.name : "Unknown User";

        return res.status(200).json({
            status: "success",
            message: "Wallet details resolved successfully",
            data: {
                walletNumber: wallet.walletNumber,
                accountName: accountName,
            }
        });

    } catch (e) {
        auditLogger.error(`Wallet name resolution failed: ${e.message}`, {
            userId: req.user?.id || null
        });

        return res.status(500).json({
            status: "failed",
            message: "Unable to resolve wallet name"
        });
    }
};

module.exports = {
    transferToWallet,
    verificationController,
    resolveWalletNameController
};