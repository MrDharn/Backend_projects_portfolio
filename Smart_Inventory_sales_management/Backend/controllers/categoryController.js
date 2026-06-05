const categoryModel = require("../Model/Category");
//post categories
const createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    if (!categoryName || !description)
      return res.status(403).json({
        status: "failed",
        message: "You provided an empty box",
      });
    //Check if category is already in database

    const checkCategory = await categoryModel.findOne({ categoryName });

    //control its existence
    if (checkCategory)
      return res.status(400).json({
        status: "failed",
        message: "Category is already in Database",
      });
    const newCategory = new categoryModel({ categoryName, description });

    await newCategory.save();
    res.status(201).json({
      status: "success",
      message: "Category is created successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

const allCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
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

const getSingleCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await categoryModel.findById(categoryId);
    if(!category) return res.status(404).json({
        status:"failed",
        message:"Such category could not be found"
    })

    res.status(200).json({
        status:"success",
        message: "Category found"
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
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const {categoryName, description} = req.body
    const updatedCategory = await categoryModel.findByIdAndUpdate(categoryId, {categoryName, description},{returnDocument: 'after'});

    if(!updatedCategory) return res.status(404).json({
        status:"failed",
        message:"Category could not be found"
    })

    res.status(200).json({
        status:"succes",
        message:"updated Successsfully",
        updatedCategory
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
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id
    const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

    if(!deletedCategory) return res.status(404).json({
        status:"failed",
        message:"Such category does not exist"
    })

    res.status(200).json({
        status:"success",
        message:"category is deleted",
        deletedCategory

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
  createCategory,
  allCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
