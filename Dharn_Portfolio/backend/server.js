require('dotenv').config();
const express = require("express"); 
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require('compression')
const cookieParser = require('cookie-parser')

const dns = require('dns')
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])
//node packages

//
const allowedOrigins = [
  "http://localhost:5173",
  "dharnportfolio-8whle6znr-dharns-projects.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH","DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(helmet());
app.use(compression())
app.use(morgan("dev"));
app.use(cookieParser())

app.use(express.json());

app.use((req, res, next)=>{
    console.log(`getting request from ${req.url} using ${req.method}`)
    next()
})
//call for routes
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const projectRoute = require('./routes/projectRoute');
const resumeRoute = require('./routes/resumeDownloadRoute');
const githubRoute = require('./routes/githubRoute');
const authRoute = require('./routes/authRoute')
const adminRoute = require('./routes/adminRoute')


const PORT = process.env.PORT || 3000

//Routes Call

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio API Running",
  });
});


app.use("/api/v1/contact", contactRoutes)

app.use('/api/v1/projects', projectRoute)

app.use('/api/v1/resume',resumeRoute)

app.use("/api/v1/github", githubRoute)

app.use("/api/v1/auth", authRoute)

app.use("/api/v1/admin", adminRoute)

// app.use(notFound)
// app.use(errorHandler)

const startServer = async()=>{
    try{
        await connectDB()

        app.listen(PORT, ()=>{
            console.log(`The server is running on the PORT ${PORT}`)
        })
    }catch(e){
        console.error(e)
    }
}

startServer()