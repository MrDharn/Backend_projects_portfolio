const salesModel = require("../Model/Sale");
const productModel = require("../Model/Product");

const getBestSellingProduct = async (req, res) => {
  try {
    const bestSellingProduct = await salesModel.aggregate([
      //stage 1
      {
        $group: {
          _id: "$product",
          totalQuantitySold: {
            $sum: "$quantitySold",
          },
        },
      },
      //stage 2
      { $sort: { totalQuantitySold: -1 } },

      //stage 3
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      //stage4

      { $unwind: "$productDetails" },

      //stage 5

      {
        $project: {
          _id: 0,
          product: "$productDetails.name",
          totalQuantitySold: 1,
        },
      },
    ]);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};


// DAILY SALES REPORT
const getDailyReport = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dailyReport = await salesModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalTransactions: {
            $sum: 1,
          },
          totalItemsSold: {
            $sum: "$quantitySold",
          },
          totalRevenue: {
            $sum: "$totalAmount",
          },
          totalProfit: {
            $sum: "$profit",
          },
        },
      },
    ]);

    const result =
      dailyReport.length === 0
        ? {
            totalTransactions: 0,
            totalItemsSold: 0,
            totalRevenue: 0,
            totalProfit: 0,
          }
        : getDailyReporteport[0];

    res.status(200).json({
      status: "success",
      message: "Daily report fetched successfully",
      report: result,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

module.exports = { getBestSellingProduct, getDailyReport };
