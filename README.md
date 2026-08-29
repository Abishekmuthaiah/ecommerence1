# 🛒 Nexura - Flagship Full-Stack E-Commerce Platform

A production-grade, flagship E-Commerce web application built with **React.js (Vite)**, **MySQL / SQLite**, and a decoupled **Microservices Architecture (2 Spring Boot 3 Java Backend Services)** featuring an **Apple-inspired Neo-Minimalist** design system.

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
      |  Microservice 1 (Port 5001)|                       |  Microservice 2 (Port 5002)|
      |  User & Product Service    |<----------------------|  Order & Cart Service      |
      |  [Spring Boot 3 + JPA]     |  Inter-service REST   |  [Spring Boot 3 + JPA]     |
      +--------------+-------------+  (Product & Stock     +--------------+-------------+
                     |                 Validation)                        |
                     v                                                    v
      +----------------------------+                       +----------------------------+
      |  Database:                 |                       |  Database:                 |
      |  `ecommerce_users_products`|                       |  `ecommerce_orders`        |
      |  (SQLite / MySQL)          |                       |  (SQLite / MySQL)          |
      +----------------------------+                       +----------------------------+
```

### Microservice Isolation & Communication
1. **User & Product Microservice (`user-product-service` - Port 5001)**:
   - Built with **Spring Boot 3**, **Spring Data JPA**, **Spring Security**, and **JWT**.
   - Manages Users, Authentication, Profile, Categories, Products, and Inventory.
   - Dedicated Database: `ecommerce_users_products` (Zero-config SQLite with MySQL support).
2. **Order & Cart Microservice (`order-cart-service` - Port 5002)**:
   - Built with **Spring Boot 3**, **Spring Data JPA**, and **RestTemplate / RestClient**.
   - Manages Shopping Carts, Checkout, Orders, Order Items, and Status Tracking.
   - Dedicated Database: `ecommerce_orders` (Zero-config SQLite with MySQL support).
   - **Inter-service Communication**: Validates live stock, pricing, and decrements stock upon order placement via REST API.

---

## 📦 Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Axios, Lucide React icons, Apple-inspired Neo-Minimalist Vanilla CSS3 Design System.
- **Backend Microservices**: Spring Boot 3.3.4, Java 21/25, Spring Data JPA, Hibernate, Spring Security, JJWT, Maven, SQLite JDBC, MySQL Connector.
- **Database**: SQLite Zero-Config Fallback / MySQL 8.0+

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
- [Java Development Kit (JDK)](https://adoptium.net/) (v21 or v25)
- [Node.js](https://nodejs.org/) (v18 or higher)

### 2. Start Application
From the root workspace directory:
```bash
npm start
```

Or start individual services independently:
```bash
# Service 1: User & Product Service (Port 5001)
npm run start:user-service
# or: java -jar user-product-service/target/user-product-service-1.0.0.jar

# Service 2: Order & Cart Service (Port 5002)
npm run start:order-service
# or: java -jar order-cart-service/target/order-cart-service-1.0.0.jar

# Frontend (Port 5173)
npm run start:frontend
```

Visit the application in your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🛠️ Key Features Implemented

- [x] **2 Independent Spring Boot Microservices**: Strict database separation and inter-service HTTP REST communication.
- [x] **JWT Security**: Protected routes, admin role guards, password hashing with BCrypt, request interceptor auto-refresh.
- [x] **Product Catalog**: Live search, category filtering, min/max price filtering, sorting, pagination, and stock counters.
- [x] **Dynamic Cart & Checkout**: Real-time item count badges, guest cart persistence with auto-sync on login, promo codes (`NEXURA10`), and simulated payment flows.
- [x] **Order Fulfillment Tracker**: Multi-step visual tracking (Confirmed -> Processing -> Shipped -> Delivered), itemized invoices, and customer contact details.
- [x] **Full Admin Suite**: Revenue metrics cards, live product inventory management (Add/Edit/Delete), customer directory, and order status updates.
- [x] **Design & Aesthetics**: Apple-inspired Neo-Minimalist UI with CSS variables, Lucide React icons, loading skeletons, responsive drawer menu, and toast notifications.
