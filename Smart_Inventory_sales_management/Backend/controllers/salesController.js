//import product model
const productModel = require("../Model/Product");
const salesModel = require("../Model/Sale");
const stockMovementModel = require('../Model/stockMovement')

//create sales controller
const createSales = async (req, res) => {
  try {
    const { product, quantitySold, customerName} = req.body;

    //make sure product , quantitySold and customerName are not empty
    if (!product || !customerName || !Array.isArray(product) || product.length === 0)
      return res.status(400).json({
        status: "failed",
        message: "Bad request, Fields can not be empty",
      });

      /**
       * Making it possible to accept multiple products at once by iteratin over
       */

      const createdSales = [];
      const updatedProducts = []

      for(let item of product){
        /**
         * //Check product Availability in Database
         *check is the product is not out of stock
         *Check if the number to be sold is greater than the current number of quantity
         */
        const{productName, quantitySold} = item

        const checkProductAvailability = await productModel.findOne({productName: productName});
        if(!checkProductAvailability) return res.status(404).json({status: "failed", message: "No such Product"});


        if (checkProductAvailability.quantity === 0)
          return res.status(404).json({
            status: "failed",
            message: "Out of Stock",
          });

          if (checkProductAvailability.quantity < quantitySold)
            return res.status(400).json({
              status: "failed",
              message: "Insufficient stock",
            });
            const unitPrice = checkProductAvailability.sellingPrice;
            const oldQuantity = checkProductAvailability.quantity;
            //Let us add profit made on each sales to the database
            const profit =
            (unitPrice - checkProductAvailability.costPrice) * quantitySold;
            //Now lets create sales
            const newSales = new salesModel({
              product: checkProductAvailability._id,
              quantitySold,
              unitPrice,
              totalAmount: quantitySold * unitPrice,
              profit,
              customerName,
              soldBy: req.userInfo._id,
            });

            await newSales.save();
            createdSales.push(newSales);


            //Update the product Stocks
            const updatedProduct = await productModel.findByIdAndUpdate(
              checkProductAvailability._id,
              {
                quantity: oldQuantity - quantitySold,
              },
              { returnDocument: "after" },
            );

            updatedProducts.push(updatedProduct);

            /**
             * 
             * THIS IS FOR THE STOCK MOVEMENT UPDATE
             */
            const newStockMovement = new stockMovementModel({
              product: checkProductAvailability._id,
              movementType: "OUT",
              quantity: quantitySold,
              performedBy: req.userInfo._id,
            })
        
            await newStockMovement.save();

      }
    res.status(201).json({
      status: "success",
      sales: createdSales,
      updatedProduct: updatedProducts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

//get all Sales
const allSales = async (req, res) => {
  try {
    const sales = await salesModel
      .find({})
      .populate("product", "-_id productName sellingPrice")
      .populate("soldBy", "username email -_id");

    if (sales.length === 0)
      return res.status(404).json({
        status: "failed",
        message: "No sale has been made",
      });

    res.status(200).json({
      status: "success",
      message: "Sales are being fetched",
      sales,
      nTH: sales.length,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

//get single sale by Id
const getSingleSales = async (req, res) => {
  try {
    const salesId = req.params.id;

    //find by Id in salesModel
    const sale = await salesModel
      .findById(salesId)
      .populate("product", "-_id productName sellingPrice")
      .populate("soldBy", "username email -_id");

    if (!sale)
      return res.status(400).json({
        status: "failed",
        message: "No such sales have been made",
      });

    res.status(200).json({
      status: "success",
      message: "sales Fetched successfully!!!",
      sale,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};
module.exports = { createSales, allSales, getSingleSales };
