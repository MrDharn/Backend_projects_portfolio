# Smart Inventory and Sales Management System API

## Overview

The Smart Inventory and Sales Management System is a RESTful API built with Node.js, Express.js, MongoDB, and Mongoose. The system is designed to help businesses efficiently manage products, categories, suppliers, inventory, sales transactions, stock movements, and business reports.

The application supports authentication and role-based access control, ensuring that only authorized users can perform specific operations.

---

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Role-Based Access Control (Admin, Staff)

### Category Management

* Create Category
* View Categories
* Update Category
* Delete Category

### Supplier Management

* Create Supplier
* View Suppliers
* Update Supplier
* Delete Supplier

### Product Management

* Create Product
* View Products
* Search Products
* Filter Products by Category
* Update Product Information
* Delete Products
* Low Stock Monitoring

### Sales Management

* Record Sales
* Track Sales History
* Calculate Revenue Automatically
* Calculate Profit Automatically
* Reduce Inventory After Sales

### Inventory Management

* Product Restocking
* Stock Movement Tracking
* Inventory Monitoring

### Reports & Analytics

* Dashboard Overview
* Daily Sales Reports
* Best Selling Products Report
* Staff Performance Report
* Revenue Tracking
* Profit Tracking

---

## Technology Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcryptjs

### API Testing

* Postman

---

## Base URL

http://localhost:3000/api

---

## Authentication

Protected routes require a valid JWT token.

Example:

Authorization: Bearer YOUR_JWT_TOKEN

---

## User Roles

| Role  | Permissions                  |
| ----- | ---------------------------- |
| Admin | Full access to all resources |
| Staff | Manage sales and inventory   |
| User  | Limited access               |

---

# API Endpoints

## Authentication

### Register User

POST /api/auth/register

#### Request Body

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456",
  "role": "staff"
}
```

### Login User

POST /api/auth/login

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

## Categories

### Create Category

POST /api/categories

### Get All Categories

GET /api/categories

### Get Single Category

GET /api/categories/:id

### Update Category

PATCH /api/categories/:id

### Delete Category

DELETE /api/categories/:id

---

## Suppliers

### Create Supplier

POST /api/suppliers

### Get All Suppliers

GET /api/suppliers

### Get Single Supplier

GET /api/suppliers/:id

### Update Supplier

PATCH /api/suppliers/:id

### Delete Supplier

DELETE /api/suppliers/:id

---

## Products

### Create Product

POST /api/products

#### Request Body

```json
{
  "productName": "iPhone 15",
  "category": "categoryId",
  "description": "Latest Apple smartphone",
  "quantity": 50,
  "costPrice": 500000,
  "sellingPrice": 650000,
  "supplier": "supplierId"
}
```

### Get All Products

GET /api/products

### Get Single Product

GET /api/products/:id

### Search Product

GET /api/products/search?name=iphone

### Filter Products by Category

GET /api/products/filter?categorySearch=electronics

### Get Low Stock Products

GET /api/products/low-stock

### Update Product

PATCH /api/products/:id

### Delete Product

DELETE /api/products/:id

---

## Sales

### Create Sale

POST /api/sales

#### Request Body

```json
{
  "product": "iphone",
  "quantitySold": 2,
  "customerName": "Daniel"
}
```

### Get All Sales

GET /api/sales

### Get Single Sale

GET /api/sales/:id

---

## Stock Management

### Restock Product

POST /api/stock/restock

#### Request Body

```json
{
  "productId": "productId",
  "quantity": 20
}
```

### Stock Movement History

GET /api/stock/history

---

## Reports

### Dashboard Overview

GET /api/reports/overview

### Daily Sales Report

GET /api/reports?date=YYYY-MM-DD

Example:

GET /api/reports?date=2026-08-03

### Best Selling Products

GET /api/reports/best-selling

### Staff Performance Report

GET /api/reports/staff-performance

---

## Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "status": "failed",
  "message": "An error occurred"
}
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Navigate to Project Directory

```bash
cd Smart-Inventory-Sales-Management-System
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a .env file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run Development Server

```bash
npm run dev
```

Server starts on:

```text
http://localhost:3000
```

---

## Future Improvements

* Frontend Dashboard using React
* Data Visualization with Charts
* Export Reports to PDF
* Email Notifications for Low Stock Products
* Advanced Inventory Forecasting

---

## Author

Developed as a Backend API project using the MERN Stack ecosystem.
