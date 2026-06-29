<!-- SECTION 1 -->
# 💳 Digital Wallet

![React](https://img.shields.io/badge/React-20232A?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel)
![Render](https://img.shields.io/badge/Render-46E3B7)

A production-ready full-stack Digital Wallet application that simulates core banking operations such as deposits, withdrawals, money transfers, transaction history, receipts, and role-based administration.

Built with **React**, **Node.js**, **Express.js**, and **MongoDB**, the application features secure JWT authentication, refresh token rotation, HTTP-only cookies, role-based access control (RBAC), API documentation with Swagger, and live deployment on Vercel and Render.

---

## 🚀 Live Demo

**Frontend**

https://digital-wallet-full-stack-applicati.vercel.app

**Backend API**

https://digital-wallet-backend-z636.onrender.com

**Swagger API Documentation**

https://digital-wallet-backend-z636.onrender.com/api-docs


<!-- SECTION 2 -->
## 📖 Project Overview

Digital Wallet is a full-stack web application that simulates the core functionality of a modern digital banking platform. Users can securely manage their wallet by depositing funds, withdrawing money, transferring money to other users, viewing transaction history, downloading receipts, and managing their profile.

The application implements secure authentication using JSON Web Tokens (JWT), refresh token rotation, HTTP-only cookies, and role-based access control (RBAC). Administrators have access to dedicated dashboards for monitoring users, transactions, audit logs, and overall system statistics.

The project was developed to demonstrate full-stack development skills, secure authentication practices, RESTful API design, database modeling, and production deployment using modern web technologies.

### Key Highlights

* Production-ready full-stack architecture
* Secure JWT Authentication with Refresh Tokens
* HTTP-only Cookie-based Authentication
* Role-Based Access Control (RBAC)
* MongoDB Atlas cloud database
* RESTful API with Swagger documentation
* Responsive React frontend
* Transaction receipts and audit logging
* Live deployment using Vercel and Render


<!-- SECTION 3 -->
## ✨ Features

### 🔐 Authentication

* User Registration
* Secure Login & Logout
* JWT Access Tokens
* Refresh Token Rotation
* HTTP-only Cookie Authentication
* Change Password
* Forgot Password
* Reset Password

### 💳 Wallet Operations

* Deposit Money
* Withdraw Money
* Transfer Money Between Users
* Real-time Wallet Balance
* Transaction History
* Download Transaction Receipts

### 👨‍💼 Admin Panel

* Dashboard Statistics
* View All Users
* View All Transactions
* Freeze / Unfreeze User Accounts
* Audit Logs

### 🛡️ Security

* Password Hashing using bcrypt
* JWT Authentication
* Refresh Token Rotation
* HTTP-only Secure Cookies
* Role-Based Access Control (RBAC)
* Protected Routes
* Input Validation
* Environment-based Configuration

### 📚 API Documentation

* Interactive Swagger UI
* RESTful API Design
* Well-structured API Endpoints

### 🚀 Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* MongoDB Atlas Cloud Database
* Automatic deployment via GitHub


<!-- SECTION 4 -->
## 🛠️ Tech Stack

| Category              | Technologies                           |
| --------------------- | -------------------------------------- |
| **Frontend**          | React, Vite, React Router, CSS         |
| **Backend**           | Node.js, Express.js                    |
| **Database**          | MongoDB Atlas, Mongoose                |
| **Authentication**    | JWT, Refresh Tokens, HTTP-only Cookies |
| **Authorization**     | Role-Based Access Control (RBAC)       |
| **API Documentation** | Swagger (OpenAPI)                      |
| **Email Service**     | Nodemailer                             |
| **Deployment**        | Vercel, Render                         |
| **Version Control**   | Git, GitHub                            |


<!-- SECTION 5 -->
## 📸 Application Screenshots

> **Note:** Screenshots will be added after completing the final UI polish.

### Public Pages

* Landing Page
![Landing Page](screenshots/landing-page.png)
* Login
* Register
* Forgot Password
* Reset Password

---

### User Dashboard

* Dashboard
* Profile
* Change Password

---

### Wallet Operations

* Deposit Money
* Withdraw Money
* Transfer Money
* Transaction History
* Transaction Receipt

---

### Administration

* Admin Dashboard
* Manage Users
* Manage Transactions
* Audit Logs

---

### API Documentation

* Swagger UI


<!-- SECTION 6 -->
## 📂 Project Structure

```text
digital_wallet/
├── backend/
│   ├── .env
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── db.js
│       │   └── env.js
│       ├── controllers/
│       │   ├── account.controller.js
│       │   ├── admin.controller.js
│       │   ├── auth.controller.js
│       │   ├── transaction.controller.js
│       │   └── user.controller.js
│       ├── middlewares/
│       │   ├── accountStatus.middleware.js
│       │   ├── authorization.middleware.js
│       │   ├── rateLimit.middleware.js
│       │   ├── user.middleware.js
│       │   └── validation.middleware.js
│       ├── models/
│       │   ├── account.model.js
│       │   ├── auditLog.model.js
│       │   ├── passwordResetToken.model.js
│       │   ├── refreshToken.model.js
│       │   ├── transaction.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── account.routes.js
│       │   ├── admin.routes.js
│       │   ├── auth.routes.js
│       │   ├── transaction.routes.js
│       │   └── user.routes.js
│       ├── validations/
│       │   ├── auth.validation.js
│       │   └── transaction.validation.js
│       ├── utils/
│       │   └── sendEmail.js
│       └── docs/
│           └── swagger.js
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── api/
    │   │   └── api.js
    │   ├── context/
    │   │   └── ToastContext.jsx
    │   ├── layouts/
    │   │   └── PublicLayout.jsx
    │   ├── utils/
    │   │   └── auth.js
    │   ├── components/
    │   │   ├── EmptyState.jsx / .css
    │   │   ├── Footer.jsx / .css
    │   │   ├── LoadingSpinner.jsx / .css
    │   │   ├── Navbar.jsx / .css
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ProtectedAdminRoute.jsx
    │   │   ├── Sidebar.jsx / .css
    │   │   └── Toast.jsx / .css
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── TransferPage.jsx
    │   │   ├── DepositPage.jsx
    │   │   ├── WithdrawPage.jsx
    │   │   ├── HistoryPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── ChangePasswordPage.jsx
    │   │   ├── ForgotPasswordPage.jsx
    │   │   ├── ResetPasswordPage.jsx
    │   │   ├── AdminDashboardPage.jsx
    │   │   ├── AdminTransactionsPage.jsx
    │   │   ├── AdminUsersPage.jsx
    │   │   └── AuditLogsPage.jsx
    │   └── styles/
    │       ├── globals.css
    │       ├── variables.css
    │       └── [one CSS file per page]
    └── README.md


```

<!-- SECTION 7 -->
## 🏗️ Architecture

The application follows a client-server architecture with a clear separation of concerns between the frontend, backend, and database.

```text
                   ┌─────────────────────┐
                   │     React Client    │
                   │   (Vite + React)    │
                   └──────────┬──────────┘
                              │
                    HTTPS Requests
                              │
                              ▼
                 ┌────────────────────────┐
                 │   Express REST API     │
                 │  JWT Authentication    │
                 │  RBAC Authorization    │
                 └──────────┬─────────────┘
                            │
                  Mongoose ODM
                            │
                            ▼
                 ┌────────────────────────┐
                 │    MongoDB Atlas       │
                 │      Cloud Database    │
                 └────────────────────────┘
```

### Request Flow

1. The user interacts with the React frontend.
2. The frontend sends authenticated API requests to the Express backend.
3. JWT access tokens and refresh tokens are managed using HTTP-only cookies.
4. Express validates requests and enforces role-based access control (RBAC).
5. Mongoose performs database operations on MongoDB Atlas.
6. The backend returns JSON responses to update the user interface.

### Security Highlights

* JWT Authentication
* Refresh Token Rotation
* HTTP-only Secure Cookies
* Password Hashing with bcrypt
* Role-Based Access Control (RBAC)
* Input Validation
* Environment-based Configuration
* Protected API Routes


<!-- SECTION 8 -->
## 🚀 Engineering Highlights

This project was built with a strong focus on scalability, security, and maintainability. Beyond implementing core wallet functionality, several production-oriented engineering practices were incorporated throughout the application.

### Authentication & Security

* JWT-based Authentication
* Refresh Token Rotation
* HTTP-only Cookie Authentication
* Password Hashing using bcrypt
* Role-Based Access Control (RBAC)
* Protected API Routes
* Input Validation
* Environment-based Configuration

### Backend Engineering

* RESTful API Architecture
* MVC Project Structure
* MongoDB Transactions for Wallet Operations
* Mongoose ODM
* Centralized Error Handling
* Reusable Middleware
* Swagger API Documentation

### Frontend Engineering

* Component-Based Architecture using React
* React Router Navigation
* Reusable UI Components
* Centralized API Service Layer
* Toast Notification System
* Responsive Dashboard Design
* Professional Dark Fintech UI

### DevOps & Deployment

* Frontend hosted on Vercel
* Backend hosted on Render
* MongoDB Atlas Cloud Database
* Automatic Deployment via GitHub
* Environment-based Configuration
* Cross-Origin Authentication with Secure Cookies


<!-- SECTION - 9 -->
## 💡 Challenges & Solutions

During the development and deployment of this project, several real-world engineering challenges were encountered and successfully resolved.

| Challenge                                                           | Solution                                                                                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Secure authentication across different frontend and backend domains | Implemented HTTP-only cookies with `secure` and `SameSite=None` configuration for cross-origin authentication.                             |
| Session management                                                  | Implemented JWT Access Tokens with Refresh Token Rotation for improved security and seamless user sessions.                                |
| Reliable wallet transactions                                        | Used MongoDB transactions to ensure deposits, withdrawals, and transfers execute atomically and maintain data consistency.                 |
| Role-based authorization                                            | Implemented RBAC middleware to restrict administrative functionality to authorized users only.                                             |
| Production deployment                                               | Configured environment-specific settings for CORS, cookies, Swagger, and API URLs to support both development and production environments. |
| Reusable frontend API communication                                 | Built a centralized API service layer to eliminate duplicated request logic and simplify maintenance.                                      |
| API documentation                                                   | Integrated Swagger to provide interactive and up-to-date REST API documentation.                                                           |


## 🌐 Project Links

### Live Application

**Frontend**

https://digital-wallet-full-stack-applicati.vercel.app

### Backend API

https://digital-wallet-backend-z636.onrender.com

### Swagger API Documentation

https://digital-wallet-backend-z636.onrender.com/api-docs

---

## 👨‍💻 Author

**Nikhil Lad**

Final-Year Mechanical Engineering Student | Aspiring Full-Stack Developer

This project was developed to strengthen my understanding of full-stack web development, secure authentication, RESTful API design, database management, and production deployment. It represents my effort to build a real-world application by following modern software engineering practices.
