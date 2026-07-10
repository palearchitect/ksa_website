<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</p>

# KSA Valuers — Real Estate Valuation Platform

A full-stack real estate valuation and property management platform built for KSA Valuers, Nigeria. Features property listings, development project tracking, site viewing bookings, an AI-powered assistant, and a comprehensive admin dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Public Website
- 🏠 **Property Listings** — Browse, search, and filter properties by status (sale/rent), type, price range, and location
- 🏗️ **Development Projects** — Track ongoing and completed real estate development projects with milestones
- 📅 **Book a Tour** — Schedule site viewing appointments with conflict detection
- 🤖 **AI Assistant** — Gemini-powered conversational search for property queries
- 👥 **Team Page** — Company team member profiles
- 📧 **Contact Form** — Inquiry submissions with email notifications
- ❓ **FAQ** — Comprehensive frequently asked questions
- 📰 **Blog** — Company news and real estate articles
- 🔄 **Hero Carousel** — Dynamic homepage hero banner slides

### Admin Dashboard
- 🔐 **JWT Authentication** — Secure login with HTTP-only cookie tokens and automatic refresh
- 📊 **Dashboard Overview** — Key metrics and statistics at a glance
- 🏢 **Property Management** — Full CRUD with featured property toggling
- 🏗️ **Project Management** — Create/edit development projects with progress tracking
- 📅 **Booking Management** — View, approve, and manage site viewing requests
- 🎨 **Hero Slide Manager** — Add, edit, reorder, and delete homepage slides
- 💳 **Payment Tracking** — Payment history and records management
- 👥 **Team Management** — Manage team member profiles
- 📝 **Audit Logging** — Full before/after tracking of all data mutations

---

## Tech Stack

### Frontend
| Technology         | Purpose                        |
| :----------------- | :----------------------------- |
| **Vue.js 3.4**     | Reactive UI framework          |
| **Vue Router 4**   | Client-side SPA routing        |
| **Pinia**          | State management               |
| **Axios**          | HTTP API client                |
| **Tailwind CSS 3** | Utility-first styling          |
| **Heroicons**      | SVG icon library               |
| **VueUse**         | Composition API utility hooks  |
| **Vite 4**         | Build tool and dev server      |

### Backend
| Technology              | Purpose                         |
| :---------------------- | :------------------------------ |
| **Express.js 5**        | HTTP server framework           |
| **PostgreSQL**          | Relational database             |
| **pg (node-postgres)**  | Database driver                 |
| **bcryptjs**            | Password hashing                |
| **jsonwebtoken**        | JWT authentication              |
| **Nodemailer**          | Transactional email delivery    |
| **express-rate-limit**  | API rate limiting               |
| **Google Gemini API**   | AI-powered property search      |

---

## Project Structure

