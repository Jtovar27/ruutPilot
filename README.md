# RuutPilot

RuutPilot is a validation-first web app for the RuutDev BOS concept: a revenue command center for small service businesses, starting with med and beauty spas.

The current MVP is focused on validation, not the full authenticated SaaS loop. It includes:

- Landing page for the free Revenue Leakage Audit
- Audit intake form backed by Supabase
- Clickable spa-focused product demo
- Thank-you confirmation page
- Supabase migration for `audit_requests`

## Routes

- `/` - public landing page
- `/audit` - multi-step audit request form
- `/demo` - clickable RuutPilot prototype
- `/thank-you` - audit request confirmation

Existing authenticated dashboard routes are still in the codebase for later reuse.

## Environment

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Existing dashboard, AI, email, and Stripe routes may also use:

```bash
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_AGENCY_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase

Apply the audit request migration:

```bash
supabase/migrations/20260616_audit_requests.sql
```

The `audit_requests` table has RLS enabled and allows public insert only. Public users cannot read submissions.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```
