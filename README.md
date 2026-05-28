# MedSpaces

MedSpaces is a Next.js marketplace for medical spaces and patient inquiry workflows. It connects doctors looking for clinical spaces, clinic owners managing listings, and administrators moderating the platform through role-aware dashboards, protected workflows, and a Prisma/PostgreSQL backend.

## Problem Statement

Healthcare professionals often need a focused workflow to discover clinic spaces, publish listings, and manage inquiries without losing context across multiple systems. MedSpaces centralizes those flows into a single application with:

- role-based access for doctors, clinic owners, and admins
- protected workflow routes for authenticated users
- moderation controls for listings and doctor profiles
- inquiry tracking with an auditable status timeline
- a database-backed session model instead of transient client-only auth

## What the Platform Currently Does

| Area | Implemented behavior |
| --- | --- |
| Public site | Marketing pages, onboarding entry points, sign in and register |
| Authentication | Credential-based login and registration with server-side sessions |
| RBAC | Admin, doctor, and clinic-owner permissions enforced in middleware and route handlers |
| Doctor workflow | Browse protected spaces, open listing details, submit inquiries, review personal inquiries |
| Clinic workflow | Register as a clinic owner, add listings, manage owned listings, review related inquiries |
| Admin workflow | Review listings and doctors, moderate records, manage inquiry statuses, add admin notes |
| Data layer | Prisma models backed by PostgreSQL with seeded demo data |
| Notifications | Console-backed workflow notifications, optional welcome email delivery via Resend |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS, Lucide icons |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Authentication | Custom credential auth with server sessions and cookies |
| Validation | Zod |
| Password hashing | bcryptjs |
| Email | Resend integration for welcome emails when configured |

## Authentication and RBAC

MedSpaces uses a custom session-based authentication flow rather than a third-party auth provider.

### Session model

- Successful login or registration creates a server-side session.
- Session state is stored in PostgreSQL and mirrored in the in-memory session store used by the app.
- The app uses two cookies:
  - `medspaces_session`
  - `medspaces_role`
- Logout clears the server session and both cookies.

### Role handling

The codebase currently defines three roles:

- `ADMIN`
- `DOCTOR`
- `CLINIC_OWNER`

Role-aware access is enforced in:

- `src/middleware.ts`
- `src/lib/auth/guards.ts`
- `src/lib/auth/permissions.ts`
- protected dashboard layouts

### Route gating

Protected areas such as browse, listing detail, inquiry, add-space, and dashboard routes are redirected to sign in when the user is not authenticated. Authenticated users are routed to their correct landing paths:

- Admin: `/admin`
- Doctor: `/doctor/dashboard`
- Clinic owner: `/clinic/dashboard`

## Doctor Workflow

The doctor flow is designed for browsing spaces and submitting inquiries.

### Entry points

- `/onboarding/doctor`
- `/register?role=DOCTOR`
- `/login?redirect=/doctor/dashboard`

### What doctors can do

- browse protected listings in the marketplace
- open a listing detail view
- submit an inquiry against a listing
- review their own inquiries and inquiry statuses
- access the doctor dashboard and profile actions

### Relevant routes

- `/browse`
- `/listing/[id]`
- `/inquiry`
- `/doctor/dashboard`
- `/api/inquiries`
- `/api/inquiries/[id]`
- `/api/inquiries/[id]/activity`

## Clinic Workflow

Clinic owners use MedSpaces to create and manage listings.

### Entry points

- `/onboarding/clinic`
- `/register?role=CLINIC_OWNER`
- `/login?redirect=/clinic/dashboard`

### What clinic owners can do

- create a new listing through the protected add-listing flow
- manage their own listings from the dashboard
- review inquiries associated with their listings
- use the clinic dashboard for ongoing workspace management

### Relevant routes

- `/add-space`
- `/clinic/dashboard`
- `/api/listings`
- `/api/listings/[id]`
- `/api/inquiries`

## Admin Moderation Workflow

Admins manage moderation and workflow operations from the admin area.

### Entry points

- `/admin`
- `/admin/workflow`

### What admins can do

- review listings in moderation queues
- approve or reject listings
- review doctor profiles
- verify or deactivate doctors
- inspect inquiries and status history
- add admin notes to inquiry records
- change inquiry workflow states

