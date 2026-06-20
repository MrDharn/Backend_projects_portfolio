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
        

        const productSalesHistory = await salesModel.aggregate([
            //Stage1
            {$group:{_id : null, 
                totalProfit: {$sum : "$profit"},
                totalSales: {
                    $sum: "$quantitySold"
                },
                totalRevenue:{
                    $sum : "$totalAmount"
                }
            }}
        ])

        const TotalQuantitySold = productSalesHistory.length === 0 ? 0 : productSalesHistory[0].quantitySold
        const totalProfitValue = productSalesHistory.length === 0 ? 0 : productSalesHistory[0].totalProfit
        const totalRevenue = productSalesHistory.length === 0 ? 0 : productSalesHistory[0].totalRevenue

       
        
    /**
     * 
     * GET LOW STOCKs
     */

    const lowStockProducts = await productModel.aggregate([
        //stage
        {$match: {
            lowStockProducts: {$lt: 10}
        }}
    ])
    
    const getLowStockProduct = lowStockProducts.length === 0 ? 0: lowStockProducts[0].lowStockProducts
        res.status(200).json({
            totalCategories: totalCategories,
            totalProducts: totalProducts,
            totalSupplier: totalSupplier,
            totalSales: TotalQuantitySold,
            totalRevenue: totalRevenue,
            totalProfit: totalProfitValue,
            lowStockProducts: getLowStockProduct
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