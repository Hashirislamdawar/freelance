# Freelance Business OS

A premium freelancing business operating system — CRM, projects, invoicing, income,
expenses and analytics — built as a React + Vite single-page app. All data is stored
locally in your browser (no account, no server), with JSON backup + CSV export.

## Run it

```bash
cd freelance-os
npm install
npm run dev        # start the dev server (Vite prints a local URL)
```

Then open the URL it prints (usually http://localhost:5173).

## Build for production

```bash
npm run build      # outputs static files to /dist
npm run preview    # preview the production build
```

The `dist/` folder is fully static — drop it on any static host (Netlify, Vercel,
GitHub Pages, or just open it locally) and it works offline.

## Modules

- **Dashboard** — 10 live KPIs + 8 charts (pipeline, sources, revenue, forecast…).
- **Leads** — sales-pipeline CRM with auto weighted value and overdue follow-up alerts.
- **Projects** — active work with progress bars and deadline alerts.
- **Invoices** — billing with auto tax/total and overdue detection.
- **Income** — goal vs actual, monthly breakdown and run-rate forecast (auto from paid invoices).
- **Expenses** — costs by category with net profit & margin.
- **Analytics** — conversion, deal economics, CLV, profitability + charts.
- **Guide** — workflow help, sample data, and reset/clear.

## Data

State persists to `localStorage` under `freelance-os-data-v1`. Use **Export backup**
(sidebar or Settings) to save a JSON snapshot, and **Import backup** to restore it.

## Multi-currency

Pick your currency in **Settings ▸ Currency** (USD, EUR, GBP, INR, PKR, AUD, CAD, AED,
SGD, NGN, ZAR, BRL, JPY). It applies everywhere, including PDF invoices.

## PDF invoices

On the **Invoices** tab, click the PDF icon on any row to download a branded invoice.
Set your business name, email, address and payment terms in **Settings ▸ Invoice branding**.

## Cloud sync + login (optional)

The app is local-first and works with no account. To enable login + multi-device sync,
connect your own free [Supabase](https://supabase.com) project:

1. Create a Supabase project.
2. In the SQL editor, run:

   ```sql
   create table if not exists app_state (
     user_id uuid primary key references auth.users on delete cascade,
     data jsonb not null default '{}'::jsonb,
     updated_at timestamptz not null default now()
   );
   alter table app_state enable row level security;
   create policy "own row - select" on app_state for select using (auth.uid() = user_id);
   create policy "own row - upsert" on app_state for insert with check (auth.uid() = user_id);
   create policy "own row - update" on app_state for update using (auth.uid() = user_id);
   ```

3. Copy `.env.example` to `.env` and fill in your project URL + anon key
   (Project Settings ▸ API):

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

4. Restart `npm run dev`. A login form appears in **Settings ▸ Cloud sync**.
   After signing in, data syncs automatically (debounced) and pulls on login.

> Without these keys the app stays in local-only mode — no errors, no cloud calls.

## Deploy

The build output (`dist/`) is fully static. Three turn-key options are included:

- **Vercel** — import the repo, set the root to `freelance-os/`. `vercel.json` handles the rest.
- **Netlify** — `netlify.toml` sets build command + SPA redirects.
- **GitHub Pages** — push `freelance-os` as its own repo; the included
  `.github/workflows/deploy-pages.yml` builds and deploys on push to `main`
  (set Pages source to "GitHub Actions"). `base: './'` in `vite.config.js` makes
  it work from any sub-path.

For cloud sync in production, add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
as environment variables / secrets on your host.