```
ksa_website/
├── backend/                    # Express.js API server
│   ├── migrations/
│   │   └── init.js             # Database schema migrations
│   ├── scripts/
│   │   └── seed.js             # Database seeding script
│   ├── services/
│   │   ├── emailService.js     # Email transporter factory
│   │   └── emailTemplates.js   # HTML email templates
│   ├── server.js               # Main Express server (all routes)
│   ├── .env.example            # Backend env template
│   └── package.json            # Backend dependencies
│
├── src/                        # Vue.js frontend source
│   ├── assets/                 # Static assets (images, fonts)
│   ├── components/
│   │   ├── global/             # Shared components (Navbar, Footer, etc.)
│   │   ├── properties/         # Property-specific components
│   │   └── sections/           # Page section components
│   ├── hooks/                  # Custom composition hooks
│   ├── router/
│   │   └── index.js            # Vue Router configuration
│   ├── services/
│   │   └── api.js              # Axios HTTP client with interceptors
│   ├── stores/                 # Pinia state stores
│   │   ├── authStore.js        # Authentication state
│   │   ├── propertyStore.js    # Property listings state
│   │   ├── projectStore.js     # Development projects state
│   │   ├── bookingStore.js     # Booking appointments state
│   │   ├── heroSlideStore.js   # Hero banner slides state
│   │   ├── teamStore.js        # Team members state
│   │   └── pmsStore.js         # Payment management state
│   ├── views/                  # Page-level Vue components
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── auth/               # Login/register pages
│   │   ├── dashboard/          # Dashboard sub-pages
│   │   ├── user/               # User-facing pages
│   │   ├── Home.vue            # Homepage
│   │   ├── About.vue           # About page
│   │   ├── Contact.vue         # Contact page with chat widget
│   │   ├── PropertiesPage.vue  # Property listings
│   │   ├── PropertyDetail.vue  # Single property view
│   │   ├── Projects.vue        # Development projects
│   │   ├── BookTour.vue        # Tour booking page
│   │   ├── FAQ.vue             # FAQ page
│   │   ├── Blog.vue            # Blog/news page
│   │   ├── Team.vue            # Team members page
│   │   └── NotFound.vue        # 404 error page
│   ├── App.vue                 # Root application component
│   └── main.js                 # Vue app entry point
│
├── public/                     # Static files (copied to dist/)
│   └── _redirects              # Netlify/Cloudflare redirect rules
├── dist/                       # Production build output (git-ignored)
│
├── .env.example                # Frontend env template
├── .gitignore                  # Git ignore rules
├── deploy.sh                   # Automated build/deploy script
├── index.html                  # Vite HTML entry point
├── package.json                # Frontend dependencies & scripts
├── vite.config.js              # Vite configuration (proxy, aliases)
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── HOSTING.md                  # Production hosting guide
├── AGENTS.md                   # Architecture reference for AI agents
└── README.md                   # This file
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** — v18.x or later ([Download](https://nodejs.org/))
- **npm** — v9+ (included with Node.js)
- **PostgreSQL** — v14+ ([Download](https://www.postgresql.org/download/))
- **Git** — ([Download](https://git-scm.com/))

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ThePaleArchitect/ksa_website.git
cd ksa_website
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install --legacy-peer-deps

# Install backend dependencies
cd backend && npm install && cd ..
```

### 3. Set Up the Database

```bash
# Create a PostgreSQL database
psql -U postgres -c "CREATE DATABASE ksa_valuers;"

# Copy the env template
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your database credentials (see [Environment Variables](#environment-variables)).

```bash
# Run migrations (creates all tables)
cd backend && npm run db:migrate

# Seed initial data (optional — creates admin account)
npm run db:seed
cd ..
```

### 4. Start Development Servers

```bash
# Start both frontend (port 5173) and backend (port 3000) simultaneously
npm run dev:all
```

Or start them individually:

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend
npm run backend
```

### 5. Open in Browser

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Admin Dashboard:** http://localhost:5173/admin/login

Default admin credentials (from seed):
- **Email:** `admin@ksavaluers.com`
- **Password:** Value of `ADMIN_PASSWORD` in your `.env`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable              | Required | Default        | Description                                              |
| :-------------------- | :------: | :------------- | :------------------------------------------------------- |
| `NODE_ENV`            |    ✅    | `development`  | `development` or `production`                            |
| `DATABASE_URL`        |    ✅    | —              | PostgreSQL connection string                             |
| `JWT_SECRET`          |    ✅    | `replace-me`   | Secret for signing access tokens                         |
| `JWT_REFRESH_SECRET`  |    ✅    | `replace-me`   | Secret for signing refresh tokens                        |
| `JWT_ACCESS_TTL`      |    ❌    | `15m`          | Access token expiry duration                             |
| `JWT_REFRESH_TTL`     |    ❌    | `7d`           | Refresh token expiry duration                            |
| `ADMIN_PASSWORD`      |    ✅    | —              | Seed admin password (12+ chars, mixed case, numbers, special) |
| `PORT`                |    ❌    | `3000`         | Express server port                                      |
| `ALLOWED_ORIGINS`     |    ✅*   | —              | Comma-separated allowed origins (required in production) |
| `EMAIL_PROVIDER`      |    ❌    | `gmail`        | Email provider: `gmail`, `smtp`, `sendgrid`, `aws-ses`   |
| `EMAIL_USER`          |    ❌    | —              | Email account username                                   |
| `EMAIL_PASS`          |    ❌    | —              | Email account password / app-specific password           |
| `ADMIN_EMAIL`         |    ❌    | —              | Admin notification email address                         |
| `EMAIL_FROM`          |    ❌    | —              | Sender email address                                     |
| `GEMINI_API_KEY`      |    ❌    | —              | Google Gemini API key for AI features                    |

