const transactionModel = require("../Models/Transaction")
const userModel = require("../Models/Transaction")

const getAllTransactionHistory = async(req, res)=>{
    try{
        const history = await transactionModel.find({});
        if(history.length === 0) return res.status(404).json({
            status: "failed",
            message: "No Transaction has been performed"
        })
        res.status(200).json({
            status: 'success',
            message: "Transaction history is Fetched"
        })

    }catch(e){
        res.status(500).json({
            status: "failed",
            message: "Something went Wrong"
        })
    }
}


module.exports = {getAllTransactionHistory}