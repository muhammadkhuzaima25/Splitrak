<p align="center">
  <img alt="Splitrak — Vendor Management & Quotation System" src="./client/public/splitrak.svg" width="100" style="border-radius: 16px;">
</p>

<h1 align="center">Split<span style="color:#00C27A">rak</span></h1>

<p align="center">
  <strong>Manage Vendors. Compare Quotations. Split Smart. — The Procurement System Built for Modern Businesses</strong>
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-splitrak.vercel.app-00C27A?style=for-the-badge&labelColor=080E0D" alt="Live Demo">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-00C27A?style=flat&logo=react&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=nodedotjs&labelColor=080E0D">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Express.js-4-000000?style=flat&logo=express&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&labelColor=080E0D">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Recharts-Data_Viz-00C27A?style=flat&logo=chartdotjs&labelColor=080E0D">
  <img src="https://img.shields.io/badge/jsPDF-Export-FF6B6B?style=flat&labelColor=080E0D">
</p>

<br>

---

<!-- SEO KEYWORDS -->
<!--
splitrak, vendor management system, quotation management system, MERN stack project, full stack web application, procurement software, supplier comparison tool, smart order splitting, quotation tracking dashboard, vendor star rating system, PDF procurement report, React dashboard with charts, internship project MERN, full stack developer Pakistan, Teyzix Core internship, vendor quotation comparison, cost optimization tool, B2B procurement platform, MongoDB Express React Node project, recharts dashboard, jsPDF export, dark light mode React app
-->

---

## 📌 Overview

**Splitrak** is a full-stack MERN web application built for businesses that need a smarter way to handle vendor relationships and procurement workflows. Instead of managing suppliers through scattered emails and spreadsheets, Splitrak brings everything into one centralized dashboard — from adding vendors and creating quotation requests, to receiving responses and comparing costs side by side.

The standout feature is the **Smart Split Optimizer** — an algorithm that analyzes quotation responses from multiple vendors and automatically identifies the cheapest vendor for each individual item in a request. Rather than awarding the entire order to one vendor, it splits the order intelligently to minimize total procurement cost.

> Built to reflect how real procurement teams actually work — item by item, vendor by vendor.

---

## ❗ Problem Statement

Most businesses still manage vendor communications through email threads and Excel files. As supplier count and quotation volume grows, three problems become unavoidable:

- **No centralized vendor database** — supplier contacts and history are scattered across inboxes
- **Manual cost comparison** — comparing vendor quotes item by item wastes hours of work. Worse, businesses end up awarding the entire order to one vendor even when different vendors offer better prices on different items — overpaying unnecessarily
- **Zero visibility into procurement patterns** — no way to track which vendors consistently deliver value over time

**How Splitrak solves this:**
The Smart Split Optimizer directly attacks the second problem — the one that costs businesses the most money. Instead of picking one vendor for the whole order, it runs a per-item comparison across all vendor responses and builds an optimized split order automatically. The result is displayed as a clear breakdown with exact savings shown per item and in total, and can be exported as a professional PDF procurement report.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏢 **Vendor Directory** | Add, edit, search, and manage all supplier information in one place |
| 📋 **Quotation Requests** | Create structured requests with dynamic item rows |
| 📥 **Vendor Responses** | Vendors submit per-item pricing; responses tracked with status management |
| ⚡ **Smart Split Optimizer** | Finds cheapest vendor per item and calculates exact savings vs single-vendor order |
| ⭐ **Vendor Star Ratings** | Auto-calculated ratings from quotation history displayed as `Vendor Name  ★ 4.8` |
| 📊 **Interactive Charts** | Donut chart for quotation status, bar chart for top vendors, line chart for monthly activity |
| 📄 **PDF Procurement Report** | One-click export of smart split results with vendor details, item breakdown, and savings summary |
| 🌗 **Dark / Light Mode** | Fully themed toggle with persistent preference saved to localStorage |
| 🔐 **JWT Authentication** | Secure register/login with bcrypt password hashing and token-based route protection |
| 📱 **Responsive UI** | Clean layout across desktop and tablet with collapsible sidebar |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite 5
- React Router DOM v6
- Axios with JWT interceptor
- Tailwind CSS 3
- Recharts (dashboard data visualization)
- jsPDF + jspdf-autotable (PDF export)
- React Icons (ri icon set)
- react-hot-toast (notifications)

**Backend**
- Node.js + Express 4
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- RESTful API architecture

---

## 🧠 Smart Split Algorithm

The core feature of Splitrak. Here's how it works:

```
For each item in a Quotation Request:
  1. Collect all vendor responses that include that item
  2. Compare unit prices across all vendors
  3. Select the vendor with the lowest unit price
  4. Calculate savings vs the most expensive vendor for that item

Output:
  - Per-item: Best Vendor | Unit Price | Quantity | Total | Saved
  - Summary: Single vendor total vs Optimized total vs Total savings
```

This means a business ordering 5 different items doesn't have to pay one vendor's price for everything — they get the best deal on every single line item.

---

## ⭐ Vendor Rating System