*\*Required in production only*

### Frontend (`.env` — root)

| Variable           | Required | Description                          |
| :----------------- | :------: | :----------------------------------- |
| `VITE_STRAPI_URL`  |    ❌    | Strapi CMS API URL (if using Strapi) |

> [!NOTE]
> In local development, the Vite dev server proxies all `/api` requests to `http://localhost:3000` automatically via `vite.config.js`. No `VITE_API_URL` is needed on the frontend.

---

## Available Scripts

### Root Directory

| Script           | Command              | Description                                   |
| :--------------- | :------------------- | :-------------------------------------------- |
| `dev`            | `npm run dev`        | Start Vite dev server (frontend only)         |
| `build`          | `npm run build`      | Build frontend for production → `dist/`       |
| `preview`        | `npm run preview`    | Preview production build locally              |
| `backend`        | `npm run backend`    | Start backend Express server                  |
| `dev:all`        | `npm run dev:all`    | Start frontend + backend concurrently         |
| `db:setup`       | `npm run db:setup`   | Run migrations + seed in backend              |
| `start`          | `npm start`          | Start backend server (production)             |

### Backend Directory

| Script           | Command              | Description                                   |
| :--------------- | :------------------- | :-------------------------------------------- |
| `dev`            | `npm run dev`        | Start Express server                          |
| `start`          | `npm start`          | Start Express server                          |
| `db:migrate`     | `npm run db:migrate` | Run database schema migrations                |
| `db:seed`        | `npm run db:seed`    | Seed database with initial data               |
| `db:setup`       | `npm run db:setup`   | Run migrations + seed                         |

---

## API Reference

All API endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint                 | Auth     | Description                  |
| :----- | :----------------------- | :------- | :--------------------------- |
| POST   | `/api/v1/auth/login`     | Public   | Login with email/password    |
| POST   | `/api/v1/auth/register`  | Public   | Register new account         |
| POST   | `/api/v1/auth/refresh`   | Cookie   | Refresh access token         |
| POST   | `/api/v1/auth/logout`    | Cookie   | Clear auth cookies           |
| GET    | `/api/v1/auth/me`        | Required | Get current user profile     |

### Properties

| Method | Endpoint                 | Auth          | Description                  |
| :----- | :----------------------- | :------------ | :--------------------------- |
| GET    | `/api/properties`        | Public        | List properties (paginated)  |
| GET    | `/api/properties/:id`    | Public        | Get property details         |
| POST   | `/api/properties`        | Admin/Manager | Create property              |
| PUT    | `/api/properties/:id`    | Admin/Manager | Update property              |
| DELETE | `/api/properties/:id`    | Admin/Manager | Delete property              |

### Projects

| Method | Endpoint                 | Auth     | Description                  |
| :----- | :----------------------- | :------- | :--------------------------- |
| GET    | `/api/projects`          | Public   | List projects (filtered)     |
| GET    | `/api/projects/:id`      | Public   | Get project details          |
| POST   | `/api/projects`          | Admin    | Create project               |
| PUT    | `/api/projects/:id`      | Admin    | Update project               |
| DELETE | `/api/projects/:id`      | Admin    | Delete project               |

### Bookings

| Method | Endpoint                 | Auth         | Description                  |
| :----- | :----------------------- | :----------- | :--------------------------- |
| GET    | `/api/bookings`          | Admin/Agent  | List all bookings            |
| POST   | `/api/bookings`          | Public       | Create booking               |
| PUT    | `/api/bookings/:id`      | Admin/Agent  | Update booking status        |

### Hero Slides

