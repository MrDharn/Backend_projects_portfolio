/**
 * TRANSFER FROM WALLET TO WALLET
 */
const userModel = require('../Models/Users');
const walletModel = require("../Models/Wallet");
const transactionModel = require("../Models/Transaction");
const generateReference = require("../utils/generateReference");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { auditLogger, fraudLogger } = require('../utils/logger');

const transferToWallet = async (req, res) => {
    const session = await mongoose.startSession();
    
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    try {
        let { fromWalletNumber, toWalletNumber, amount, pin } = req.body;

        // 1. Inputs validation
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

        // Start transaction AFTER fast local validations
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

        // 3. Verify PIN early
        if (!fromWallet.isPinSet) {
            await session.abortTransaction();
            return res.status(403).json({
                status: "failed",
                message: "You have not set your transaction pin"
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
            message: `You have successfully transferred ${amount} to wallet ${toWalletNumber}`,
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

module.exports = {transferToWallet}