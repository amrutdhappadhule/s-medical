# 🏥 Swami Medical – Smart Pharmacy & Online Medicine Ordering System

> MCA Final Year Project | Full-Stack E-Pharmacy Application

A modern, production-grade e-pharmacy web application inspired by Tata 1mg and PharmEasy, built specifically for a single medical store business in Solapur, Maharashtra.

---

## 📸 Features

### Customer Side
- 🏠 Beautiful homepage with hero banner, categories, and featured medicines
- 💊 Medicine catalog with advanced filters (category, price, prescription, search)
- 🛒 Cart with real-time quantity management
- 📦 Full checkout flow (delivery address, payment selection)
- 📋 Order history and real-time order tracking
- 📄 Prescription upload and status tracking
- 👤 Profile management with address book
- 🏪 Store information with location

### Admin Side
- 📊 Dashboard with KPIs (revenue, orders, medicines, customers)
- 💊 Full medicine CRUD with inventory management
- 📦 Order management with status updates
- 📄 Prescription review (Approve/Reject)
- 📈 Sales analytics with charts (daily sales, top medicines, category stats)

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| UI Library | Material UI v5 |
| State Management | Zustand |
| Data Fetching | TanStack React Query |
| Backend | NestJS (Node.js) |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Passport.js |
| Charts | Recharts |
| HTTP Client | Axios |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone and Setup

```bash
git clone <repo-url>
cd swami-medical
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/swami-medical
# JWT_SECRET=your-secret-key

# Seed the database with sample data
npx ts-node src/seed.ts

# Start development server
npm run start:dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@swamimedical.com | Admin@123 |
| Customer | customer@example.com | Customer@123 |

---

## 📁 Project Structure

```
swami-medical/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # Authentication
│   │   │   ├── users/          # User management
│   │   │   ├── medicines/      # Medicine catalog
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── orders/         # Order management
│   │   │   ├── prescriptions/  # Prescription upload
│   │   │   ├── analytics/      # Business analytics
│   │   │   └── categories/     # Medicine categories
│   │   ├── common/
│   │   │   ├── guards/         # Auth guards
│   │   │   └── decorators/     # Custom decorators
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── seed.ts             # Database seeder
│   ├── package.json
│   └── .env.example
│
└── frontend/                   # React App
    ├── src/
    │   ├── modules/
    │   │   ├── auth/           # Login, Register, Profile
    │   │   ├── medicines/      # Home, List, Detail
    │   │   ├── cart/           # Cart page
    │   │   ├── orders/         # Checkout, History, Detail
    │   │   ├── prescriptions/  # Upload & track
    │   │   ├── admin/          # Admin pages
    │   │   ├── analytics/      # Analytics dashboard
    │   │   └── store/          # Store info page
    │   ├── components/
    │   │   ├── navbar/
    │   │   ├── footer/
    │   │   └── common/
    │   ├── layouts/
    │   ├── store/              # Zustand stores
    │   ├── hooks/
    │   ├── services/
    │   ├── theme/
    │   └── types/
    └── package.json
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile (JWT) |

### Medicines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/medicines | List medicines (with filters) |
| GET | /api/medicines/:id | Get medicine by ID |
| POST | /api/medicines | Add medicine (Admin) |
| PUT | /api/medicines/:id | Update medicine (Admin) |
| DELETE | /api/medicines/:id | Delete medicine (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get user's cart |
| POST | /api/cart/add | Add item to cart |
| PUT | /api/cart/update | Update quantity |
| DELETE | /api/cart/remove/:id | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders/create | Place order |
| GET | /api/orders/my-orders | Get my orders |
| GET | /api/orders | Get all orders (Admin) |
| PUT | /api/orders/:id/status | Update status (Admin) |

### Prescriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/prescriptions/upload | Upload prescription |
| GET | /api/prescriptions/my | Get my prescriptions |
| GET | /api/prescriptions | Get all (Admin) |
| PUT | /api/prescriptions/:id/status | Approve/Reject (Admin) |

### Analytics (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/dashboard | Dashboard stats |
| GET | /api/analytics/daily-sales | Daily sales chart |
| GET | /api/analytics/top-medicines | Top selling medicines |
| GET | /api/analytics/category-stats | Category revenue |

---

## 📊 Database Collections

- **users** - Customer and admin accounts
- **medicines** - Medicine catalog with inventory
- **carts** - Shopping cart per user
- **orders** - Order records
- **prescriptions** - Uploaded prescriptions

---

## 🎓 MCA Project Details

- **Project Name**: Swami Medical – Smart Pharmacy & Online Medicine Ordering System
- **Technology**: MERN Stack (MongoDB + Express/NestJS + React + Node.js)
- **Architecture**: 3-tier (Frontend → REST API → Database)
- **Key Concepts**: JWT Auth, RBAC, REST APIs, React Query, State Management, MongoDB Aggregation

---

Made with ❤️ for MCA Final Year Project | Solapur, Maharashtra
