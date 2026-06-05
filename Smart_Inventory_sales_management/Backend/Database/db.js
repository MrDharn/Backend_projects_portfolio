const mongoose = require('mongoose')
const connectToDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database is connected successfully')
    }catch(e){
        console.error(e);
        process.exit(1);
    }
}

module.exports = connectToDB;