Vendors are automatically rated based on their quotation history — no manual input needed.
Ratings appear as `Vendor Name  ★ 4.8` across the vendor table, dashboard, and PDF reports.

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas free tier)

### 1. Clone the repo
```bash
git clone https://github.com/muhammadkhuzaima25/Splitrak.git
cd Splitrak
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/splitrak
JWT_SECRET=your_secret_key_here
```

Start backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
splitrak/
├── client/                        # React + Vite Frontend
│   ├── public/
│   │   └── logo.png               # Brand logo
│   └── src/
│       ├── api/
│       │   └── axios.js           # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── Sidebar.jsx        # Fixed navigation sidebar
│       │   ├── Navbar.jsx         # Top bar with theme toggle + dropdown
│       │   ├── Footer.jsx         # Footer with social links
│       │   └── ProtectedRoute.jsx # Auth guard
│       ├── context/
│       │   ├── AuthContext.jsx    # Auth state management
│       │   └── ThemeContext.jsx   # Dark/light mode state
│       └── pages/
│           ├── Login.jsx              # Split-panel auth page
│           ├── Register.jsx           # Split-panel register page
│           ├── Dashboard.jsx          # Stats + charts + vendor highlights
│           ├── Vendors.jsx            # Vendor CRUD with star ratings
│           ├── QuotationRequests.jsx  # Request management
│           ├── VendorResponse.jsx     # Response submission
│           └── SmartComparison.jsx    # Split optimizer + PDF export
│
└── server/                        # Node + Express Backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── vendorController.js        # Includes rating calculation logic
    │   ├── quotationController.js
    │   └── dashboardController.js     # Stats + chart data endpoints
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Vendor.js
    │   ├── QuotationRequest.js
    │   └── QuotationResponse.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── vendorRoutes.js
    │   ├── quotationRoutes.js
    │   └── dashboardRoutes.js
    ├── server.js
    └── package.json
```

---

## 🌐 API Endpoints

### Auth — `/api/auth`
| Method | Path | Description | Access |
|---|---|---|---|
| POST | /register | Create new account | Public |
| POST | /login | Login, returns JWT | Public |
| GET | /me | Get current user | Private |

### Vendors — `/api/vendors`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | / | Get all vendors with ratings | Private |
| POST | / | Add new vendor | Private |
| PUT | /:id | Update vendor | Private |
| DELETE | /:id | Delete vendor | Private |

### Quotation Requests — `/api/quotation-requests`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | / | Get all requests | Private |
| POST | / | Create new request | Private |
| PUT | /:id | Update request | Private |
| DELETE | /:id | Delete request | Private |

### Quotation Responses — `/api/quotation-responses`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | / | Get all responses | Private |
| GET | /by-request/:id | Get responses for a request | Private |
| POST | / | Submit vendor response | Private |
| PUT | /:id | Update response / status | Private |
| DELETE | /:id | Delete response | Private |

### Dashboard — `/api/dashboard`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | /stats | Summary counts for stat cards | Private |
| GET | /top-vendors | Top 5 vendors by approvals | Private |
| GET | /monthly-activity | Last 6 months quotation trends | Private |

---

## 📄 PDF Procurement Report

The Smart Comparison page includes a one-click PDF export that generates a professional procurement document containing:

- Splitrak branding header with logo
- Quotation request title and description
- Smart Split results table — item, best vendor, company, phone, unit price, total, savings
- Full vendor directory with contact details and star ratings
- Cost summary box — single vendor total vs optimized total vs **YOU SAVE** amount
- Confidential footer with generation date

File is saved as: `splitrak-[request-title]-[date].pdf`

---

## 🔮 Future Roadmap

- [ ] Email notifications for quotation status updates
- [ ] Activity log / audit trail for all system actions
- [ ] Quotation deadline tracker with auto-close on expiry
- [ ] Multi-user roles (Procurement Manager, Viewer)
- [ ] Vendor portal for self-submission of quotes
- [ ] Export to Excel in addition to PDF

---

## 👤 Author

**Muhammad Khuzaima**  
Graphic Designer · Logo & Brand Identity Expert · UI/UX Designer · MERN Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin&labelColor=080E0D)](https://www.linkedin.com/in/muhammad-khuzaima-991a08313)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-333?style=flat&logo=github&labelColor=080E0D)](https://github.com/muhammadkhuzaima25)

---

## 📄 License

**All Rights Reserved.** Copyright © 2026 Muhammad Khuzaima.  
This project is for **viewing and evaluation purposes only.**

---

<p align="center">
  <strong>⭐ Found Splitrak useful or impressive? Drop a star!</strong><br>
  <sub>Built from scratch — every bug fixed, every feature thought through.<br>
  A star costs nothing but means everything. 🙏</sub>
</p>

<p align="center">
  <a href="https://github.com/muhammadkhuzaima25/Splitrak">
    <img src="https://img.shields.io/badge/⭐_Star_this_repo-Show_some_love-00C27A?style=for-the-badge&labelColor=080E0D" alt="Star this repo">
  </a>
</p>
