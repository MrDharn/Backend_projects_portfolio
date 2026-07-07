const axios = require("axios");
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

/**
 * INITIATION OF TRANSACTION IN ORDER TO FUND WALLET
 */
const initiateTransaction = async (email, amount, reference) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        reference,
        callback_url,
      },
      {
        headers: {
          Authorization: `Bearers ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (e) {
    throw new Error(`This is error is coming from paystack , ${e}`);
  }
};

/**
 *  GET BANK CODE FROM THE NAME PASSED TO REQEST.BODY
 */

const getBankCode = async (bankName) => {
  try {
    const response = await axios.get("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearers ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const banks = await response.data.data;
    const bank = banks.find(
      (b) => b.name.toLowerCase() === bankName.toLowerCase(),
    );

    if (!bank) throw new Error("Bank Name is not found");

    return bank.code;
  } catch (e) {
    throw new Error(`This is error from getBank , ${e}`);
  }
};

/**
 *INITIATE WITHDRAWAL
 */

const initiateWithdrawal = async (
  amount,
  recipient,
  reference,
  reason,
) => {
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
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-type": "application.json",
        },
      },
    );

    return response.data;

    if (!response.ok) throw new Error("data could not be fetched");
  } catch (e) {
    throw new Error(`Error from Withdrawal process, ${e}`);
  }
};
/**
 *
 * VERIFY REFERENCE
 */
const verifyReference = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearers ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (e) {
    throw new Error(`This is error from my verification, ${e}`);
  }
};

/**
 * CREATE RECIPIENT/BENEFICIARY
 */

const initiateRecipient = async(type, name, accountNumber, bankCode, currency)=>{
    try{
        const response = await axios.post("https://api.paystack.co/transferrecipient", {
            type: "nuban",
            name: name,
            account_Number: accountNumber,
            bank_code: bankCode,
            currency: "NGN"
        },{
            headers:{
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json"
            }
        })
        if(!response.ok) throw new Error("initiateRecipient just Failed")

        return response.data.recipient_code
    }catch(e){
        throw new Error(`This is error from initiateRecipient`, e)
    }
}

module.exports = {
  initiateTransaction,
  verifyReference,
  initiateWithdrawal,
  getBankCode,
  initiateRecipient
};
