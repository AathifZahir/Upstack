# Upstack

<p align="center">
  <img src="https://img.shields.io/badge/Framework-TanStack%20Start-FF4154?style=for-the-badge&logo=react&logoColor=white" alt="Framework" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Database" />
  <img src="https://img.shields.io/badge/Runtime-Bun-f9f1e1?style=for-the-badge&logo=bun&logoColor=black" alt="Runtime" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="Language" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Styling" />
</p>

Upstack is a high-performance feature request and upvoting platform built for product teams to prioritize what to build next. It allows customers and team members to submit ideas, vote on their favorites, and participate in the product development lifecycle through a transparent feedback loop.

![Home Hero](file:///C:/Users/aathi/.gemini/antigravity/brain/0e434096-05cf-4ae0-87ba-b0c448fd5af0/home_hero_1775925853743.png)

## Key Features

- **Team Management**: Robust multi-tenant support where team leads and global admins can manage members, invites, and team settings.
- **Feature Requests**: Simple yet powerful submission flow for new ideas with categorization and status tracking.
- **Upvoting System**: Intelligent voting system that prevents duplicate votes and highlights the most supported ideas.
- **Discussion Threads**: Nested commenting system for each feature request to foster deep collaboration.
- **Role-Based Access**: Granular security model with Leads, Members, and Global Admins powered by Supabase RLS.
- **Dynamic Dashboard**: Real-time filtering and sorting of ideas based on status, category, and popularity.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack React framework with SSR)
- **Language**: TypeScript with [Bun](https://bun.sh/) as the primary runtime/package manager
- **Frontend**: [React 19](https://react.dev/), [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + PostgREST)
- **Security**: Supabase Auth + Row Level Security (RLS)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) via Wrangler

## Getting Started

### 1. Prerequisites
- [Bun](https://bun.sh/) (v1.x recommended)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local database development)
- A Supabase Project (for API keys)

### 2. Installation
```bash
git clone <repository-url>
cd remix-of-upvote
bun install
```

### 3. Environment Setup
Copy the example environment file and fill in your Supabase credentials:
```bash
cp .env .env.local
```
Required variables:
| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key |

### 4. Database Setup
Initialize the local Supabase environment (optional if using a remote instance):
```bash
supabase start
supabase db push
```

### 5. Run Locally
```bash
bun dev
```
Open [http://localhost:8080](http://localhost:8080) to view the application.

## Architecture

Upstack utilizes a decentralized data flow where the frontend communicates directly with Supabase via PostgREST. Security is enforced at the database layer using **Row Level Security (RLS)**.

### Request Lifecycle
1. User interacts with a **TanStack Router** protected route.
2. Data is fetched/mutated via **TanStack Query** calling the **Supabase Client**.
3. **Supabase RLS** verifies the user's role (`lead`/`member`) and team membership.
4. Server response is rendered with **SSR** via **TanStack Start**.

### Database Schema Reference

| Table | Description |
| --- | --- |
| `profiles` | User profile data (name, email, avatar) linked to Auth. |
| `teams` | Team metadata including `name` and `invite_code`. |
| `team_members` | Join table for users and teams with `role` (lead/member). |
| `feature_requests` | Core data for ideas (title, description, status). |
| `votes` | Atomic records of user support for specific requests. |
| `comments` | User feedback threads for specific requests. |
| `user_roles` | Global system roles (e.g., global `admin`). |

## Deployment

### Cloudflare Pages
The project is optimized for Cloudflare's global network.

1. Build the project: `bun build`
2. Deploy via Wrangler:
```bash
wrangler pages deploy dist
```

---

Built with ❤️ by the Upstack Team.
