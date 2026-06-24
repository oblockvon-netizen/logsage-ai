# LogSage AI

Transform Logs Into Security Intelligence.

This repository contains the Phase 1 foundation for a user-only AI cybersecurity SaaS product. The current setup includes the frontend and backend project structure, shared configuration, environment examples, Prisma setup, and styling foundations. Product features are intentionally not implemented yet.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Lucide React, React Hook Form, Zod, TanStack Query, Satoshi font
- Backend: NestJS, TypeScript, Prisma, PostgreSQL, JWT auth, bcrypt, Multer, Swagger/OpenAPI

## Getting Started

### 1. Install dependencies

```bash
npm install
cd server
npm install
cd ..
```

Root and server each have their own `@prisma/client` install. The server `postinstall` hook runs `prisma generate` automatically.

### 2. Configure environment

```bash
cp .env.example .env
```

Set `DATABASE_URL` (and other secrets) in `.env`. Ensure PostgreSQL is running and the port/credentials match your connection string.

### 3. Run database migrations

```bash
npm run prisma:migrate
```

### 4. Start the apps

Frontend:

```bash
npm run dev
```

Backend (from repo root):

```bash
npm run server:dev
```

If you see `@prisma/client did not initialize yet`, regenerate both clients from the repo root:

```bash
npm run prisma:generate
```
