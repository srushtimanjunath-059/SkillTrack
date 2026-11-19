# SkillTrack — Student Skill & Portfolio Management Platform

Track your skills. Manage opportunities. Shape your future.

SkillTrack is a full-stack web application designed for students to track their technical & non-technical skills, internship/job applications, hackathons, academic deadlines, and achievements in one clean, unified space.

---

## 🚀 Features

- **Interactive Student Onboarding**: Welcome walkthrough with animated student avatar and audio narration.
- **Skill Growth Tracker**: Visual proficiency meters, category filters, and growth pulses.
- **Internships & Jobs Hub**: Complete pipeline tracking from Applied to Interview and Offer stages.
- **Hackathon Tracker**: Organize teams, organizers, and milestone dates.
- **Deadlines & Agenda**: Proactive notification of upcoming due dates and project proposals.
- **Achievements & Portfolio**: Showcase milestones with supporting URLs.
- **Live Public Profile**: Generate an unauthenticated public portfolio view for recruiters and peers.
- **Dark / Light Mode**: Integrated theme switcher with persistent session storage.
- **RESTful API Backend**: Node.js & Express service with persistent database storage.

---

## 🛠️ Architecture

```
SkillTrack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Persistent JSON/SQLite transactional database engine
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # User registration, login, and token generation
│   │   │   └── student.controller.js  # Profile, dashboard stats, and records CRUD
│   │   ├── middleware/
│   │   │   └── auth.middleware.js     # JWT verification & demo student fallback
│   │   ├── models/
│   │   │   └── student.model.js       # Student entity queries
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # /api/auth routes
│   │   │   ├── student.routes.js      # /api/student profile & records
│   │   │   ├── skills.routes.js       # /api/skills endpoints
│   │   │   └── opportunities.routes.js# /api/opportunities endpoints
│   │   └── server.js               # Express application entry point & static server
│   ├── .env                        # Environment configurations
│   ├── .env.example                # Example environment template
│   └── package.json                # Dependencies and launch scripts
├── database/
│   ├── schema.sql                  # Relational database schema (PostgreSQL / SQLite / MySQL)
│   └── skilltrack_data.json        # Persistent JSON data store
└── frontend/
    ├── assets/
    │   ├── css/styles.css          # Badges and responsive design rules
    │   └── js/app.js               # SkillTrackAPI client wrapper
    └── index.html                  # Full responsive single-page web application
```

---

## ⚡ Quick Start

### 1. Start the Backend Server

Open your terminal in the `backend` directory:

```powershell
cd backend
npm install
npm start
```

The server will start on **`http://localhost:5000`**.

### 2. Access the Application

- **Web Application**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

*(The backend automatically serves the frontend interface on `http://localhost:5000`)*

---

## 📡 API Endpoints

### Health Check
- `GET /api/health` — Check server status, active student count, and record count.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student account.
- `POST /api/auth/login` — Sign in and receive a JWT Bearer token.
- `GET /api/auth/me` — Retrieve the currently logged-in student.

### Student & Records (`/api/student`)
- `GET /api/student/profile` — Get student profile details.
- `PUT /api/student/profile` — Update student profile (college, department, bio).
- `GET /api/student/dashboard` — Get aggregated dashboard metrics (total counts, averages).
- `GET /api/student/public/:id?` — Public portfolio showcase.
- `GET /api/student/records?type={skills|applications|hackathons|deadlines|achievements}` — Fetch records.
- `POST /api/student/records` — Create a new entry.
- `PUT /api/student/records/:id` — Update an existing entry.
- `DELETE /api/student/records/:id` — Delete an entry.

---

## 🔒 Default Demo Account

For instant testing and evaluation without manual signup:
- **Email**: `student@skilltrack.edu`
- **Password**: `password123`
