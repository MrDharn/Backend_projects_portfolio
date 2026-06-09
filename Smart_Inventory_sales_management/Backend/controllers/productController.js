const productModel = require("../Model/Product");
const categoryModel = require('../Model/Category')
//post
const createProduct = async (req, res) => {
  try {
    const { productName, description, quantity, costPrice, sellingPrice } =
      req.body;
    if (
      !productName ||
      !description ||
      quantity === undefined ||
      costPrice === undefined ||
      sellingPrice === undefined
    )
      return res.status(403).json({
        status: "failed",
        message: "all the four fields are to be filled",
      });
    //Check if product is already in database

    const checkProduct = await productModel.findOne({ productName });

    //control its existence
    if (checkProduct)
      return res.status(400).json({
        status: "failed",
        message: "product is already in Database",
      });
    const newProduct = new productModel({
      productName,
      description,
      quantity,
      costPrice,
      sellingPrice,
    });

    await newProduct.save();
    res.status(201).json({
      status: "success",
      message: "product is created successfully",
      newProduct,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

//search for a product
const searchProduct = async (req, res) => {
  try {
    const { productToSearch } = req.query;
    const returnProduct = await productModel.find({
      productName: {
        $regex: productToSearch,
        $options: "i",
      },
    });
    if (returnProduct.length === 0)
      return res.status(404).json({
        status: "failed",
        message: "There is no such product",
      });

    res.status(200).json({
      status: "success",
      message: "Products Found",
      returnProduct,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

//filter products by category
const filterByCategory = async (req, res) => {
  try {
    const {categorySearch} = req.query;
    //check if the category Exist in my Category Database;
    const checkCategoryExistence = await categoryModel.findOne({categoryName: {
      $regex: categorySearch,
      $options: "i"
    }})

    //control

    if(!checkCategoryExistence) return res.status(404).json({
      status:"failed",
      message: "No such category"
    })
    console.log(checkCategoryExistence)
    
    const searchedCategory = await productModel.find({category: checkCategoryExistence._id})
    if(searchedCategory.length === 0) return res.status(404).json({
      status:"failed",
      message: "Category item is empty"
    })

    console.log(searchedCategory)
    res.status(200).json({
      status: "success",
      message: "Found",
      searchedCategory,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: " failed",
      message: "Something went wrong",
    });
  }
};

//get Products base on Quantity if < 10;
const getLowStockedProducts = async (req, res) => {
  try {
    const lowStockedProducts = await productModel.find({
      quantity: { $lt: 10 },
    });
    if (lowStockedProducts.length === 0)
      return res.status(404).json({
        status: "failed",
        message: "There is no Low stock currently",
      });

    res.status(200).json({
      status: "success",
      message: "Low stock Products fetched successfully",
      lowStockedProducts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};

//get all products

const allProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (products.length === 0)
      return res.status(404).json({
        status: "failed",
        message: "there is no product available",
      });
    res.status(200).json({
      status: "success",
      message: "Fetched successfully",
      products,
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
    if (!product)
      return res.status(404).json({
        status: "failed",
        message: "product could not be found",
      });

    res.status(200).json({
      status: "success",
      message: "product found",
      product,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

//Edit product Details
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      productName,
      category,
      description,
      quantity,
      costPrice,
      sellingPrice,
      supplier,
      createdBy,
    } = req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      {
        productName,
        category,
        description,
        quantity,
        costPrice,
        sellingPrice,
        supplier,
        createdBy,
      },
      { returnDocument: "after" },
    );

    if (!updatedProduct)
      return res.status(404).json({
        status: "failed",
        message: "suppplier could not be found",
      });

    res.status(200).json({
      status: "succes",
      message: "updated Successsfully",
      updatedProduct,
    });
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
    const productId = req.params.id;
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct)
      return res.status(404).json({
        status: "failed",
        message: "Such product does not exist",
      });

    res.status(200).json({
      status: "success",
      message: "product is deleted",
      deletedProduct,
    });
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
  filterByCategory,
  searchProduct,
  getLowStockedProducts,
};
