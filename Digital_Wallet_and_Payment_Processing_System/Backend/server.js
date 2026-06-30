require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const dns = require('dns')
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

//Import functions
const connectDB = require('./utils/db')
const authRoutes = require('./routes/authRoutes')
const walletRoutes = require('./routes/walletRoutes')

app.use(express.json());

app.use((req, res, next)=>{
    console.log( `Getting request from ${req.url} using the ${req.method}`);
    next();
})

//Routes=========================================================
app.get('/', (req, res)=> {
    res.send("Digital Wallet and Payment Gateway")
})
app.use('/api/v1/auth', authRoutes)

//wallet Route
app.use('/api/v1/wallet', walletRoutes)
const startServer = async ()=>{
    try{
        await connectDB();
        app.listen(PORT, ()=> {
            console.log(`The server is running on PORT ${PORT}`)
        })
    }catch(e){
        console.error(e);
    }
}

startServer()