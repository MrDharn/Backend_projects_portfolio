require('dotenv').config()
const connectDB = require('./config/db')
const projectsData = require('./utils/seedProjects')
const projectModel = require('./models/projectModel')
const dns = require('dns')
dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])

const startServer = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        await projectModel.deleteMany()
        await projectModel.create(projectsData)
        console.log('success')
        process.exit(0)
    }catch(e){
        console.error(e)
        process.exit(1)
    }
}

startServer();

