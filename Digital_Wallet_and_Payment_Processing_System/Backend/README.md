# 💳 Digital Wallet & Payment Processing System

A secure backend REST API built with **Node.js**, **Express.js**, **MongoDB**, and **Paystack API**. This project simulates the core functionalities of a modern digital wallet, allowing users to securely manage funds, transfer money, and withdraw to bank accounts.

## ✨ Features

### Authentication
- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Change password
- Protected routes

### Wallet Management
- Automatic wallet creation upon registration
- Unique wallet number generation
- Wallet balance management
- Create transaction PIN
- Change transaction PIN
- Secure PIN hashing

### Wallet Funding
- Fund wallet using Paystack
- Payment initialization
- Payment verification
- Automatic wallet credit
- Transaction recording

### Wallet Transfers
- Wallet-to-wallet transfers
- PIN verification before transfers
- Balance validation
- Self-transfer prevention
- MongoDB session transactions for atomic operations
- Transaction history

### Bank Withdrawals
- Bank account verification
- Resolve account details
- Create transfer recipient
- Withdraw funds to Nigerian bank accounts
- Transfer verification
- Automatic reversal on failed transactions

### Transactions
- Deposit
- Withdrawal
- Wallet transfer
- Transaction history
- Pending, successful, and failed transaction tracking
- Unique transaction reference generation

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Axios
- Nodemailer
- Paystack API
- winston
- winston-transport
---

## 📁 Project Structure

```
Backend/
│
├── Controllers/
├── Middleware/
├── Models/
├── Routes/
├── Utils/
├── Config/
├── server.js
├── package.json
└── .env
```

---

## 🔐 Security Features

- JWT Authentication
- Password hashing
- PIN hashing
- Protected routes
- MongoDB transactions (sessions)
- Payment reference verification
- Balance validation
- Duplicate transaction prevention
- Secure Paystack API integration

---

## 🌍 External Services

- **Paystack API**
  - Wallet funding
  - Bank account resolution
  - Bank transfers
  - Payment verification
  - Transfer recipient creation

- **Nodemailer**
  - Email notifications

---

## 📌 API Modules

### Authentication
- Register User
- Login User
- Change Password

### Wallet
- View Wallet
- Create PIN
- Change PIN

### Payments
- Fund Wallet
- Verify Payment

### Transfers
- Wallet to Wallet Transfer

### Withdrawals
- Withdraw to Bank Account
- Verify Withdrawal

### Transactions
- Transaction History
- Transaction Details

---

## 🎯 Learning Objectives

This project demonstrates practical backend engineering concepts including:

- REST API Development
- Authentication & Authorization
- Secure Password & PIN Management
- Payment Gateway Integration
- Financial Transaction Processing
- MongoDB Transactions (Sessions)
- Error Handling
- Clean Architecture
- Third-party API Integration
- Backend Security Best Practices

---

## 🚀 Future Improvements

- Refresh Token Authentication
- Email Verification (Implemented)
- KYC Verification
- Two-Factor Authentication (2FA)
- Beneficiary Management
- Webhooks
- Redis Caching
- Rate Limiting
- Audit Logs (done and Added) and fraudLogs
- Docker Support
- Unit & Integration Tests
- CI/CD Pipeline

---

## 👨‍💻 Author

**Oluwatosin Daniel**

Backend Developer passionate about building secure, scalable backend systems and fintech solutions.

**GitHub:** https://github.com/MrDharn

**Live on Render:** https://backend-projects-portfolio-8axh.onrender.com/
---


