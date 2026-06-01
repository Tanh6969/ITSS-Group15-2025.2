# Gym Management System — ITSS Group 15 (2025.2)

A comprehensive gym management system supporting 4 user roles (Owner, Manager, Trainer/PT, Member) with a modern web interface and RESTful API.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Setup & Run](#setup--run)
- [Environment Variables](#environment-variables)
- [Team Members](#team-members)

---

## Overview

The system provides complete business operations for a gym:

- Member management, training packages, subscriptions & invoices
- Personal training (PT) scheduling
- Employee, facility & equipment management
- Revenue reporting, performance statistics
- Real-time notifications via Server-Sent Events (SSE)
- Password reset via Gmail SMTP

---

## Tech Stack

### Backend

| Component | Technology |
|---|---|
| Language | Go 1.25.3 |
| HTTP Router | Gorilla Mux v1.8.1 |
| Database | PostgreSQL |
| DB Driver | `github.com/lib/pq` |
| Authentication | JWT (`github.com/golang-jwt/jwt/v5`) |
| Password Encryption | Bcrypt (`golang.org/x/crypto`) |
| Configuration | Godotenv |
| Email | Gmail SMTP |

### Frontend

| Component | Technology |
|---|---|
| Framework | React 19.2 |
| Build Tool | Vite 8.0 |
| Routing | React Router v7 |
| Styling | Tailwind CSS 4.2 (Dark mode) |
| Server State | TanStack React Query 5.94 |
| Client State | Zustand 5.0 |
| Form | React Hook Form 7.72 + Zod 4.3 |
| HTTP Client | Axios 1.13 |
| Animation | Framer Motion 12.40 |
| Charts | Recharts 3.8 |
| Icons | Lucide React 0.577 |
| Notifications | Sonner 2.0 |
| Date Utils | date-fns 4.1 |

---

## Project Structure

```text
ITSS-Group15-2025.2/
├── backend/
│   ├── db/                              # SQL migrations & seed data
│   │   ├── 01_create_tables.sql         # Defines 16 tables
│   │   ├── 02_constraints_indexes.sql   # Constraints & indexes
│   │   ├── 03_functions_triggers.sql    # PostgreSQL functions & triggers
│   │   └── 04_seed_data.sql             # Initial seed data
│   └── go/                              # Go application
│       ├── cmd/app/main.go              # Entry point, DI initialization
│       ├── go.mod / go.sum
│       ├── .env                         # Environment configuration
│       ├── internal/
│       │   ├── domain/
│       │   │   ├── entity/              # 14 entity types (structs)
│       │   │   ├── adapter/             # DTO adapters (request/response)
│       │   │   └── usecase/             # Business logic (16 packages)
│       │   ├── infra/
│       │   │   ├── api/
│       │   │   │   ├── handlers/        # HTTP handlers (18+ files)
│       │   │   │   ├── routes/          # 200+ route definitions
│       │   │   │   └── middleware/      # Auth, Logging, Recovery, CORS
│       │   │   ├── postgresql/          # DB connection
│       │   │   ├── email/               # Gmail SMTP service
│       │   │   └── notification/        # In-memory SSE hub
│       │   └── repository/              # Data access layer (15 repos)
│       ├── tools/seeder/                # Seed data generators
│       │   ├── seed_roles_accounts/
│       │   ├── seed_employees_pt/
│       │   ├── seed_members/
│       │   ├── seed_service_packages/
│       │   ├── seed_facilities_equipment/
│       │   ├── seed_subscriptions_invoices/
│       │   ├── seed_training/
│       │   └── seed_feedback/
│       ├── uploads/avatars/             # Avatar storage
│       └── docs/                        # API documentation
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env / .env.example
    └── src/
        ├── main.jsx / App.jsx           # React entry point
        ├── routes/
        │   ├── index.jsx                # 200+ route definitions
        │   ├── PrivateRoute.jsx         # Protects routes requiring login
        │   └── RoleBasedRoute.jsx       # Role-based access control
        ├── pages/                       # 74 page components
        │   ├── Login/                   # Login, forgot password
        │   ├── Owner/                   # Dashboard & system-wide management
        │   ├── Manager/                 # Dashboard & daily management
        │   ├── Trainer/                 # PT Portal
        │   └── Member/                  # Member Portal
        ├── components/                  # Reusable UI components
        │   ├── Charts/                  # Data charts
        │   ├── Dashboard/               # Dashboard layouts
        │   ├── Forms/                   # Form components
        │   ├── Layout/                  # MainLayout, TrainerLayout
        │   └── Common/                  # Shared components
        ├── hooks/
        │   ├── mutations/               # 12+ useMutation hooks
        │   └── queries/                 # 14+ useQuery hooks
        ├── store/                       # Zustand stores
        │   ├── useAuthStore.js          # Authentication state
        │   ├── useThemeStore.js         # Dark/Light mode
        │   ├── useTrainerStore.js       # Trainer state
        │   └── useUIStore.js            # General UI state
        ├── services/                    # API service layer (Axios)
        ├── schemas/                     # Zod validation schemas
        ├── utils/                       # Utility functions
        └── lib/                         # queryClient, global configs
## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control: OWNER, MANAGER, PT, MEMBER
- Password reset via email
- First-login password change enforcement

### Member Management
- CRUD operations for members
- Avatar upload
- Bulk member creation
- Personal profile and training goal management

### Membership Packages & Subscriptions
- Package management
- Subscription registration
- Automatic invoice generation
- Renewal and upgrade support

### Training Management
- Trainer profiles
- Session booking requests
- Session scheduling
- Attendance confirmation
- Feedback and ratings

### Facilities & Equipment
- Facility management
- Equipment inventory tracking
- Maintenance monitoring

### Reporting & Analytics
- Revenue reports
- Membership statistics
- Trainer performance reports
- PDF export support

### Real-Time Notifications
- SSE-based notification system
- Notification history
- Mark-all-as-read functionality

## Database

Main tables:
- Role
- Account
- AuthRefreshToken
- Employee
- PT_Detail
- Member
- ServiceCategory
- MembershipPackage
- Subscription
- Invoice
- Facility
- Equipment
- TrainingBooking
- TrainingSession
- Feedback

## Installation & Setup

### Requirements
- Go 1.21+
- Node.js 18+
- PostgreSQL 12+

### Backend
```bash
cd backend/go
go run ./cmd/app/main.go
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=gymdb

JWT_SECRET=your_secret

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

### Frontend
```env
VITE_API_URL=http://localhost:8080
```

## System Architecture

### Backend — Clean Architecture

- Entity Layer
- Use Case Layer
- Repository Layer
- Infrastructure Layer
- API Handlers & Middleware

### Frontend — Feature-Based Architecture

- Pages
- Components
- Hooks
- Zustand Stores
- Services
- Validation Schemas

## Authentication Flow

1. Login and receive Access Token + Refresh Token
2. Send Access Token in Authorization header
3. Refresh expired access tokens automatically
4. Revoke refresh token on logout
