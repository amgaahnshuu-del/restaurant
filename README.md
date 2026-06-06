# Gusto Fullstack Showcase

This project now runs as a fullstack `Next.js + Tailwind + Prisma + PostgreSQL + JWT` application while preserving the existing restaurant UI.

## Stack

- Next.js App Router
- React + Tailwind CSS
- Prisma ORM
- PostgreSQL
- JWT auth with HTTP-only cookies

## Project structure

- `src/app/`
  Next.js pages and API route handlers.
- `server/`
  Prisma client, reservation logic, and JWT auth helpers.
- `prisma/`
  Prisma schema and seed script.
- `src/`
  Preserved UI source and shared client-side code.
- `public/`
  Static assets used by the UI.

## Environment

Create `.env` from `.env.example`.

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:password@HOST:PORT/gusto_db"
JWT_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@gusto.local"
ADMIN_PASSWORD="ChangeMe123!"
CUSTOMER_EMAIL="guest@gusto.local"
CUSTOMER_PASSWORD="GuestPass123!"
CUSTOMER_NAME="Guest User"
CUSTOMER_PHONE="+976 99112233"
```

## Setup

```sh
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

The app will run at `http://localhost:3000`.

Make sure your PostgreSQL server is running and `DATABASE_URL` points to it before starting the app.

## Available routes

- `/`
- `/menu`
- `/salbar-1`
- `/salbar-2`
- `/account`
- `/account/login`
- `/account/register`
- `/login`
- `/api/health`
- `/api/reservations`
- `/api/reservations/cancel`
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/admin/reservations`

## Notes

- The visual UI was intentionally preserved.
- Reservation requests now go through Next.js API routes backed by Prisma.
- Admin and customer auth both use JWT-based API endpoints with HTTP-only cookies.
- The seed script creates both an admin account and a customer account for local development.
