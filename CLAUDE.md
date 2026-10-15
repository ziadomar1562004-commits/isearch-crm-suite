# iSearch CRM — Project Handoff

A real estate CRM for **iSearch**, a sales company in the Egyptian real estate market. Built with React 18, Vite 5, TypeScript 5, Tailwind CSS v3, and shadcn/ui on the Lovable platform.

## Current State (What Works)

### Architecture
- **State management**: React Context providers in `src/contexts/` — no backend yet
  - `AuthContext.tsx` — login/logout, current user, roles (`admin` | `sales`)
  - `DataContext.tsx` — leads, projects, areas, units (persisted to `localStorage` under `crm_*` keys)
  - `ConfigContext.tsx` — lead sources, unit types, sales reps management
  - `LanguageContext.tsx` — EN/AR toggle with RTL support (Cairo font for Arabic)
  - `NotificationContext.tsx` — in-app notifications
- **Routing**: React Router in `src/App.tsx` with `ProtectedRoute` wrapper

### Pages & Features
| Route | Page | Notes |
|---|---|---|
| `/login` | Login | Demo accounts below |
| `/` | Dashboard | Stats + "Most Active Areas" insights ranked by lead count |
| `/leads` | Leads | Admin: full CRUD + assign to sales rep. Sales: view assigned leads, change status only (cannot add) |
| `/follow-up` | Follow Up | Leads with follow-up status, WhatsApp contact buttons |
| `/archive` | Archive | Archived leads with restore |
| `/projects` | Projects | Both roles can add |
| `/areas` | Areas | Both roles can add |
| `/units` | Units | Payment plans (cash / installment with down payment %, years, rest, total), auto price-per-meter, photo upload, Leaflet map location picker |
| `/settings` | Settings | **Admin only**: manage lead sources, unit types, sales team (create with password, edit, ban/restore, delete) |

### Business Rules Implemented
- **Egyptian market**: EGP currency, +20 phone format, Egyptian areas/developers seed data, sizes in m²
- **Role permissions**:
  - Admin: everything
  - Sales: view own assigned leads, add projects/areas/units, change lead status (incl. `archived`), **cannot** add leads or access Settings
- **Phone privacy** (`src/lib/privacy.ts`): sales agents see full phone numbers only for leads assigned to them and units they added (`addedBy` field); other numbers are masked. Admins see everything. WhatsApp button hidden when phone is masked.
- **Data connectivity**: adding a project/area immediately appears in Leads and Units dropdowns; units inherit area info from their project
- **Notifications**: bell in header; sales rep gets notified when a lead is assigned to them
- **Units map**: `src/components/UnitMap.tsx` (Leaflet) for setting/viewing unit location

### Demo Accounts
- Admin: `admin@isearch.com` / `admin123`
- Sales: `ahmed@isearch.com` / `sales123`

## Known Issues / Recent Fixes
- Old `localStorage` data may lack new fields (e.g. `paymentPlan`) — fallbacks added, but a migration/reset helper would be safer
- Auth is fake (hardcoded users in `AuthContext`); passwords stored in plain config state

## TODO Before Deployment (Priority Order)

1. **Connect Lovable Cloud (backend)** — the biggest gap. Currently all data lives in `localStorage` and is lost across devices/browsers:
   - Migrate leads, projects, areas, units, users, config to database tables
   - Replace fake auth with real authentication (sign up/login, password reset)
   - Move role checks and phone-masking to server-side (RLS policies) — current privacy is client-side only and not secure
   - Store unit photos in file storage instead of local state
2. **Real push notifications** — current notifications are in-app only; add email/WhatsApp alerts for lead assignment if needed
3. **Edit/Delete actions** — leads/projects/areas/units have limited or no edit/delete UI in some pages
4. **Search & filters** — no search/filter on Leads and Units tables yet
5. **Form validation** — phone format (+20), email, required fields need consistent validation
6. **Data migration helper** — handle stale `localStorage` records missing newer fields
7. **Expand Arabic translations** — LanguageContext exists but many strings are still English-only
8. **Testing pass** — verify all role-based flows end-to-end (admin vs sales) after backend migration
9. **SEO/metadata** — confirm `index.html` title/description are app-specific
10. **Publish** — use Lovable's Publish button once the above is done

## Conventions
- Semantic design tokens from `src/index.css` only — never hardcode colors in components
- shadcn/ui components in `src/components/ui/`
- Types centralized in `src/types/crm.ts`
- Keep all cross-entity lookups (area names, project names) resolved in `DataContext`, not in pages
