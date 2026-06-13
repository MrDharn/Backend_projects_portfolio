const productModel = require('../Model/Product')
const categoryModel = require('../Model/Category')
const supplierModel = require('../Model/Supplier')
const salesModel = require('../Model/Sale')

const getOverview = async (req, res)=>{
    try{
        const totalCategories = await categoryModel.countDocuments({});
        const totalProducts = await productModel.countDocuments({})
        const totalSupplier = await supplierModel.countDocuments({})
        const totalSales = await salesModel.countDocuments({})
        const totalRevenue = 20
        const totalProfit = await salesModel.aggregate([
            //Stage1
            {$match: {profit: "$profit"}}
        ])

        res.status(200).json({
            totalCategories: totalCategories,
            totalProducts: totalProducts,
            totalSupplier: totalSupplier,
            // totalSales: totalSales,
            // totalRevenue: totalRevenue,
            totalProfit: totalProfit,
            // lowStockProducts: lowStockProducts
        })
    }catch(e){
        console.error(e);
        res.status(500).json({
            status:"failed",
            message:"Something went wrong"
        })
    }
}

module.exports = getOverview