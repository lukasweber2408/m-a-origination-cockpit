# M&A Origination Cockpit

A private, lightweight web application for tracking M&A targets, buyers, investors, and deals. Built for personal or small-team use with demo data — no external data providers required.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Full-stack, file-based routing, no separate backend needed for MVP |
| Language | **TypeScript** | Type-safe data models, better DX |
| Styling | **Tailwind CSS v4** | Rapid dark UI, no runtime overhead |
| Icons | **Lucide React** | Consistent, lightweight icon set |
| CSV | **Papa Parse** | Battle-tested CSV import/export |
| Data | **In-memory TypeScript** | Zero setup for MVP — swap for a real DB later |

No external paid data provider is connected. All data is mock/demo.

---

## Running Locally

```bash
# 1. Clone / enter the repo
cd m-a-origination-cockpit

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
npm start
```

---

## Features

### Dashboard
- Summary stats: active targets, buyers, deals, watchlist count
- Visual deal pipeline funnel by stage
- High-priority deals widget
- Top targets by priority score
- Recently updated deals

### Targets
- Table view of all target companies
- Search by name, sector, description
- Filter by status, priority, sector
- Sortable columns (revenue, EBITDA, score, etc.)
- Export to CSV

### Buyers & Investors
- Same table view for PE funds, VCs, family offices
- Type filter (buyer / investor)
- All the same filters and export

### Deals
- Full pipeline table (all 15 sample deals)
- Filters: status, priority, confidence level, sector
- Key metrics: EV, EV/EBITDA, EV/Revenue multiples
- Source and confidence field per deal
- Export to CSV

### Watchlist
- Pinned companies and deals in one view

### Company Detail Pages
- Full profile: sector, HQ, financials, ownership, founded year
- Priority score with visual bar
- Tags and status badges
- Contacts with name, title, email, phone
- Notes field
- Related deals section

### Deal Detail Pages
- Deal parties (target + buyer)
- Pipeline stage progress bar
- Financial metrics: EV, revenue, EBITDA, multiples
- Notes, source, confidence
- Tags

### Market Screening
- 6 sample origination screens with criteria, match count, geography
- Market signal cards (trend, risk, activity)
- Placeholder for real data provider integration

### CSV Import / Export
- Export companies or deals to CSV from any table view
- Import companies from a CSV file (parsed client-side with PapaParse)

---

## Data Model

```
Company
  id, name, type (target | buyer | investor)
  sector, subsector, hq, country
  revenue, ebitda, employees
  status, priority, priorityScore (1-100)
  ownershipType, founded, website, source
  description, notes
  tags[], contacts[], watchlisted
  createdAt, updatedAt

Deal
  id, name
  targetId, buyerId
  status (screening -> closed_won / closed_lost)
  priority, priorityScore
  estimatedEV, estimatedRevenue, estimatedEbitda
  evRevMultiple, evEbitdaMultiple
  dealType, sector
  confidence (confirmed | likely | rumor | speculative)
  source, notes
  tags[], watchlisted
  createdAt, updatedAt, closedAt

Contact
  id, name, title, email, phone
  companyId, isPrimary

Tag
  id, name, color
```

---

## Suggested Next Steps

### 1. Add a Real Database
Replace the in-memory `lib/data.ts` with a proper database:
- **Supabase** (PostgreSQL + REST/realtime, free tier) — easiest upgrade path
- **PlanetScale** or **Neon** (serverless Postgres)
- Use **Prisma** as the ORM for type-safe queries

### 2. Add Authentication
- **Clerk** or **NextAuth.js** for private access control
- Single user or small team — a simple magic link setup works well

### 3. Enable Editing
- Add `POST /api/companies` and `PATCH /api/companies/[id]` routes
- Build inline edit modals or side panels
- Use optimistic updates for a snappy UX

### 4. Connect a Data Provider
- **Dealroom API** or **Crunchbase API** for company enrichment
- **Clearbit** for logo and company metadata
- **LinkedIn Sales Navigator** export -> CSV import

### 5. Automate Origination
- **n8n** or **Make.com** workflow: scrape target lists -> auto-create companies via API
- Email parser: forward a deal deck PDF -> extract company data via Claude API
- Weekly digest email: new deals, status changes, pipeline summary

### 6. Add Notifications
- Slack/email alerts when deal status changes or a new high-priority match is found
- Deal reminder system: "No update in 14 days" flag

### 7. Deploy
- **Vercel** (zero config, instant deploy from this repo)
- Environment variables for DB connection string and auth secret

---

## Project Structure

```
app/
  page.tsx              # Dashboard
  targets/page.tsx      # Targets table
  buyers/page.tsx       # Buyers & Investors table
  deals/
    page.tsx            # Deals table
    [id]/page.tsx       # Deal detail
  companies/
    [id]/page.tsx       # Company detail
  watchlist/page.tsx    # Watchlist
  screening/page.tsx    # Market screening
  layout.tsx            # Root layout with sidebar
  globals.css

components/
  Sidebar.tsx           # Navigation sidebar
  CompaniesTable.tsx    # Reusable table for companies
  DealsTable.tsx        # Reusable table for deals
  Badge.tsx             # Status/tag badges
  ScoreBar.tsx          # Priority score bar
  SearchBar.tsx         # Search input
  PageHeader.tsx        # Page title + actions
  CSVImport.tsx         # CSV import modal

lib/
  types.ts              # TypeScript interfaces
  data.ts               # Mock/demo data + query helpers
  csv.ts                # CSV export/import logic
  utils.ts              # cn(), formatters, status configs
```
