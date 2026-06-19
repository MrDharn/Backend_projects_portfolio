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
          product: "$productDetails.productName",
          totalQuantitySold: 1,
        },
      },
      //stage 6
      {$limit: 10}
    ]);

    res.status(200).json({
      status: "success",
      message:"successful!!! ",
      bestSellingProduct: bestSellingProduct.length === 0 ? {
        productName: null,
        totalQuantitySold: 0,
      } : bestSellingProduct
    })
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

// DAILY SALES REPORT
/**
 *
 * USING ONE ENDPOINT .... BASE ON DATE SELECTED BY THE USER
 */

const getReport = async (req, res) => {
  try {
    const selectedDate = req.query.date ? new Date(req.query.date): new Date();
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(startOfDay, endOfDay);

    const report = await salesModel.aggregate([
      //stage1
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },

      //stage 2
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
      {$limit: 10}
    ]);

    const reportDetails =
      report.length === 0
        ? {
            totalTransactions: 0,
            totalItemsSold: 0,
            totalRevenue: 0,
            totalProfit: 0,
          }
        : report[0];

    res.status(200).json({
      status: "success",
      message: "Reports fetched successfully",
      report: reportDetails,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong!!!!",
    });
  }
};

/**
 * ENDPOINT TO GET THE BEST STAFF (BASE ON PRODUCTS AND REVENUE)
 *
 */

const getBestStaff = async(req, res)=>{
    try{

        const bestStaff = await salesModel.aggregate([
            //stage 1
            {$group: {
                _id: "$soldBy",
                totalRevenue: {
                    $sum: "$totalAmount"
                },
                totalQuantity: {
                    $sum : "$quantitySold"
                }
            }},
            {$sort: {
                totalRevenue: -1
            }},

            //STAGE 2

            {$lookup: {
                from: "users",
                localField: '_id',
                foreignField: '_id',
                as: "userDetails"
            }},

            //STAGE 3

            {$unwind: "$userDetails"},

            //STAGE 4
            {$project: {
                staffName: "$userDetails.username",
                totalRevenue: 1,
                totalQuantity: 1
            }},
            //STAGE 5

            {$limit: 5}
        ])
        // const staff = getBestStaff.length === 0 ? NULL : bestStaff[0]

        res.status(200).json({
            status:"success",
            message: "Best staff here ",
            //In order to see all other staffs
            bestStaff: bestStaff
        })
    }catch(e){
        console.error(e);
        res.status(500).json({
            status:"failed",
            message: "Something went wrong"
        })
    }
};


module.exports = { getBestSellingProduct, getReport , getBestStaff};
