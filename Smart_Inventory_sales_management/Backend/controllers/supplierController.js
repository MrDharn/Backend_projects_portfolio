const supplierModel = require('../Model/Supplier');
//post categories
const createSupplier = async (req, res) => {
  try {
    const { supplierName, phoneNumber,email, address} = req.body;
    if (!supplierName||!phoneNumber||!email||!address)
      return res.status(403).json({
        status: "failed",
        message: "all the four fields are to be filled",
      });
    //Check if supplier is already in database

    const checkSupplier = await supplierModel.findOne({email});

    //control its existence
    if (checkSupplier)
      return res.status(400).json({
        status: "failed",
        message: "Supplier is already in Database",
      });
    const newSupplier = new supplierModel({ supplierName, phoneNumber, email, address });

    await newSupplier.save();
    res.status(201).json({
      status: "success",
      message: "Supplier is created successfully",
      newSupplier
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

const allSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.find({});

    if(suppliers.length === 0) return res.status(404).json({
      status:"failed",
      message: "No supplier in the databasen yet"
    })
    res.status(200).json({
      status: "success",
      message: "Fetched successfully",
      suppliers
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

const getSingleSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;

    const supplier = await supplierModel.findById(supplierId);
    if(!supplier) return res.status(404).json({
        status:"failed",
        message:"supplier could not be found"
    })

    res.status(200).json({
        status:"success",
        message: "Supplier found",
        supplier
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
const updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const {supplierName, email, phoneNumber,address} = req.body
    const updatedSupplier = await supplierModel.findByIdAndUpdate(supplierId, {supplierName, email, phoneNumber, address},{returnDocument: 'after'});

    if(!updatedSupplier) return res.status(404).json({
        status:"failed",
        message:"suppplier could not be found"
    })

    res.status(200).json({
        status:"succes",
        message:"updated Successsfully",
        updatedSupplier
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
const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id
    const deletedSupplier = await supplierModel.findByIdAndDelete(supplierId);

    if(!deletedSupplier) return res.status(404).json({
        status:"failed",
        message:"Such supplier does not exist"
    })

    res.status(200).json({
        status:"success",
        message:"supplier is deleted",
        deletedSupplier

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
  createSupplier,
  allSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
};
