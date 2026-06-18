# LogSage AI — Execution Prompts

## Prompt 1 — Project Setup

Read AGENTS.md carefully.

Set up the full LogSage AI project structure using:

Frontend:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Recharts
* Lucide React
* React Hook Form
* Zod
* TanStack Query
* Satoshi font

Backend:

* NestJS
* TypeScript
* Prisma
* PostgreSQL
* JWT auth
* bcrypt
* Multer
* Swagger/OpenAPI

Create the folder structure exactly as described in AGENTS.md.

Do not build features yet.
Only create the structure, install dependencies, configure Tailwind, shadcn/ui, fonts, environment examples, and shared config files.

Keep Phase 1 user-only.
Do not create admin, teams, organizations, RBAC, or payments.

---

## Prompt 2 — Frontend Theme + Layout

Build the frontend design system for LogSage AI.

Create:

* Global dark theme
* Satoshi font setup
* Tailwind theme colors
* shadcn/ui setup
* Reusable buttons
* Cards
* Badges
* Inputs
* Sidebar
* Navbar
* Dashboard layout
* Auth layout

Use the color palette in AGENTS.md.

Use Framer Motion for:

* Page transitions
* Card fade-ins
* Sidebar animations
* Button hover effects

Do not connect to backend yet.
Use mock data only.

---

## Prompt 3 — Landing Page

Build the LogSage AI landing page.

Sections:

* Navbar
* Hero section
* Dashboard preview
* How it works
* AI security features
* Threat detection examples
* Incident report preview
* CTA section
* Footer

Style:

* Premium dark cybersecurity SaaS
* Smooth animations
* Glassmorphism cards
* Subtle gradients
* Professional spacing
* Responsive design

Hero text:
“Turn raw security logs into clear, actionable intelligence with AI-powered threat analysis.”

Buttons:

* Start Analyzing Logs
* View Demo

---

## Prompt 4 — Authentication Pages

Build the login and register pages.

Use:

* React Hook Form
* Zod validation
* shadcn/ui form components
* Framer Motion animations

Login fields:

* Email
* Password

Register fields:

* Full name
* Email
* Password
* Confirm password

Requirements:

* Password visibility toggle
* Loading states
* Error states
* Form validation
* Split-screen desktop layout
* Glassmorphism form card
* No role selection
* All users are normal users

Use mock submit handlers for now.

---

## Prompt 5 — Dashboard UI

Build the protected dashboard UI using mock data.

Dashboard must include:

* Sidebar
* Top navbar
* User profile section
* Stat cards
* Threat severity chart
* Threat type chart
* Logs analyzed over time chart
* Threats over time chart
* Recent threats table
* Recent uploads
* AI insight card

Use:

* Recharts
* Framer Motion
* shadcn/ui
* Lucide icons

Make it look like a real SOC analyst dashboard.

---

## Prompt 6 — Upload Logs Page

Build the Upload Logs page.

Include:

* Drag-and-drop upload zone
* Supported formats: .log, .txt, .csv
* File size validation
* File type validation
* Upload progress UI
* Analyze button
* Upload history table/card
* Empty state
* Error state

Use mock upload functionality first.

Make the page feel polished and professional.

---

## Prompt 7 — Threats Page

Build the Threats page.

Include:

* Search bar
* Severity filter
* Threat type filter
* Threat table
* Severity badges
* Source IP
* Evidence preview
* AI explanation preview
* View details modal/page

Threat detail view must include:

* Summary
* Evidence
* Impact
* Possible attacker behavior
* Severity reasoning
* Recommended next steps
* Confidence score
* Analyst notes

Use mock data first.

---

## Prompt 8 — Reports Page

Build the Reports page.

Include:

* Report cards
* Report detail view
* Executive summary
* Timeline of suspicious activity
* Key indicators of compromise
* Severity breakdown
* Technical findings
* Recommendations
* Final analyst conclusion
* Download PDF placeholder

Use mock data first.

---

## Prompt 9 — Settings Page

Build the Settings page.

Include:

* Profile settings
* App preferences placeholder
* Theme placeholder
* API key placeholder
* Security preferences placeholder

Use form validation where needed.

Keep it simple for Phase 1.

---

## Prompt 10 — NestJS Backend Setup

Now build the NestJS backend.

Create modules:

* AuthModule
* UsersModule
* LogsModule
* ThreatsModule
* ReportsModule
* AnalysisModule
* AiModule
* PrismaModule

Configure:

