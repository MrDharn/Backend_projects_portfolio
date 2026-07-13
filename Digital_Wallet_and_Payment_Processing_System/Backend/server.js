require("dotenv").config();
const express = require("express");

const { Server } = require("socket.io");
const server = require("http");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

//Using the socket io for real time update
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ["GET", "POST"],
  },
});

//link users with the socket instance
const activeUsers = new Set();

io.on("connection", (socket) => {
  console.log("Client connected: ${socket.id}");

  //when new users join the server

  socket.on("register_user", (userId) => {
    activeUsers.set(String(userId), socket.id);
    console.log(` User ${userId} registered to socket ${socket.id}`);
  });

  //instance for disconnection
  socket.on("disconnect", () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);

        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});
//Import functions
const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const fundwalletRoute = require("./routes/fundWalletRoute");
const withdrawfundsRoute = require("./routes/withdrawFundRoute");
const profileRoute = require("./routes/profileRoute");
const transferRoute = require("./routes/walletTransferRoute");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  ((req.io = io), (req.activeUsers = activeUsers));
  console.log(`Getting request from ${req.url} using the ${req.method}`);
  next();
});

//Routes=========================================================
app.get("/", (req, res) => {
  res.send("Digital Wallet and Payment Gateway");
});
app.use("/api/v1/auth", authRoutes);

//wallet Route
app.use("/api/v1/wallet", walletRoutes);

//deposit route
app.use("/api/v1/wallet/", fundwalletRoute);

//transfer route
app.use("/api/v1/wallet", withdrawfundsRoute);

//transfer to another wallet route
app.use("/api/v1/wallet", transferRoute);

//profile route
app.use("/api/v1/wallet", profileRoute);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`The server is running on PORT ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};

startServer();
