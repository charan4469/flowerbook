# 🌸 FlowerBook — Online Flower Booking App

FlowerBook is a full-stack online flower booking application that allows users to browse flowers, add products to a cart, place orders, and receive order confirmation through a simple and interactive web interface.

The project combines a modern frontend with a Python FastAPI backend and uses Excel-based storage for order data.

---

## 🚀 Overview

FlowerBook was built to demonstrate a complete e-commerce-style workflow, including:

- 🌸 Flower browsing
- 🛒 Shopping cart
- 👤 User registration and login
- 💳 Checkout workflow
- 📦 Order placement
- 🧾 Invoice generation
- 📊 Order data storage
- 🔗 Frontend ↔ backend API integration

The application is designed as a practical full-stack project that can be extended into a production-ready flower marketplace.

---

## ✨ Key Features

### 🌺 Flower Catalog

Users can browse available flowers and view the products displayed by the application.

### 🛒 Shopping Cart

Users can:

- Add flowers to the cart
- View selected products
- Update cart items
- Remove products
- Review the order before checkout

### 👤 Authentication

FlowerBook includes:

- User registration
- User login
- Login-based access to cart functionality
- User profile menu

### 📦 Order Management

Users can complete the checkout process and place flower orders.

Order information is sent from the frontend to the FastAPI backend.

### 🧾 Invoice Generation

After an order is processed, the backend can generate an invoice for the order.

### 📊 Excel Order Storage

The backend uses `openpyxl` to work with Excel-based order data.

This makes the project simple to run locally without requiring a database during development.

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Live Server

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- Pandas / OpenPyXL

### Data Storage

- Excel

### Development

- VS Code
- REST APIs
- JSON
- CORS

---

## 🏗️ Application Architecture

```text
                 ┌─────────────────────────┐
                 │      FlowerBook UI      │
                 │                         │
                 │ HTML • CSS • JavaScript │
                 └────────────┬────────────┘
                              │
                              │ REST API
                              ▼
                 ┌─────────────────────────┐
                 │       FastAPI           │
                 │       Backend           │
                 └────────────┬────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
       ┌─────────────────┐       ┌─────────────────┐
       │ Order Processing│       │ Invoice Service │
       └────────┬────────┘       └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │ Excel Order Data│
       └─────────────────┘