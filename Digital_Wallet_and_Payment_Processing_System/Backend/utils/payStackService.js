const axios = require("axios");
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Shared headers configurator to stay DRY and fix the "Bearers" typo
const getHeaders = () => ({
  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
});

/**
 * INITIATION OF TRANSACTION IN ORDER TO FUND WALLET
 */
const initiateTransaction = async (email, amount, reference, callback_url) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        reference,
        callback_url,
      },
      { headers: getHeaders() },
    );
    return response.data;
  } catch (e) {
    throw new Error(
      `Paystack Initialization Error: ${
        e.response?.data?.message || e.message
      }`,
    );
  }
};

/**
 * GET BANK CODE FROM THE NAME
 */
const getBankCode = async (bankName) => {
  try {
    const response = await axios.get("https://api.paystack.co/bank", {
      headers: getHeaders(),
    });
    // console.log(response.data.data)
    const banks = response.data.data;

    const target = bankName.toLowerCase().trim();

    const bank =
      banks.find(
        (b) =>
          b.name.toLowerCase() === target || b.slug.toLowerCase() === target,
      ) || banks.find((b) => b.name.toLowerCase().includes(target));

    if (!bank) throw new Error("Bank Name not found");
    // console.log(bank, bank.code)
    return bank.code;
  } catch (e) {
    throw new Error(
      `Get Bankcode Error: ${e.response?.data?.message || e.message}`,
    );
  }
};

/**
 * INITIATE WITHDRAWAL (TRANSFER)
 */
const initiateWithdrawal = async (amount, recipient, reference, reason) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: amount * 100,
        recipient: recipient,
        reference: reference,
        reason: reason,
      },
      { headers: getHeaders() },
    );
    return response.data;
  } catch (e) {
    throw new Error(
      `Withdrawal Error: ${e.response?.data?.message || e.message}`,
    );
  }
};

/**
 * VERIFY TRANSFER REFERENCE
 * Note: For transfers, Paystack uses /transfer/verify/:reference
 */
const verifyReferenceForDeposit = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: getHeaders() },
    );
    return response.data;
  } catch (e) {
    throw new Error(
      `Verification Error: ${e.response?.data?.message || e.message}`,
    );
  }
};
const verifyReferenceForTransfer = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transfer/verify/${reference}`,
      { headers: getHeaders() },
    );
    return response.data;
  } catch (e) {
    throw new Error(
      `Verification Error For Transfer Reference: ${
        e.response?.data?.message || e.message
      }`,
    );
  }
};

/**
 * CREATE RECIPIENT/BENEFICIARY
 */
const initiateRecipient = async (name, accountNumber, bankCode) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: name,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      },
      { headers: getHeaders() },
    );

    return response.data.data.recipient_code;
  } catch (e) {
    throw new Error(
      `Recipient Creation Error: ${e.response?.data?.message || e.message}`,
    );
  }
};

/**
 * RESOLVE ACCOUNT NUMBER
 */

const resolveAccountNumber = async (accountNumber, bankCode) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: getHeaders(),
      },
    );
    // console.log(response.data.data.account_name);
    return response.data.data.account_name;
  } catch (e) {
    throw new Error(
      `Resolving Account Number/Name Error: ${
        e.response?.data?.message || e.message
      }`,
    );
  }
};
module.exports = {
  initiateTransaction,
  verifyReferenceForDeposit,
  verifyReferenceForTransfer,
  initiateWithdrawal,
  getBankCode,
  initiateRecipient,
  resolveAccountNumber,
};
