# 🔑 Admin Login Fix

The admin account must be created before you can login.
You have **3 ways** to create the admin account:

---

## ✅ Method 1: Run the Seed Script (Recommended)

After `npm install` in the backend folder:

```bash
cd backend
node seed.js
```

This creates:
- Admin: `admin@swamimedical.com` / `Admin@123`
- Customer: `customer@example.com` / `Customer@123`
- 18 sample medicines

---

## ✅ Method 2: Use the Setup Endpoint (No terminal needed)

While the backend is running, open your browser and go to:

```
http://localhost:5000/api/auth/setup-admin
```

Or use **Postman / Thunder Client**:
```
POST http://localhost:5000/api/auth/setup-admin
```

This will create the admin if it doesn't exist yet.

---

## ✅ Method 3: MongoDB Compass (Manual)

1. Open MongoDB Compass → connect to `mongodb://localhost:27017`
2. Open the `swami-medical` database → `users` collection
3. Insert a document:

```json
{
  "name": "Swami Medical Admin",
  "email": "admin@swamimedical.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5B.v8K.lZu",
  "role": "admin",
  "phone": "+91 98765 43210",
  "isActive": true,
  "addresses": []
}
```

> Note: The password hash above is for `Admin@123`

---

After creating the admin, login at `http://localhost:5173/login`:
- Email: `admin@swamimedical.com`
- Password: `Admin@123`
