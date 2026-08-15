const transactionModel = require("../Models/Transaction");

const getAllTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const history = await transactionModel
      .find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Transaction history fetched successfully",
      transactions: history,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

module.exports = { getAllTransactionHistory };