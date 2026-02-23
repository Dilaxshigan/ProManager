# ProManager - Multi-Tenant SaaS Project Management System

[![GitHub CI](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/USERNAME/REPO/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

ProManager is a multi-tenant project management SaaS with role-based access control, real-time Kanban boards, and an extensible API.

## Features
- **Multi-tenancy**: Organization-based data isolation.
- **RBAC**: Owner, Admin, Member, Guest roles.
- **Kanban Board**: Drag & Drop task management with Socket.io updates.
- **Dashboard**: High-level metrics and activity feed.
- **API Documentation**: Interactive Swagger docs.

## Quick Start

### Prerequisites
- Node.js (16+ recommended) and npm
- PostgreSQL (or another datasource configured in `DATABASE_URL`)

### Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set `DATABASE_URL` and other env vars.
4. Run migrations and seed data:

```bash
npx prisma migrate dev --name init --schema=prisma/schema.prisma
node prisma/seed.js
```

5. Start the backend:

```bash
npm run start
# or for development
npm run dev
```

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

The frontend runs on Vite; open the URL printed in the console (typically `http://localhost:3000`).

### API Docs
While the backend is running, Swagger docs are available at `http://localhost:5000/api-docs` (default).

## Environment Variables
- `DATABASE_URL` - Postgres connection string used by Prisma
- `PORT` - Backend port (default 5000)
- `JWT_SECRET` - Secret for signing JWTs

Add any missing variables to `.env` based on `backend/.env.example` (if present).

## GitHub / Repository
To create a GitHub repository and push this project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Replace `<your-username>` and `<your-repo>` with your GitHub values. Add a GitHub Actions workflow (`.github/workflows/ci.yml`) to enable CI badges shown above.

## Contributing
- Fork the repo and open a PR for changes.
- Follow the existing code style. Backend uses Express + Prisma; frontend uses React + Vite.

## Roadmap (short)
- Real-time collaboration improvements (presence, comments)
- More third-party integrations (Slack, Google Calendar)
- Billing & subscription tiers (Stripe)

## License
This project uses the MIT license. Add a `LICENSE` file at the repo root.

## Sample Credentials (dev only)
- Email: `admin@acme.com`
- Password: `password123`

---

If you'd like, I can: add a `.env.example`, create a basic GitHub Actions CI workflow, or commit & push to a new GitHub repo for you.
