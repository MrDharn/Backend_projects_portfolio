const productModel = require('../Model/Product');
//post 
const createProduct = async (req, res) => {
  try {
    const { productName, category, description,quantity,costPrice,sellingPrice,supplier, createdBy} = req.body;
    if (!productName||!category||!description||!quantity||!costPrice||!sellingPrice||!supplier||!createdBy)
      return res.status(403).json({
        status: "failed",
        message: "all the four fields are to be filled",
      });
    //Check if product is already in database

    const checkProduct = await productModel.findOne({email});

    //control its existence
    if (checkProduct)
      return res.status(400).json({
        status: "failed",
        message: "product is already in Database",
      });
    const newProduct = new productModel({ productName, phoneNumber, email, address });

    await newProduct.save();
    res.status(201).json({
      status: "success",
      message: "product is created successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

const allProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({
      status: "success",
      message: "Fetched successfully"
    });
  } catch (e) {
     console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

//get a single category

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);
    if(!product) return res.status(404).json({
        status:"failed",
        message:"product could not be found"
    })

    res.status(200).json({
        status:"success",
        message: "product found",
        product
    })
  } catch (e) {
     console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

//patch category
const updateproduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {productName, category, description,quantity,costPrice,sellingPrice,supplier, createdBy} = req.body
    const updatedProduct = await productModel.findByIdAndUpdate(productId, {productName, category, description,quantity,costPrice,sellingPrice,supplier, createdBy},{returnDocument: 'after'});

    if(!updatedProduct) return res.status(404).json({
        status:"failed",
        message:"suppplier could not be found"
    })

    res.status(200).json({
        status:"succes",
        message:"updated Successsfully",
        updatedProduct
    })
  } catch (e) {
     console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

//delete category
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if(!deletedProduct) return res.status(404).json({
        status:"failed",
        message:"Such product does not exist"
    })

    res.status(200).json({
        status:"success",
        message:"product is deleted",
        deletedproduct

    })
  } catch (e) {
     console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProduct,
  allProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
