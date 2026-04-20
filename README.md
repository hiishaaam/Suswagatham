<div align="center">
  <h1 align="center">WeddWise</h1>
  <p align="center">
    <strong>A Premium Event & RSVP Management Platform</strong>
  </p>
</div>

---

## 📖 Project Overview

**WeddWise** is a sophisticated full-stack wedding management platform designed to handle the complexity of modern celebrations. It provides an end-to-end solution for event planning, guest tracking, and logistics, specifically tailored for the scale of Indian weddings.

### Key Features
- **Magic Link RSVPs**: Token-based access for guests—no login required.
- **Multi-Event Support**: Track Reception, Haldi, Sangeet, etc., under a single parent event.
- **Headcount Analytics**: Real-time RSVP monitoring with dietary preference tracking.
- **Caterer Portal**: Automated PDF reports for kitchen staff including a 10% safety buffer.
- **QR Code Invites**: Instant QR generation for digital and physical venue displays.
- **WhatsApp Integration**: Perfectly formatted sharing links for guest distribution.
- **Secure Payments**: Integrated Razorpay flow for premium feature unlocking.
- **Automated Emails**: Confirmation and notification system via Resend.

## 🚀 Tech Stack

### Frontend & UI
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: Tailwind CSS v4 (using the @tailwindcss/postcss plugin)
- **Animations**: `motion` (Framer Motion)
- **Design System**: A luxury-focused palette utilizing `Ivory`, `Ink`, `Gold`, and `Success/Error` tokens.

### Backend & Infrastructure
- **Database**: PostgreSQL (via Supabase)
- **Auth & Security**: Supabase Auth + Granular Row-Level Security (RLS).
- **Payments**: Razorpay Node.js SDK
- **Email**: Resend API
- **AI**: Google Generative AI (Gemini) for template assistance.

---

## 📂 Project Architecture

```
/
├── app/                  # Next.js App Router
│   ├── admin/            # Client management & administrative control
│   ├── api/              # Backend services (Payments, Email, RSVP logic)
│   ├── caterer/          # Scoped portals for food logistics
│   ├── dashboard/        # Event-specific owner dashboards
│   ├── events/[slug]/    # High-end public guest-facing RSVP pages
│   ├── preview/          # Real-time state-based event previews
│   └── template-preview/ # UI testing for invitation templates
├── components/           
│   ├── landing/          # Luxury landing page sections
│   ├── templates/        # Modular invitation themes (MidnightBloom, etc.)
│   └── ui/               # Reusable premium components (Toasts, Skeletons)
├── hooks/                # Custom React hooks (useCountUp, useIntersectionObserver)
├── lib/                  # Service clients (Supabase, Razorpay, Resend)
├── supabase/
│   └── migrations/       # SQL migrations (RLS, Schema, Payment columns)
└── public/               # Static assets & brand media
```

---

## 🗄 Database Schema (Supabase)

The database uses a relational model with strong enforcement of data integrity and owner scoping:

- **`clients`**: B2B client accounts and subscription tracking.
- **`events`**: Core configuration including templates, slugs, and status.
- **`sub_events`**: Child events mapped to a parent celebration.
- **`guest_tokens`**: Encrypted Base64 tokens for secure guest verification.
- **`rsvps`**: Granular headcount (Veg/Non-Veg) and guest details.
- **`payment_history`**: Tracking Razorpay orders and verification status.
- **`event_summary`**: SQL View for low-latency dashboard analytics.

---

## 🔍 Validation Report (Current State)

Following a comprehensive project audit, here is the current validation status:

### ✅ Verified Strengths
1. **Premium Aesthetic**: The UI/UX matches the "Luxury" requirement with advanced glassmorphism and motion design.
2. **Security Architecture**: RLS policies are strictly implemented to scope data to authenticated users/admins while allowing `anon` access where necessary (RSVP flow).
3. **Operational Readiness**: The inclusion of kitchen reports and multi-event logic makes this a production-ready operational tool, not just a "form builder."

### ⚠️ Technical Debt & Recommendations
1. **Linting Status**: The project currently reports 99 linting issues (mostly `react-hooks/set-state-in-effect`). These should be refactored to use derived state or better effect management to ensure React 19 stability.
2. **Data Hydration**: Some sections of the landing page use hardcoded demo data; these should be connected to a "Live Stats" API for total authenticity.
3. **Payment Verification**: Ensure the `api/payments/verify` route handles webhooks securely to double-check payment status if the client-side redirect fails.

---

## 🛠 Running Locally

1. **Install dependencies:**
    ```bash
    npm install
    ```
2. **Environment Setup (.env.local):**
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role
    RAZORPAY_KEY_ID=your_id
    RAZORPAY_KEY_SECRET=your_secret
    RESEND_API_KEY=your_resend_key
    GEMINI_API_KEY=your_gemini_key
    ```
3. **Database Setup:**
    Apply migrations in `supabase/migrations/` in sequential order.
4. **Run Dev Server:**
    ```bash
    npm run dev
    ```