| Method | Endpoint                 | Auth          | Description                  |
| :----- | :----------------------- | :------------ | :--------------------------- |
| GET    | `/api/hero-slides`       | Public        | Get active slides            |
| POST   | `/api/hero-slides`       | Admin/Manager | Create slide                 |
| PUT    | `/api/hero-slides/:id`   | Admin/Manager | Update slide                 |
| DELETE | `/api/hero-slides/:id`   | Admin/Manager | Delete slide                 |

### AI Assistant

| Method | Endpoint                 | Auth   | Description                  |
| :----- | :----------------------- | :----- | :--------------------------- |
| POST   | `/api/ask-ai`            | Public | Query Gemini AI              |
| POST   | `/api/ask-ai-cached`     | Public | Query with cache layer       |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vue.js Frontend                          │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Vue       │  │  Pinia    │  │  Axios   │  │  Vue Router  │  │
│  │  Components│←→│  Stores   │←→│  Client  │  │  (SPA)       │  │
│  └───────────┘  └──────────┘  └─────┬────┘  └──────────────┘  │
└─────────────────────────────────────┼──────────────────────────┘
                                      │ HTTP/HTTPS
┌─────────────────────────────────────┼──────────────────────────┐
│                     Express.js Backend                          │
│  ┌──────────┐  ┌──────────┐  ┌─────┴────┐  ┌──────────────┐  │
│  │  Auth     │  │  CORS    │  │  API     │  │  Rate        │  │
│  │  Middleware│  │  Policy  │  │  Routes  │  │  Limiter     │  │
│  └─────┬────┘  └──────────┘  └─────┬────┘  └──────────────┘  │
│        │                           │                            │
│  ┌─────┴────┐  ┌──────────┐  ┌─────┴────┐  ┌──────────────┐  │
│  │  JWT      │  │  Audit   │  │  Email   │  │  Gemini AI   │  │
│  │  Tokens   │  │  Logger  │  │  Service │  │  Integration │  │
│  └──────────┘  └─────┬────┘  └──────────┘  └──────────────┘  │
└────────────────────────┼───────────────────────────────────────┘
                         │
┌────────────────────────┼───────────────────────────────────────┐
│                  PostgreSQL Database                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  users   │  │properties│  │ projects │  │  bookings    │  │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────────┤  │
│  │hero_slides│ │audit_logs│  │contact_  │  │  payments    │  │
│  │          │  │          │  │messages  │  │              │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Monorepo structure** — Frontend and backend live in the same repository for simplified deployment
- **Single-server production** — In production, Express serves both the API and the built Vue SPA from `dist/`
- **HTTP-only cookies** — JWT tokens are stored as secure HTTP-only cookies, not localStorage, preventing XSS token theft
- **Automatic token refresh** — Axios interceptor transparently refreshes expired access tokens using the refresh cookie
- **Auto-migrations** — Database schema is checked and migrated on every server startup
- **Audit trail** — All create/update/delete operations log before/after state for accountability

---

## Deployment

For complete production deployment instructions, see **[HOSTING.md](./HOSTING.md)**.

### Quick Deploy (TL;DR)

```bash
# Build frontend
npm run build

# Configure production environment
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# Run migrations
cd backend && npm run db:migrate && cd ..

# Start with PM2
cd backend && pm2 start server.js --name ksa-valuers
```

### Supported Hosting Providers

| Provider         | Type  | Recommended Plan     |
| :--------------- | :---- | :------------------- |
| Hostinger VPS    | VPS   | KVM 2 (2GB RAM)      |
| Railway          | PaaS  | Starter              |
| Render           | PaaS  | Starter              |
| DigitalOcean     | VPS   | Basic Droplet (2GB)  |
| Fly.io           | PaaS  | Free / Pay-as-you-go |

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "Add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Code Style

- Vue components use `<script setup>` composition API
- Backend uses CommonJS (`require/module.exports`)
- All database queries use parameterized queries (`$1, $2, ...`) to prevent SQL injection

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <strong>The Pale Architect</strong> for <strong>KSA Valuers</strong>
</p>
