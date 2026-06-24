# Splitrak

Vendor Management & Quotation System — compare vendor quotes item-by-item, find the cheapest split across vendors, approve deals, and export branded PDF reports.

## Tech Stack

| Layer    | Stack                                |
|----------|--------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS         |
| Backend  | Express.js, Node.js                  |
| Database | MongoDB (Mongoose)                   |
| Auth     | JWT (bcrypt + token verification)    |
| PDF      | jsPDF + jspdf-autotable              |
| Charts   | Recharts                             |

## Features

- **Vendor CRUD** — add, edit, delete vendors
- **Quotation Requests** — create requests with item lists
- **Vendor Responses** — vendors submit item-level pricing
- **Smart Comparison** — two views:
  - **Standard View** — side-by-side vendor table with per-item progress and one-click approve/undo
  - **Smart Split View** — auto-picks the cheapest vendor per item, shows total savings
- **PDF Export** — clean branded reports for both views
- **Dashboard** — stat cards, donut/bar/line charts, vendor highlights, recent activity
- **Dark/Light Theme** — toggle from navbar
- **Real-time Notifications** — in-app notification panel

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Install

```bash
git clone https://github.com/your-username/splitrak.git
cd splitrak
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Environment

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## Project Structure

```
splitrak/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Sidebar, Navbar, Footer, etc.
│   │   ├── context/        # Auth, Theme, User, Notification
│   │   ├── pages/          # Dashboard, Vendors, Smart Comparison, etc.
│   │   └── utils/          # PDF generator
│   └── ...
├── server/                 # Express backend
│   ├── config/             # DB connection
│   ├── controllers/        # Route handlers
│   ├── middleware/          # JWT auth middleware
│   ├── models/             # Mongoose schemas
│   └── routes/             # API routes
└── package.json            # Concurrent dev runner
```

## License

[MIT](LICENSE)
