# 📚 Library Manager

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Shadcn/UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)

</div>

A full-featured library management system built to help administrators organize book collections, manage members, and track loans — with automated transactional email notifications powered by **Resend**.

> ⚠️ **Intended for local/intranet use only.** This application is designed to run inside a trusted, secured network (e.g. a school or organization's internal LAN). There is currently no authentication layer. A future update is planned to add authentication with **RADIUS/LDAP integration** for enterprise identity provider compatibility.

---

## 🚀 About The Project

Library Manager goes beyond a basic CRUD application. It is architected as a production-grade web platform implementing full-stack best practices across the entire delivery pipeline: from database design with Prisma to containerized deployment with Docker and automated CI/CD via GitHub Actions.

The system handles the full lifecycle of a library loan: creation, renewal, return, and automated overdue detection — all with email confirmations sent to members at every step.

---

## 🎯 Features

- **📖 Book Management** — Register, edit, and delete books with unique bar codes, titles, authors, and quantities.
- **👤 Member Management** — Full CRUD for library members with unique email enforcement.
- **🔁 Loan Lifecycle** — Create loans linking a member to a book, renew them, mark returns, and delete records.
- **📊 Dashboard** — Real-time KPI cards (registered books, members, active loans, overdue loans) and interactive temporal charts for loans/returns and new member registrations.
- **📧 Transactional Emails via Resend** — Automated email notifications for:
  - Loan confirmation
  - Loan renewal confirmation
  - Return confirmation
  - Due date reminders (configurable N days before)
  - Overdue notices (with escalating severity: medium → high → critical)
- **🔔 Cron-ready Notification Endpoint** — `POST /api/notify` secured with a Bearer secret, designed to be called by an external cron job to dispatch daily reminders and overdue notices.
- **🔍 Server-Side Search & Pagination** — SSR-powered search across all entities (books, members, loans) with URL-driven pagination.
- **⚙️ Configurable Settings** — Runtime-editable settings stored in the database: `LIBRARY_NAME`, `LOAN_DURATION_DAYS`, `REMINDERS_DAYS_BEFORE`.
- **🌐 Internationalization (i18n)** — Full EN/FR support via `next-intl`, with locale-prefixed routing and a language toggle in the header.
- **🌙 Dark / Light Theme** — System-aware theme switching via `next-themes`.
- **📱 Responsive Design** — Usable on desktop, tablet, and mobile.
- **🐳 Containerized** — Multi-stage Docker build with Bun, ready to deploy anywhere.

---

## 🛠️ Tech Stack

| Layer                         | Technology                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| **Framework**                 | [Next.js 16](https://nextjs.org/) — App Router, Server Actions, Server Components      |
| **Language**                  | [TypeScript](https://www.typescriptlang.org/)                                          |
| **Runtime / Package Manager** | [Bun](https://bun.sh/)                                                                 |
| **Styling**                   | [Tailwind CSS v4](https://tailwindcss.com/)                                            |
| **UI Components**             | [shadcn/ui](https://ui.shadcn.com/) (radix-nova style)                                 |
| **ORM**                       | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg`                           |
| **Database**                  | [PostgreSQL](https://www.postgresql.org/) (Alpine Docker image)                        |
| **Email**                     | [Resend](https://resend.com/) — React-based transactional email templates              |
| **Charts**                    | [Recharts](https://recharts.org/) — AreaChart & BarChart with custom tooltips          |
| **State Management**          | React Context API (`SettingsContext`) + `useActionState` for server actions            |
| **i18n**                      | [next-intl](https://next-intl-docs.vercel.app/) — EN / FR                              |
| **Containerization**          | [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) |
| **CI/CD**                     | [GitHub Actions](https://github.com/features/actions) → GHCR                           |
| **Auto-updates**              | [Watchtower](https://containrrr.dev/watchtower/)                                       |

---

## 📂 Project Structure

```
/
├── 📁 app/
│   ├── 📁 [locale]/             # i18n-prefixed routes (en / fr)
│   │   ├── dashboard/page.tsx   # KPI cards + temporal charts
│   │   ├── books/page.tsx       # Book list with search & pagination
│   │   ├── members/page.tsx     # Member list with search & pagination
│   │   ├── loans/page.tsx       # Loan list with search, pagination & badges
│   │   ├── settings/page.tsx    # Runtime settings editor
│   │   ├── layout.tsx           # Root layout with providers (theme, intl, settings, toaster)
│   │   └── globals.css          # Tailwind v4 + shadcn CSS variables (oklch)
│   └── 📁 api/
│       └── notify/route.ts      # POST endpoint — cron-triggered email dispatch
│   └── 📁 actions/
│       ├── book.ts              # createBook, updateBook, deleteBook
│       ├── member.ts            # createMember, updateMember, deleteMember
│       ├── loan.ts              # createLoan, updateLoan, deleteLoan, returnLoan, renewLoan
│       └── setting.ts           # updateSetting
│
├── 📁 components/
│   ├── 📁 books/                # BookActionButton, BookCreateButton
│   ├── 📁 loans/                # LoanActionButton (renew/return/edit/delete), LoanCreateButton
│   ├── 📁 members/              # MemberActionButton, MemberCreateButton
│   ├── 📁 charts/               # TemporalSumChart — interactive area/bar chart with groupBy & range
│   ├── 📁 resend/               # React email templates:
│   │   ├── loan-confirmation-template.tsx
│   │   ├── renew-confirmation-template.tsx
│   │   ├── return-confirmation-template.tsx
│   │   ├── due-reminder-template.tsx
│   │   └── overdue-notice-template.tsx
│   ├── 📁 search/               # SearchInput, SearchPagination
│   ├── 📁 settings/             # SettingField, SettingsContext (React Context)
│   ├── 📁 theme/                # ThemeProvider, ThemeToggle
│   └── 📁 others/               # Header, Footer, NavLink, MiniCard, DatePicker, LanguageToggle
│   └── 📁 ui/                   # shadcn/ui base components (Button, Card, Table, Dialog, etc.)
│
├── 📁 i18n/
│   ├── navigation.ts            # next-intl navigation wrappers
│   ├── request.ts               # Locale resolution per request
│   └── routing.ts               # Supported locales: ["en", "fr"], default: "en"
│
├── 📁 messages/
│   ├── en.json                  # English translations
│   └── fr.json                  # French translations
│
├── 📁 lib/
│   ├── db.ts                    # Prisma client with @prisma/adapter-pg
│   ├── resend.ts                # Lazily-initialized Resend singleton
│   ├── settings.ts              # getSettings() — unstable_cache with "settings" tag
│   ├── consts.ts                # App-wide constants (page width, header height, defaults)
│   └── utils.ts                 # cn(), safeNumberParse(), safeStringParse()
│
├── 📁 prisma/
│   ├── schema.prisma            # Models: Member, Book, Loan, Setting
│   └── migrations/              # SQL migration history
│
├── 📁 .github/workflows/
│   └── deploy.yml               # Build & push Docker image to GHCR on push to main/dev
│
├── instrumentation.ts           # Startup hook — upserts default settings into DB
├── proxy.ts                     # next-intl middleware for locale routing
├── Dockerfile                   # Multi-stage build: deps → builder → runner
├── docker-compose.yml           # Production: app + postgres with healthcheck
├── docker-compose-dev.yml       # Development: postgres only (exposed on 5432)
└── prisma.config.ts             # Prisma CLI config
```

---

## 🗄️ Database Schema

```prisma
model Member {
  id           String   @id @default(uuid(7))
  email        String   @unique
  first_name   String
  last_name    String
  phone_number String?
  created_at   DateTime @default(now())
  loans        Loan[]
}

model Book {
  id       String  @id @default(uuid(7))
  bar_code String  @unique
  title    String
  author   String?
  quantity Int     @default(1)
  loans    Loan[]
}

model Loan {
  id            String    @id @default(uuid(7))
  book_id       String
  member_id     String
  start_date    DateTime  @default(now())
  end_date      DateTime
  last_reminder DateTime?
  is_returned   Boolean   @default(false)
  return_date   DateTime?
  renewal_count Int       @default(0)
  book          Book      @relation(...)
  member        Member    @relation(...)
}

model Setting {
  id    String @id @default(uuid(7))
  key   String @unique
  value String
}
```

> IDs use `uuid(7)` — time-sortable UUIDs. Foreign keys use `onDelete: Cascade`.

---

## 📧 Email Templates

All templates are written as React components and rendered server-side via Resend. Each has a distinct visual identity:

| Template                | Accent Color        | Trigger                              |
| ----------------------- | ------------------- | ------------------------------------ |
| `LoanConfirmationEmail` | 🟢 Green `#16a34a`  | New loan created                     |
| `LoanRenewalEmail`      | 🟣 Purple `#7c3aed` | Loan renewed                         |
| `LoanReturnEmail`       | 🩵 Teal `#0d9488`   | Loan marked as returned              |
| `LoanReminderEmail`     | 🔵 Indigo / 🔴 Red  | N days before due date               |
| `OverdueNoticeEmail`    | 🟠→🔴→🟤 Escalating | Past due date (medium/high/critical) |

The `OverdueNoticeEmail` escalates severity based on days overdue: `> 7 days` → high, `> 14 days` → critical.

---

## 🔔 Notification API

```http
POST /api/notify
Authorization: Bearer <EMAIL_CRON_SECRET>
```

On each call, the endpoint:

1. Fetches all non-returned loans due within the configured `REMINDERS_DAYS_BEFORE` window (e.g. `7,3,1`).
2. Fetches all overdue non-returned loans.
3. Sends the appropriate email to each member (skips loans already reminded today via `last_reminder`).
4. Updates `last_reminder` on all processed loans.

Designed to be triggered daily by a `crontab` entry on the host server. Example — call every day at 8am:

```sh
0 8 * * * curl -s -X POST https://your-domain/api/notify -H "Authorization: Bearer <EMAIL_CRON_SECRET>"
```

---

## 🌐 Deployment & CI/CD

- **GitHub Actions** — Two separate workflows:
  - `deploy.yml` — Triggered on push to `main`. Builds and pushes a Docker image to `ghcr.io/ilyas-bouktrane/library-manager:latest`.
  - `test.yml` — Triggered on push to `dev`. Builds the Docker image locally **without pushing** to validate the build before merging to `main`.
- **Watchtower** — Monitors GHCR on the production server and auto-restarts the container when a new image is detected (zero-downtime rolling updates).

The `deploy` script in `package.json` runs `prisma migrate deploy` before starting the server, ensuring migrations are always applied on container startup.

---

## 🐳 Quick Start with Docker

**Prerequisites:** [Docker](https://www.docker.com/products/docker-desktop/) installed.

### Option A — Docker Compose (recommended)

1. **Download the `docker-compose.yml`**

```sh
curl -O https://raw.githubusercontent.com/ilyas-bouktrane/library-manager/main/docker-compose.yml
```

2. **Set your environment variables** directly in `docker-compose.yml` under the `app` service:

```yaml
environment:
  - DATABASE_URL=postgresql://lib_user:lib_pass@db:5432/lib_db
  - RESEND_API_KEY=re_...
  - EMAIL_CRON_SECRET=your_secret
  - RESEND_SENDER_EMAIL=noreply@notify.yourdomain.com
```

3. **Start everything**

```sh
docker compose up -d
```

4. Open [http://localhost:3000](http://localhost:3000)

To stop: `docker compose down`

### Option B — Single `docker run` command

> Requires an already running and accessible PostgreSQL instance.

```sh
docker run -d \
  --name library-manager \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://lib_user:lib_pass@<DB_HOST>:5432/lib_db \
  -e RESEND_API_KEY=re_... \
  -e EMAIL_CRON_SECRET=your_secret \
  -e RESEND_SENDER_EMAIL=noreply@notify.yourdomain.com \
  ghcr.io/ilyas-bouktrane/library-manager:latest
```

---

## ⚙️ Local Development (Without Docker)

**Prerequisites:** [Docker](https://www.docker.com/products/docker-desktop/) + [Bun](https://bun.sh/docs/installation) installed.

1. **Start a local PostgreSQL instance**

```sh
docker compose -f docker-compose-dev.yml up -d
```

2. **Clone & install dependencies**

```sh
git clone https://github.com/ilyas-bouktrane/library-manager.git
cd library-manager
bun install
```

3. **Configure environment**

```sh
cp .env.example .env.local
# Set DATABASE_URL=postgresql://lib_user:lib_pass@localhost:5432/lib_db
```

4. **Push schema & generate client**

```sh
bunx --bun prisma db push
bunx --bun prisma generate
```

5. **Start the dev server**

```sh
bun run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

| Variable              | Description                                           | Required |
| --------------------- | ----------------------------------------------------- | -------- |
| `DATABASE_URL`        | PostgreSQL connection string                          | ✅       |
| `RESEND_API_KEY`      | Resend API key for sending emails                     | ✅       |
| `RESEND_SENDER_EMAIL` | Sender address (e.g. `noreply@notify.yourdomain.com`) | ✅       |
| `EMAIL_CRON_SECRET`   | Bearer secret to protect the `/api/notify` endpoint   | ✅       |

---

## ⚙️ Runtime Settings

The following settings are stored in the database and editable at runtime from the **Settings** page:

| Key                     | Default           | Description                                                    |
| ----------------------- | ----------------- | -------------------------------------------------------------- |
| `LIBRARY_NAME`          | `Library Manager` | Displayed in the header and all emails                         |
| `LOAN_DURATION_DAYS`    | `30`              | Default loan duration when creating a new loan                 |
| `REMINDERS_DAYS_BEFORE` | `7,3,1`           | Comma-separated list of days before due date to send reminders |

Settings are cached with `unstable_cache` and the `"settings"` tag, and invalidated on every update via `revalidateTag`.

---

## 👨‍💻 Contact

This project was created by **Ilyas Bouktrane**.

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ilyas-bouktrane)
[![github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ilyas-bouktrane)

Feel free to reach out for any questions or opportunities!
