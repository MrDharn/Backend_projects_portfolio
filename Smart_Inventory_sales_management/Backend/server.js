require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors')
//use DNS
const dns = require('dns');
//set dns Server
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])
// call your Database
const connectToDB = require('./Database/db');
const authRoute = require('./Routes/authRoute');
const userManagementRoute = require('./Routes/userManagementRoute');
const categoryRoute = require('./Routes/categoryRoutes');
const supplierRoute = require('./Routes/supplierRoute');
const productRoute = require('./Routes/productRoutes');
const salesRoute = require('./Routes/salesRoute');
const stockMovementRoute = require('./Routes/stockMovementRoute');
const dashBoardRoute = require('./Routes/dashboardRoute');
const reportRoute = require('./Routes/reportRoute');
//declare your port
const PORT = process.env.PORT || 3000

//use cors
app.use(cors())
//Middleware
app.use(express.json());

//Middleware to track where error occurs
app.use((req, res, next)=> {
    console.log(`This endpoint is from ${req.url} using the ${req.method} VERB`);
    next();
})

//MY ROUTES
app.get('/', (req,res)=> {
    res.send("Smart Inventory Sales Management")
})

//authController route
app.use('/api/v1/auth', authRoute)

//userManagement Route
app.use('/api/v1/users', userManagementRoute);

//category routes
app.use('/api/v1/categories', categoryRoute);

//suppliers route
app.use('/api/v1/suppliers', supplierRoute)

//product management route
app.use('/api/v1/products', productRoute)

//sales routes
app.use('/api/v1/sales', salesRoute)

//dashboard Route
app.use('/api/v1/dashboard', dashBoardRoute)

//Stock movement route
app.use('/api/v1/stock-movement', stockMovementRoute)

//report route
app.use('/api/v1/report/', reportRoute)
//listen to express app
const startSever = async()=>{
    try{
        await connectToDB();
        app.listen(PORT, ()=>{
            console.log(`The server has started running on the port ${PORT}`);
        })
    } catch(e){
        console.error(e);
    }
}

startSever();