const mongoose = require('mongoose');
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database is connected successfully!!')
    }catch(e){
        console.error("Database could not be connected", e);
        process.exit(1)
    }
}
module.exports = connectDB