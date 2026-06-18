# AGENTS.md — LogSage AI

## Project Name

LogSage AI

## Tagline

Transform Logs Into Security Intelligence

## Project Purpose

LogSage AI is a professional AI-powered cybersecurity platform that helps users upload logs, detect suspicious activity, understand threats, and generate rich AI incident reports.

The project must look like a real cybersecurity SaaS product suitable for GitHub, LinkedIn, demo videos, internships, freelance work, and junior job applications.

## Core Stack

Frontend:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Recharts
* Lucide React
* TanStack Query
* React Hook Form
* Zod
* Satoshi font

Backend:

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT authentication
* bcrypt password hashing
* Multer for file uploads
* Zod or class-validator validation
* Swagger/OpenAPI documentation

AI:

* OpenAI API
* Rich AI threat explanations
* AI-generated incident reports
* Fallback rule-based explanations when OpenAI API key is missing

## Phase 1 Scope

Build user-only Phase 1.

Do not build:

* Admin dashboard
* Organizations
* Teams
* Payments
* Enterprise RBAC

The user can:

* Register
* Login
* Upload log files
* Analyze logs
* View threats
* Read AI explanations
* Generate incident reports
* View analytics dashboard
* Manage basic settings

## Required Project Structure

```txt
logsage-ai/
│
├── .cursor/
│   └── rules/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── upload/
│   │   │   │   └── page.tsx
│   │   │   ├── threats/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── landing/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── upload/
│   │   ├── threats/
│   │   ├── reports/
│   │   ├── charts/
│   │   └── animations/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── logs/
│   │   ├── threats/
│   │   ├── reports/
│   │   ├── analytics/
│   │   └── settings/
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   │
│   ├── hooks/
│   ├── store/
│   ├── types/
│   ├── data/
│   │   └── mock-data.ts
│   │
│   └── config/
│       ├── app-config.ts
│       ├── navigation-config.ts
│       ├── threat-config.ts
│       └── dashboard-config.ts
│
├── server/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── logs/
│   │   ├── threats/
│   │   ├── reports/
│   │   ├── analysis/
│   │   ├── ai/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── pipes/
│   │   ├── config/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   ├── package.json
│   ├── nest-cli.json
│   └── tsconfig.json
│
├── .env
├── .env.example
├── .gitignore
├── components.json
├── package.json
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── vercel.json
```

## UI Design

The UI must look like a premium dark cybersecurity SaaS dashboard.

Use:

* Satoshi font
* Dark mode first
* Glassmorphism cards
* Subtle gradients
* Soft glowing borders
* Clean spacing
* Smooth Framer Motion animations
* Recharts for analytics
* shadcn/ui components

## Color Palette

Background:

* #020617
* #030712
* #0F172A

Cards:

* #111827
* #1E293B
* rgba(15, 23, 42, 0.75)

Borders:

* #1F2937
* #334155

Primary:

* #38BDF8

Secondary:

* #22C55E

Warning:

* #F59E0B

Danger:

* #EF4444

Critical:

* #DC2626

Text:

* Main: #F8FAFC
* Muted: #94A3B8
* Soft: #CBD5E1

## Landing Page

Create a polished landing page with:

* Navbar
* Hero section
* Product dashboard preview
* How it works
* AI security features
* Threat examples
* Report generation section
* CTA section
* Footer

Hero message:

“Turn raw security logs into clear, actionable intelligence with AI-powered threat analysis.”

CTA:

* Start Analyzing Logs
* View Demo

The landing page should feel like a real startup product.

## Authentication Pages

Create:

* Login page
* Register page

Design:

* Split-screen desktop layout
* Branding side with security copy
* Form side with glassmorphism card
* Framer Motion entrance animations
* Zod validation
* React Hook Form
* Loading states
* Error states
* Password visibility toggle

Register fields:

* Full name
* Email
* Password
* Confirm password

Login fields:

* Email
* Password

No role selection.

## Dashboard

Dashboard must include charts.

Sections:

* Sidebar
* Top navbar
* User profile menu
* Stats cards
* Threat severity chart
* Threat type chart
* Logs analyzed over time chart
* Recent threats table
* Recent uploads
* AI insight card

Stats:

* Logs uploaded
* Threats detected
* Critical alerts
* Reports generated

Charts:

* Severity distribution
* Threat categories
* Threats over time
* Logs analyzed over time

## Upload Logs Page

Include:

* Drag-and-drop upload zone
* Supported file types: .log, .txt, .csv
* File size validation
* Upload progress
* Analyze button
* Upload history
* Empty state
* Error state

## Threats Page

Include:

* Search
* Severity filter
* Threat type filter
* Threat table
* Severity badges
* Source IP
* Evidence preview
* AI explanation preview
* Threat detail modal/page

Threat detail should show:

* Summary
* Evidence
* Impact
* Severity reasoning
* Recommended next steps
* AI confidence score

## Reports Page

Include:

* Report cards
* Report detail view
* AI-generated executive summary
* Technical findings
* Recommendations
* Severity overview
* Download PDF placeholder

## AI Features Must Feel Rich

The AI analysis should not be empty or basic.

Each AI threat explanation must include:

* Simple summary
* What triggered the detection
* Evidence found in the logs
* Possible attacker behavior
* Business/security impact
* Severity reasoning
* Recommended next steps
* Confidence score
* Analyst-style notes

Each AI incident report must include:

* Executive summary
* Timeline of suspicious activity
* Key indicators of compromise
* Threat categories
* Affected IPs or paths
* Severity breakdown
* Recommended remediation
* Prevention tips
* Final analyst conclusion

If OPENAI_API_KEY is missing, create a strong fallback explanation using detected rules.

## Backend Requirements

Use NestJS.

Create modules:

* AuthModule
* UsersModule
* LogsModule
* ThreatsModule
* ReportsModule
* AnalysisModule
* AiModule
* PrismaModule

Endpoints:

* POST /auth/register
* POST /auth/login
* GET /auth/me
* POST /logs/upload
* GET /logs
* GET /logs/:id
* POST /analysis/analyze/:logFileId
* GET /threats
* GET /threats/:id
* POST /reports/generate/:logFileId
* GET /reports
* GET /reports/:id

## Validation Requirement

Review the full project and add validation wherever needed.

Frontend validation:

* Login form
* Register form
* Upload form
* Settings form
* Search/filter inputs

Backend validation:

* DTO validation
* Email validation
* Password validation
* File type validation
* File size validation
* UUID validation
* Empty body validation
* Auth guard validation
* User ownership validation
* Environment variable validation

Use:

* Zod on frontend
* class-validator or Zod on NestJS backend

## Security Rules

* Never store plain passwords.
* Hash passwords with bcrypt.
* Use JWT.
* Protect private routes.
* Validate uploaded files.
* Do not execute uploaded files.
* Users can only access their own data.
* Store secrets in `.env`.
* Do not expose secrets to frontend.
* Add centralized error handling.

## Final MVP Goal

A user can:

1. Register
2. Login
3. Upload logs
4. Analyze logs
5. View threats
6. Read rich AI explanations
7. Generate incident reports
8. View dashboard analytics

The project should look job-ready and product-quality.
