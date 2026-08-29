const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Types.ObjectId,
      ref: "wallet",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    type_of_transaction: {
      type: String,
      enum: [
        "DEPOSIT",
        "WITHDRAWAL",
        "MERCHANT_PAYMENT",
        "DEBIT",
        "CREDIT",
        "TRANSFER",
      ],
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REVERSED"],
      default: "PENDING",
    },
    referenceId: {
      type: String,
    },
    paystackReference: {
      type: String,
      default: null,
    },

    paystackTransferCode: {
      type: String,
      default: null,
    },
    recipientCode: {
      type: String,
      default: null,
    },
    bankName: { 
        type: String, default: null
     },
    bankAccount: { 
        type: String, default: null 
    },
    description: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("transaction", TransactionSchema);
