# Multi-Tenant Platform

Full-stack SaaS platform with RBAC, multi-tenant support, and real-time notifications.

## Tech Stack

### Frontend (`/frontend`)
- **Next.js 15** (App Router)
- **Clerk** – Auth (custom UI, GitHub, Google)
- **Supabase** – Database
- **Zustand** – State management
- **TanStack React Query** – Server state
- **React Hook Form** + **Zod** – Forms & validation
- **next-intl** – i18n
- **Framer Motion** – Animations
- **Tailwind CSS** + **shadcn/ui** patterns
- **Socket.io** – Real-time notifications
- **Themes** – Dark / Light / System, RTL, custom background

### Backend (`/backend`)
- **FastAPI** – REST API with Swagger UI
- **Supabase** – PostgreSQL
- **Redis** – Caching & sessions
- **python-socketio** – WebSocket notifications
- **RBAC** – Role-based access control

## Project Structure

```
multi-tenant/
├── frontend/          # Next.js 15 app
│   ├── src/
│   │   ├── app/       # App Router, loading.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── stores/
│   │   └── i18n/
│   └── package.json
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── api/v1/    # REST endpoints
│   │   ├── core/      # config, redis, rbac
│   │   └── websocket.py
│   └── requirements.txt
└── README.md
```

## Getting Started

### Run both frontend and backend concurrently

From the project root:

```bash
npm install
npm run dev
```

This starts the frontend (http://localhost:3000) and backend (http://localhost:8000) together.

**Windows:** If `npm run dev` fails for the backend, run them separately in two terminals:
```bash
# Terminal 1 - Backend
cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Prerequisites
- Node.js 20+
- Python 3.11+
- Redis
- Clerk account
- Supabase project

### Backend

Run the backend using a Python virtual environment (venv is not committed to git):

```bash
cd backend

# Create and activate virtual environment (one-time setup)
python -m venv venv
source venv/bin/activate   # Linux/macOS
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env       # Edit with your keys

# Start the server
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # Add Clerk, Supabase keys
npm run dev
```

App: http://localhost:3000

### Clerk Setup
1. Create app at [clerk.com](https://clerk.com)
2. Enable GitHub & Google in Social Connections
3. Add keys to `.env.local`

### RBAC Roles
- `admin` – Full access
- `manager` – Create, read, update (no delete)
- `member` – Read, update
- `viewer` – Read only

## Multi-Tenant Architecture

Based on [Relevant Software's multi-tenant best practices](https://relevant.software/blog/multi-tenant-architecture/):

- **Database strategy**: Single multi-tenant database with `tenant_id` columns (pool isolation)
- **Tenant identification**: `X-Tenant-ID` or `X-Tenant-Slug` header on API requests
- **Tenant onboarding**: Create organization flow at `/onboarding`
- **Tenant configuration**: Branding, features, settings per tenant
- **Tenant switcher**: Navbar dropdown to switch between organizations

### Supabase schema

Run migrations in `supabase/migrations/` to create:
- `tenants` – organization data
- `tenant_users` – user–tenant membership + role
- `tenant_config` – tenant-specific settings
- `tenant_data` – example tenant-scoped table

## Features
- [x] RBAC
- [x] Clerk auth (GitHub, Google)
- [x] Supabase + Redis
- [x] Dark/Light/System theme
- [x] RTL support
- [x] Settings sidebar (theme, background)
- [x] Notifications (Socket.io)
- [x] loading.tsx full-page loading
- [x] Partial page loading (Suspense)
- [x] i18n (en, ar)
- [x] Documented REST API