### Workflow states

Inquiry statuses implemented in the codebase:

- `NEW`
- `CONTACTED`
- `IN_DISCUSSION`
- `MATCHED`
- `CLOSED`
- `REJECTED`

## API and Backend Architecture

The backend is implemented with Route Handlers in the App Router.

### Key API groups

| Group | Purpose |
| --- | --- |
| `/api/auth/*` | login, logout, register, current user, auth service metadata |
| `/api/listings/*` | marketplace listing browse, detail, create, update, moderation |
| `/api/doctors/*` | doctor profile fetch and moderation |
| `/api/inquiries/*` | inquiry creation, detail, status updates, notes, activity timeline |

### Implementation patterns

- route handlers validate input with Zod
- repositories isolate database access
- shared response helpers standardize JSON responses
- middleware performs request-time auth and role gating
- server layouts protect dashboard areas
- notifications are emitted through the notification service layer

### Notification behavior

- inquiry workflow events use the console notification transport by default
- welcome emails are attempted only when `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are configured

## Prisma and PostgreSQL

The data model is implemented in `prisma/schema.prisma` and backed by PostgreSQL.

### Core models

- `User`
- `Session`
- `Listing`
- `Doctor`
- `Inquiry`
- `InquiryActivity`

### What the schema supports

- user authentication and role data
- session persistence
- marketplace listings with moderation metadata
- doctor profile records
- inquiry lifecycle tracking
- inquiry audit/activity history

## Project Structure

```text
src/
  app/
    api/                # route handlers for auth, listings, doctors, inquiries
    admin/              # admin dashboard and workflow views
    clinic/             # clinic dashboard
    doctor/             # doctor dashboard
    onboarding/         # role-specific onboarding entry pages
    browse/             # protected marketplace browsing UI
    listing/[id]/       # protected listing detail page
    inquiry/            # protected inquiry flow
    add-space/          # protected listing creation flow
    login/ register/    # authentication pages
    page.tsx            # public landing page
  components/           # shared UI and layout components
  context/              # auth context
  lib/                  # auth, repositories, session, validation, responses, notifications
prisma/
  schema.prisma         # database schema
  migrations/           # Prisma migrations
  seed.ts               # demo data seeding
```

## Environment Variables

Create a local `.env` file with the variables below.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `RESEND_API_KEY` | No | Enables welcome email delivery during registration |
| `RESEND_FROM_EMAIL` | No | Sender address used by the optional Resend welcome email |

> The codebase does not require additional public auth variables. `NODE_ENV` is used by the runtime but is not a setup variable for the application.

## Installation and Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env` in the project root and set at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Optional email delivery:

```env
RESEND_API_KEY="your_resend_api_key"
RESEND_FROM_EMAIL="MedSpaces <no-reply@yourdomain.com>"
```

### 3) Generate Prisma client

```bash
npx prisma generate
```

### 4) Run database migrations

```bash
npm run db:migrate
```

In this repository, that script runs `prisma migrate dev --name init`. If you prefer invoking Prisma directly, use:

```bash
npx prisma migrate dev
```

### 5) Seed demo data

```bash
npm run db:seed
```

### 6) Start the app

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Seeded Demo Accounts

The current seed script creates sample accounts and marketplace data.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@medspaces.in` | `MedAdmin@2024!` |
| Doctor | `doctor@medspaces.in` | `Doctor@2024!` |
| Clinic owner | `clinic@medspaces.in` | `Clinic@2024!` |

The seed script also populates sample listings, a doctor profile, and inquiry activity records for local development and demos.

## Current Project Status

MedSpaces is currently a functional full-stack MVP with:

- authenticated role-based workflows
- protected dashboards for doctors, clinic owners, and admins
- listing and inquiry APIs
- moderation operations
- Prisma/PostgreSQL persistence
- seeded demo data for local development

It is suitable for portfolio review, internship submission, and onboarding demonstrations.

## Future Improvements

Potential next steps that are not yet implemented in the current codebase:

- persistent email provider setup for workflow notifications
- richer analytics and reporting dashboards
- file upload storage for listing media
- automated test coverage for critical auth and workflow paths
- production deployment configuration and observability
- more granular moderation/audit reporting

## License

No license file is currently included in the repository. Add one before public distribution if you want to define reuse terms.
