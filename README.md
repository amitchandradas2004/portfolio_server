# Portfolio Backend Server

A modular, scalable backend server for portfolio applications built with **TypeScript**, **Node.js**, **Express.js**, **MongoDB (Native Driver)**, **CORS**, **dotenv**, and **JSON Web Tokens (JWT)**.

It features a Role-Based Access Control (RBAC) system supporting two roles: **`admin`** and **`demo`**.

---

## 🛠️ Getting Started

### 1. Installation

```bash
npm install
```

### 2. Configure Environment Variables

Create or update `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_db
JWT_SECRET=supersecretportfoliojwtkey_change_in_production
CLIENT_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

---

## 🔐 Auth & Role Verification Endpoints

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | Server health status |
| **POST** | `/api/auth/register` | Public | Register user (`role: "admin"` or `"demo"`) |
| **POST** | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| **GET** | `/api/auth/me` | Authenticated | Get profile for currently logged-in user |
| **POST** | `/api/auth/seed` | Public | Initialize default Admin & Demo test accounts |
| **GET** | `/api/projects` | Public | Fetch portfolio projects |
| **POST** | `/api/projects` | `admin` | Create project (Admin only) |
| **GET** | `/api/admin/dashboard` | `admin` | Admin dashboard data |
| **GET** | `/api/demo/preview` | `admin` / `demo` | Demo preview endpoint |
| **POST** | `/api/portfolio-action` | `admin` / `demo` (Restricted) | Blocks mutations for `demo` role |

---

## 🖥️ Terminal Startup Output

When starting the server, the terminal will log:

```text
[SUCCESS] MongoDB Connected via Native Driver: portfolio_db
[SUCCESS] Server is running on port 5000 (development mode)
[INFO] URL: http://localhost:5000
[INFO] Health check: http://localhost:5000/api/health
[SUCCESS] Database: MongoDB connected
```
