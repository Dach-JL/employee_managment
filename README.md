# Workforce – Employee Management System

A premium internal platform for managing employees, tasks, reports, and real-time communication.

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | NestJS, TypeORM, PostgreSQL, Socket.IO, Passport.js (JWT), Multer, Swagger |
| **Frontend** | React 18 (Vite), TypeScript, Tailwind CSS, Framer Motion, Zustand, Recharts, Socket.IO Client |

## Features

- **Authentication** – JWT login with role-based access (Admin / Employee)
- **Task Management** – Create, assign, track, and attach files to tasks
- **Daily & Anonymous Reports** – Structured reporting with privacy options
- **Real-time Chat** – Global chat room via WebSockets
- **Private Messaging** – Secure 1-to-1 conversations
- **Announcements** – Admin broadcasts to all employees
- **Analytics Dashboard** – Visual task completion and trend insights
- **Admin Controls** – User deactivation, password resets, and employee management
- **File Management** – Profile picture uploads and task attachments
- **Profile Customization** – Editable user profiles with avatar support

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### 1. Clone & Install

```bash
git clone https://github.com/Dach-JL/employee_managment.git
cd employee_managment
```

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Environment Variables

Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=employee_management
JWT_SECRET=your_jwt_secret
PORT=3001
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 3. Run in Development

```bash
# Terminal 1 – Backend
cd backend && npm run start:dev

# Terminal 2 – Frontend
cd frontend && npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3001`.

### 4. Production Build

```bash
cd frontend && npm run build
cd backend && npm run build && npm run start:prod
```

## API Documentation

Swagger UI is available at `http://localhost:3001/api` when the backend is running.

## Default Admin Account

| Field | Value |
|---|---|
| Email | `admin@company.com` |
| Password | `AdminPassword123!` |

---

Built with ❤️ using NestJS & React