* Prisma
* PostgreSQL
* Environment validation
* Global validation pipe
* Global exception filter
* Swagger/OpenAPI
* CORS
* JWT config

Do not create admin or RBAC.

---

## Prompt 11 — Prisma Schema

Create the Prisma schema for LogSage AI.

Models:

* User
* LogFile
* Threat
* Report

User:

* id
* fullName
* email
* passwordHash
* createdAt
* updatedAt

LogFile:

* id
* userId
* filename
* fileType
* rawContent
* uploadedAt

Threat:

* id
* userId
* logFileId
* threatType
* severity
* sourceIp
* description
* aiExplanation
* evidence
* score
* confidence
* createdAt

Report:

* id
* userId
* logFileId
* title
* summary
* recommendations
* createdAt

Add relationships properly.
Then generate Prisma client and create seed data.

---

## Prompt 12 — Backend Auth

Build authentication.

Endpoints:

* POST /auth/register
* POST /auth/login
* GET /auth/me

Use:

* bcrypt
* JWT
* DTO validation
* email validation
* password validation
* auth guard

Rules:

* No role field
* User-only accounts
* Email must be unique
* Password must be hashed
* Private endpoints require JWT

Add Swagger docs.

---

## Prompt 13 — Log Upload Backend

Build log upload functionality.

Endpoints:

* POST /logs/upload
* GET /logs
* GET /logs/:id

Requirements:

* Use Multer
* Accept .log, .txt, .csv
* Validate file type
* Validate file size
* Read file content safely
* Store raw content in database
* User can only access own logs
* Protect routes with JWT

---

## Prompt 14 — Threat Detection Engine

Build the rule-based threat detection engine.

Detect:

* Brute force attempts
* SQL injection attempts
* Directory scanning
* Suspicious path access
* Repeated server errors

Threat output must include:

* threatType
* severity
* score
* sourceIp
* description
* evidence
* confidence

Use configurable rules from config files.
Do not hardcode everything inside one function.

---

## Prompt 15 — Rich AI Analysis

Build the AI analysis service.

Endpoint:

* POST /analysis/analyze/:logFileId

The AI output must include:

* Simple summary
* What triggered the detection
* Evidence found in logs
* Possible attacker behavior
* Business/security impact
* Severity reasoning
* Recommended next steps
* Confidence score
* Analyst-style notes

Use OpenAI API when OPENAI_API_KEY exists.
If missing, use a strong fallback rule-based explanation.

Store detected threats in the database.

---

## Prompt 16 — Reports Backend

Build report generation.

Endpoints:

* POST /reports/generate/:logFileId
* GET /reports
* GET /reports/:id

Generated report must include:

* Executive summary
* Timeline of suspicious activity
* Key indicators of compromise
* Threat categories
* Affected IPs or paths
* Severity breakdown
* Recommended remediation
* Prevention tips
* Final analyst conclusion

Use AI when available.
Use fallback report generation when API key is missing.

---

## Prompt 17 — Frontend API Integration

Connect the frontend to the NestJS backend.

Integrate:

* Register
* Login
* Current user
* Upload logs
* Analyze logs
* Get threats
* Generate reports
* Get reports

Use:

* TanStack Query
* API service files
* JWT token storage
* Protected routes
* Loading states
* Error states
* Toast notifications

Replace mock data gradually.

---

## Prompt 18 — Validation Review

Review the entire project and add validation wherever needed.

Frontend:

* Login form
* Register form
* Upload form
* Settings form
* Search and filter inputs

Backend:

* DTOs
* UUID params
* File upload
* Environment variables
* Auth token
* User ownership checks
* Empty request body
* Invalid file types
* Invalid credentials

Return clean error messages.

---

## Prompt 19 — Polish UI

Polish the entire UI.

Improve:

* Spacing
* Responsiveness
* Dark mode contrast
* Card hover states
* Empty states
* Loading skeletons
* Error states
* Mobile sidebar
* Animations
* Chart styling
* Dashboard presentation

Make it look like a premium cybersecurity SaaS product.

Do not add new major features.

---

## Prompt 20 — Final Test + Fix

Run a full project review.

Check:

* TypeScript errors
* Build errors
* Lint errors
* Broken imports
* Broken routes
* Auth flow
* Upload flow
* Analyze flow
* Report generation flow
* Mobile responsiveness
* Environment setup

Fix all issues.

Do not change the core architecture.
Do not add admin features.
Keep Phase 1 clean and working.
