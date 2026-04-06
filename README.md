# MERN E-Commerce Application

Full-stack e-commerce app with **MongoDB**, **Express**, **React**, **Node.js**, **Redux Toolkit**, **Razorpay**, **JWT**, and **REST APIs**.

---

## Quick run (avoid "Unable to connect")

1. **Terminal 1 – Backend** (from project root):
   ```bash
   npm start
   ```
   Wait until you see: `server is running on port 3000` (or your `PORT` from `backend/config/config.env`).  
   **Do not open the backend port in the browser** – it’s an API only.

2. **Terminal 2 – Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Wait until you see: `Local: http://localhost:5173/`.

3. **Browser:** Open **http://localhost:5173** (the frontend). The app will talk to the backend via the dev proxy.  
   If your backend uses a different port (e.g. 8005), set `PORT=8005` in `backend/config/config.env` and in `frontend/vite.config.js` change the proxy `target` to `http://localhost:8005`.

---

## Backend (Node + Express + MongoDB)

### Folder structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── config.env.example  # Env sample
├── controller/
│   ├── orderController.js # Order + Razorpay
│   ├── productController.js
│   └── userController.js
├── middleware/
│   ├── error.js           # Global error handler
│   ├── handleAsyncError.js
│   └── userAuth.js        # JWT + role-based access
├── models/
│   ├── orderModel.js
│   ├── productModel.js
│   └── userModel.js
├── routes/
│   ├── orderRoute.js
│   ├── productRoute.js
│   └── userRoute.js
├── utils/
│   ├── apiFunctionality.js # Search, filter, pagination
│   ├── handleError.js
│   ├── jwtToken.js
│   └── sendEmail.js
├── app.js
└── server.js
```

### Setup and run

1. **Env**  
   Copy `.env.example` to `.env` at project root (or `backend/config/config.env`) and set:
   - `DB_URI` – MongoDB connection string  
   - `JWT_SECRET_KEY`, `JWT_EXPIRES`, `EXPIRE_COOKIE`  
   - `FRONTEND_URL` (e.g. `http://localhost:5173`)  
   - `SMTP_*` for password reset emails  
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` for payments  

2. **Install and start**

   ```bash
   npm install
   npm start
   ```

   Server runs at `http://localhost:8005` (or `PORT` from env).

### API overview

- **Products:** `GET /api/v1/products` (pagination, search, category, price filter), `GET /api/v1/product/:id`, admin create/update/delete.
- **Auth:** `POST /api/v1/register`, `POST /api/v1/login`, `GET /api/v1/profile`, `POST /api/v1/logout`, forgot/reset password.
- **Orders:** `POST /api/v1/order/create`, `GET /api/v1/orders/me`, `POST /api/v1/order/payment/create`, `POST /api/v1/order/payment/verify`.
- **Admin:** `GET /api/v1/admin/orders`, `PUT /api/v1/admin/order/:id`, `GET /api/v1/admin/users`, `GET /api/v1/admin/products`.

---

## Frontend (React + Vite + Redux Toolkit)

### Folder structure

```
frontend/src/
├── app/
│   └── store.js           # Redux store
├── components/
│   ├── Header.jsx
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx           # Product list + search/filter
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Shipping.jsx
│   ├── Payment.jsx        # Razorpay checkout
│   ├── MyOrders.jsx
│   └── AdminDashboard.jsx
├── redux/slices/
│   ├── authSlice.js
│   ├── productSlice.js
│   ├── cartSlice.js
│   └── orderSlice.js
├── services/
│   └── api.js             # Axios instance
├── App.jsx
└── main.jsx
```

### Setup and run

1. **Env**  
   In `frontend/` copy `.env.example` to `.env` and set:
   - `VITE_API_URL=http://localhost:8005/api/v1`
   - `VITE_RAZORPAY_KEY_ID=` (Razorpay public key for checkout)

2. **Install and start**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   App runs at `http://localhost:5173`.

---

## Deployment

- **Backend:** Set `NODE_ENV=production`, `DB_URI`, `JWT_SECRET_KEY`, `FRONTEND_URL` (your frontend origin), Razorpay and SMTP env. Use a process manager (e.g. PM2) and reverse proxy (e.g. Nginx).
- **Frontend:** Set `VITE_API_URL` to your backend API URL and `VITE_RAZORPAY_KEY_ID`. Run `npm run build` and serve the `dist/` folder (e.g. Nginx, Vercel, Netlify).

---

## First admin user

Register a user from the app, then in MongoDB set that user’s `role` to `"admin"` so you can access `/admin/dashboard` and manage orders, users, and products.
