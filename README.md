# 🛒 Nexura - Flagship Full-Stack E-Commerce Platform

A production-grade, flagship E-Commerce web application built with **React.js (Vite)**, **MySQL / SQLite**, and a decoupled **Microservices Architecture (2 Node.js / Express backend services)** featuring an **Apple-inspired Neo-Minimalist** design system.

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |    Nexura Frontend    |
                                  |     (React + Vite)    |
                                  +-----------+-----------+
                                              |
                   +--------------------------+--------------------------+
                   | (Axios REST: /api/auth,  | (Axios REST: /api/cart,  |
                   |   /api/products, users)  |   /api/orders)           |
                   v                                                     v
      +----------------------------+                       +----------------------------+
      |  Microservice 1            |                       |  Microservice 2            |
      |  User & Product Service    |<----------------------|  Order & Cart Service      |
      |                            |  Inter-service REST   |                            |
      +--------------+-------------+  (Product & Stock     +--------------+-------------+
                     |                 Validation)                        |
                     v                                                    v
      +----------------------------+                       +----------------------------+
      |  Database:                 |                       |  Database:                 |
      |  `ecommerce_users_products`|                       |  `ecommerce_orders`        |
      +----------------------------+                       +----------------------------+
```

### Microservice Isolation & Communication
1. **User & Product Microservice (`user-product-service`)**:
   - Manages Users, Authentication, Profile, Categories, Products, and Inventory.
   - Dedicated Database: `ecommerce_users_products`
2. **Order & Cart Microservice (`order-cart-service`)**:
   - Manages Shopping Carts, Checkout, Orders, Order Items, and Status Tracking.
   - Dedicated Database: `ecommerce_orders`
   - **Inter-service Communication**: Validates live stock, pricing, and decrements stock upon order placement.

---

## 📦 Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Axios, Lucide React icons, Apple-inspired Neo-Minimalist Vanilla CSS3 Design System.
- **Backend Microservices**: Node.js, Express.js, Sequelize ORM, `mysql2`, `sqlite3`, JWT, bcryptjs, CORS, dotenv.
- **Database**: MySQL 8.0+ / SQLite Zero-Config Fallback

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ecommerce.com` | `Admin@123` | Full Admin Dashboard, Catalog Management, Order Fulfillment |
| **Customer** | `customer@ecommerce.com` | `Customer@123` | Browsing, Cart, Checkout, Order History, Profile |

> 💡 *Note: The Login page includes instant **One-Click Demo Login** buttons for both roles.*

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) (Optional - automatic SQLite fallback included)

### 2. Start Application
From the root workspace directory:
```bash
npm start
```

Visit the application in your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🛠️ Key Features Implemented

- [x] **2 Independent Microservices**: Strict database separation and inter-service HTTP REST communication.
- [x] **JWT Security**: Protected routes, admin role guards, password hashing with bcrypt, request interceptor auto-refresh.
- [x] **Product Catalog**: Live search, category filtering, min/max price filtering, sorting, pagination, and stock counters.
- [x] **Dynamic Cart & Checkout**: Real-time item count badges, guest cart persistence with auto-sync on login, promo codes (`NEXURA10`), and simulated payment flows.
- [x] **Order Fulfillment Tracker**: Multi-step visual tracking (Confirmed -> Processing -> Shipped -> Delivered), itemized invoices, and customer contact details.
- [x] **Full Admin Suite**: Revenue metrics cards, live product inventory management (Add/Edit/Delete), customer directory, and order status updates.
- [x] **Design & Aesthetics**: Apple-inspired Neo-Minimalist UI with CSS variables, Lucide React icons, loading skeletons, responsive drawer menu, and toast notifications.
