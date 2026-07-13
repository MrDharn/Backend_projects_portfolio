/**
 * TRANSFER FROM WALLET TO WALLET
 */
const userModel = require('../Models/Users')
const walletModel = require("../Models/Wallet")
const transactionModel = require("../Models/Transaction")
const generateReference = require("../utils/generateReference")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Import loggers
const { auditLogger, fraudLogger } = require('../utils/logger');

const transferToWallet = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction();

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    try {
        let { fromWalletNumber, toWalletNumber, amount, pin } = req.body
        
        // Validate inputs are present
        if (!fromWalletNumber || !toWalletNumber || !amount || !pin) {
            await session.abortTransaction();
            return res.status(400).json({
                status: "failed",
                message: "Missing required inputs"
            })
        }

        // Parse amount cleanly
        if (typeof amount === "string") {
            amount = Number(amount)
        }

        if (isNaN(amount) || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                status: "failed",
                message: "Invalid transaction amount"
            })
        }

        // Prevent self-transfer loops
        if (fromWalletNumber === toWalletNumber) {
            await session.abortTransaction();
            return res.status(400).json({
                status: "failed",
                message: "Cannot transfer to the same wallet"
            })
        }

        // Validate origin wallet
        const fromWallet = await walletModel.findOne({ walletNumber: fromWalletNumber }).select("+pin").session(session);
        if (!fromWallet) { 
            await session.abortTransaction();

            // FRAUD LOG: Attempting to move funds from a non-existent wallet number
            fraudLogger.warn(`Unauthorized transfer attempt: Origin wallet number ${fromWalletNumber} not found`, {
                userId: req.user?.id || null,
                transactionId: null,
                status: "INVESTIGATING"
            });

            return res.status(404).json({
                status: "failed",
                message: "Origin wallet not found"
            })
        }

        // Validate destination wallet
        const toWallet = await walletModel.findOne({ walletNumber: toWalletNumber }).session(session);
        if (!toWallet) {
            await session.abortTransaction();
            return res.status(404).json({
                status: "failed",
                message: "Recipient wallet not found"
            })
        }

        // Ensure sender's pin configuration is set up
        if (!fromWallet.isPinSet) {
            await session.abortTransaction();
            return res.status(403).json({
                status: "failed",
                message: "You have not set your transaction pin"
            })
        }

        // Enforce strong balance logic check
        if (fromWallet.balance < amount) {
            await session.abortTransaction();

            // AUDIT LOG: Business logic rejection tracking
            auditLogger.info(`Transfer rejected due to insufficient funds in wallet ${fromWalletNumber}`, {
                userId: req.user?.id || null,
                ipAddress: ipAddress,
                deviceInfo: deviceInfo
            });

            return res.status(400).json({
                status: "failed",
                message: "Insufficient Balance"
            })
        }

        // Check if Pin is Valid
        if (typeof pin === 'number') pin = String(pin);
        const isPinValid = await bcrypt.compare(pin, fromWallet.pin)
        if (!isPinValid) {
            await session.abortTransaction();

            // FRAUD LOG: Log incorrect PIN verification attempts as security risks
            fraudLogger.warn(`Security Alert: Wallet transfer PIN verification failed for wallet ${fromWalletNumber}`, {
                userId: req.user?.id || null,
                transactionId: null,
                status: "INVESTIGATING"
            });

            return res.status(401).json({ 
                status: "failed",
                message: "Invalid security PIN"
            })
        }

        // 1. Process Financial Balances
        fromWallet.balance -= amount;
        toWallet.balance += amount;

        // Save documents inside the session state
        await fromWallet.save({ session });
        await toWallet.save({ session });

        // 2. Log Ledger Entry
        const reference = generateReference();
        
        const transaction = new transactionModel({
            userId: req.user.id, 
            senderWallet: fromWalletNumber,
            receiverWallet: toWalletNumber,
            type_of_transaction: "TRANSFER",
            status: "SUCCESS", 
            referenceId: reference,
            amount: amount
        });

        await transaction.save({ session });

        // 3. Commit Transaction State
        await session.commitTransaction();
        
        // AUDIT LOG: Transfer execution confirmation tracking
        auditLogger.info(`Successfully transferred ₦${amount} from ${fromWalletNumber} to ${toWalletNumber}`, {
            userId: req.user.id,
            ipAddress: ipAddress,
            deviceInfo: deviceInfo
        });

        return res.status(200).json({
            status: "success",
            message: `You have successfully transferred ${amount} to wallet ${toWalletNumber}`,
            data: { reference }
        })

    } catch (e) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        // System exceptions handled via engineering audit logger pipeline
        auditLogger.error(`Transfer system core transaction runtime crash: ${e.message}`, {
            userId: req.user?.id || null,
            ipAddress: ipAddress,
            deviceInfo: deviceInfo
        });

        return res.status(500).json({
            status: "failed",
            message: "Something went wrong"
        })
    } finally {
        await session.endSession()
    }
}


const verificationController = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction();

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    try {
        const { reference } = req.query;

        const transaction = await transactionModel.findOne({ referenceId: reference }).session(session);
        if (!transaction) {
            await session.abortTransaction();

            // FRAUD LOG: Attempted polling anomalies for non-existent system references
            fraudLogger.warn(`Verification engine lookup failed: Transfer reference ${reference} not found`, {
                userId: req.user?.id || null,
                transactionId: null,
                status: "INVESTIGATING"
            });

            return res.status(404).json({
                status: "failed",
                message: "No such transaction is in existence"
            })
        }

        if (transaction.status === "SUCCESS") {
            await session.abortTransaction();

            // AUDIT LOG: Tracking routine historical lookups
            auditLogger.info(`Transfer verification processed: Reference ${reference} was historically completed`, {
                userId: req.user?.id || null,
                ipAddress: ipAddress,
                deviceInfo: deviceInfo
            });

            return res.status(200).json({
                status: "success",
                message: "Transaction verified successfully",
                data: transaction
            });
        }
        
        await session.commitTransaction();

    } catch (e) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        auditLogger.error(`Internal transfer verification subsystem failure: ${e.message}`, {
            userId: req.user?.id || null,
            ipAddress: ipAddress,
            deviceInfo: deviceInfo
        });

        return res.status(500).json({
            status: "failed",
            message: "Something went wrong"
        })
    } finally {
        await session.endSession()
    }
}

module.exports = { transferToWallet, verificationController };