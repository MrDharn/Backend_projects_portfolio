require('dotenv').config()
const express = require('express')
const cors = require('cors')
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
const fundwalletRoute = require('./routes/fundWalletRoute')
const withdrawfundsRoute = require('./routes/withdrawFundRoute')
const profileRoute = require('./routes/profileRoute')
const transferRoute = require('./routes/walletTransferRoute')

app.use(cors())
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

//deposit route
app.use('/api/v1/wallet/', fundwalletRoute)

//transfer route
app.use('/api/v1/wallet', withdrawfundsRoute)

//transfer to another wallet route
app.use('/api/v1/wallet', transferRoute)

//profile route
app.use('/api/v1/wallet', profileRoute)

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