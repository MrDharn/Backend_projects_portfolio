const salesModel = require('../Model/Sale')
const productModel = require('../Model/Product')

const getBestSellingProduct = async(req, res)=> {
    try{
        const bestSellingProduct = await salesModel.aggregate([
            //stage 1
            {$group: {
                _id: '$product',
                totalQuantitySold: {
                    $sum: "$quantitySold"
                }
            }},
            //stage 2
            {$sort: {totalQuantitySold: -1}},
            
            //stage 3
            {$lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails'
            }},
            //stage4

            {$unwind: '$productDetails'},

            //stage 5

            {$project: {
                _id: 0,
                product: "$productDetails.name",
                totalQuantitySold: 1
            }}
        ])
    }catch(e){
        console.error(e);
        res.status(500).json({
            status:"failed",
            message: "Something went wrong"
        })
    }
}

module.exports = {getBestSellingProduct}