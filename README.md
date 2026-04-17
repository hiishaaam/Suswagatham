<div align="center">
  <h1 align="center">WeddWise</h1>
  <p align="center">
    <strong>A Premium Event & RSVP Management Platform</strong>
  </p>
</div>

---

## 📖 Project Overview

**WeddWise** is a sophisticated full-stack web application designed for comprehensive wedding event management. Built with modern web technologies, it features an elegant user interface, powerful administrative capabilities, and secure token-based access. The platform caters to different roles including Admins, Clients, Guests, and Caterers, aiming to provide a high-end, seamless RSVP and planning experience.

## 🚀 Tech Stack

### Frontend Core
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: TypeScript

### Styling & UI
- **CSS Framework**: Tailwind CSS v4
- **Animations**: `motion` (Framer Motion API), `tw-animate-css`
- **Icons**: `lucide-react`
- **Class Merging**: `tailwind-merge`, `clsx`, `cva`
- **Design System**: Strict luxury palette heavily utilizing `ivory`, `ink`, `gold`, and `muted` variables, leveraging global CSS custom properties and Next.js CSS variables.

### Backend & Database
- **Database**: PostgreSQL (via Supabase)
- **Client Library**: `@supabase/supabase-js`, `@supabase/ssr`
- **Authentication/Security**: Row-Level Security (RLS), custom Base64URL token generation for secure scoped access.

### Additional Utilities
- **AI Integration**: `@google/genai`
- **Data Handling**: `papaparse` (CSV), `pdf-lib` (Document generation)
- **Forms**: `react-hook-form` + `@hookform/resolvers`
- **Tools**: `qrcode` for RSVP links and ticket management.

---

## 📂 Project Architecture

```
/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── [slug]/           # Dynamic public guest-facing pages
│   ├── admin/            # Central Command Center for managing all clients/events
│   ├── api/              # Server-side API logic
│   ├── caterer/          # Scoped access portals for caterers
│   ├── dashboard/        # Event-specific dashboard for tracking RSVP analytics
│   └── globals.css       # Global stylesheet with custom page transitions
├── components/           
│   └── ui/               # Reusable modular UI components (Skeletons, StatusBadge, Toasts, etc.)
├── hooks/                # Custom React Hooks
├── lib/                  # Utilities, Supabase Config, Admin Clients, Database helpers
├── supabase/
│   └── migrations/       # SQL version control for the database schema (001_initial.sql)
└── public/               # Static assets
```

---

## 🗄 Database Schema (Supabase)

The database incorporates strong relational mapping and real-time triggers:

- **`clients`**: Handles B2B and B2C client bases and subscription tiers.
- **`events`**: Core table housing logistical data, visual preferences (templates), languages, and cutoffs.
- **`sub_events`**: Enables tracking multi-stage events (e.g., Reception, Haldi) against a single parent event.
- **`guest_tokens`**: Facilitates magic-link RSVP logic bounding guest limits.
- **`rsvps`**: Granular headcount tracking including food preferences (`veg`, `non_veg`, `both`).
- **`link_clicks`**: Traffic and interactivity analysis.
- **`caterer_access`**: Secure portals restricted to caterer views.
- **`event_summary`**: A powerful SQL View to pull aggregated RSVP statistics at minimal compute cost.

---

## 🔍 Validation Analysis & Recommendations

Upon an extensive analysis of the application's structure, files, and architecture, here is a validation report:

### Strengths & Code Quality
1. **Design Excellence**: The project perfectly executes a premium brand identity. The CSS architecture incorporates luxury typography and fluid layouts matching high-end event expectations.
2. **Robust Data Security**: You've smartly enabled Row Level Security (RLS) across all core tables and effectively implemented custom JWT-like `guest_tokens` allowing server-side validation without requiring guests to formally create accounts.
3. **Advanced Integrations**: The presence of PDF generation (`pdf-lib`), CSV manipulation (`papaparse`), QR-code ticketing, and AI integrations showcases the app's capability to operate as a full B2B/SaaS platform.
4. **App Router Mastery**: Deeply integrated with Next.js specific advantages (server components to connect to Supabase `ssr` libraries and dynamic route scopes like `[eventId]` and `[slug]`).

### Areas for Improvement / Next Steps
1. **Frontend Home Page Syncing**: The `app/page.tsx` acts effectively as a UI preview template ("Live Preview"), but its data is currently hardcoded for the demo. Future iterations should fetch data to form a dynamic landing page or actively redirect to `/admin` or `/dashboard`.
2. **Error Handling**: `error.tsx` is defined well at root-level, but deploying `components/ui/SectionErrorBoundary.tsx` more deeply into nested route layouts (`/dashboard/[eventId]`/`page.tsx`) will ensure UI stability if an isolated widget (like charting or RSVPs) fails.
3. **Optimizing Queries**: Consider expanding custom Supabase RPC (Remote Procedure Calls) to avoid excessive Client-side/Server Component map-reduces, pushing calculations like the "Attending Rate" heavily to the SQL layer (extending the `event_summary` view).

---

## 🛠 Running Locally

**Prerequisites:** Node.js, npm, matching Supabase instance

1. **Install dependencies:**
    ```bash
    npm install
    ```
2. **Environment Configuration:**
    Verify your `.env.local` contains the following required variables:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...
    GEMINI_API_KEY=...
    ```
3. **Database Configuration:**
   Apply `supabase/migrations/001_initial.sql` directly to your Supabase instance to prepare tables, roles, triggers, and views. 

4. **Run the app:**
    ```bash
    npm run dev
    ```
    View the platform at `http://localhost:3000`.
