# Journal Dental Pro

A full-featured Next.js dental research journal website with a built-in CMS admin panel.

## Features

- **Public website**: Homepage, articles, issues, about, editorial team, submissions, contact
- **Admin CMS**: Create, edit, and delete blog posts/articles
- **Content management**: Announcements, journal issues, editorial team
- **Submissions**: Authors can submit papers; admins review and update status
- **Contact**: Contact form with admin inbox
- **Authentication**: Secure admin login with JWT sessions

## Getting Started

### Prerequisites

- Node.js 18+

### Setup

```bash
cd journal-dental-pro
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Login

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `admin@journaldental.com`
- Password: `admin123`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:setup` | Run migrations and seed database |
| `npm run db:seed` | Seed sample data |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- Jose (JWT auth)
