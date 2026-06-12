const stockMovementModel = require("../Model/stockMovement");
const productModel = require("../Model/Product");

const getAllStockMovement = async (req, res) => {
  try {
    const stockMovement = await stockMovementModel
      .find({})
      .populate("product", "productName -_id email")
      .populate("performedBy", "-_id username email");
    if (stockeMovement.length === 0)
      return res.status(404).json({
        status: "Failed",
        message: "There is no stock movement currently",
      });

    res.status(200).json({
      status: "Success",
      message: "Here is the stock MOvement",
      stockMovement,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

/**
 * GET STOCK MOVEMENT BASE ON ID
 */
const getSingleStockMovement = async (req, res) => {
  try {
    const stockMovementId = req.params.id;
    const stockMovement = await stockMovementModel
      .findById(stockMovementId)
      .populate("product", "productName -_id email")
      .populate("performedBy", "-_id username email");

    if (!stockMovement)
      return res.status(404).json({
        status: "failed",
        message: "There is no stock Movement for this product",
      });

    res.status(200).json({
      status: "success",
      message: "Fetched successfully",
      stockMovement,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

/**
 *
 * HERE WE RETURN STOCK MOVEMENT BASE ON PRODUCT ID;
 */

const getProductStockMovement = async (req, res) => {
  try {
    const productId = req.params.id;
    const checkProductAvailability = await productModel.findById(productId);

    if (!checkProductAvailability)
      return res.status(404).json({
        status: "failed",
        message: "Product Id does not exist",
      });

    const stockMovement = await stockMovementModel
      .findOne({ product: productId })
      .populate("product", "productName -_id email")
      .populate("performedBy", "-_id username email");

    if (!stockMovement)
      return res.status(404).json({
        status: "failed",
        message: "No Stock Movement for such Product",
      });

    res.status(200).json({
      status: "success",
      message: "Stock movement fetched successfully",
      stockMovement,
    });
  } catch (e) {
    console.error(e);
    res.status(500).jsons({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getAllStockMovement,
  getSingleStockMovement,
  getProductStockMovement
}