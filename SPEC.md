# SPEC.md — Essencium Frontend v2: Roadmap & Big Picture

## Überblick

Essencium v2 ist das neue Frontend-Boilerplate für Frachtwerk. Es löst das bestehende Essencium Frontend (Next.js + Mantine) ab, das sich in der Praxis als zu komplex und einschränkend erwiesen hat. Neue Projekte starten auf v2, bestehende Projekte bleiben auf dem alten Stack (reine Dependency-Pflege).

### Warum der Wechsel?

- Next.js bringt SSR/API-Routes/Server Components mit, die wir nicht nutzen (Backend ist Spring Boot)
- Mantine als Blackbox verhindert tiefgreifende Anpassungen
- Die Lib als npm-Dependency erzeugt enge Kopplung und blockiert Projekte
- Nach 3-4 Projekten zeigt sich: Tech-Stack-Entscheidungen sind zu eingeschränkt
- Ergebnis: Neue Projekte starten nicht mit Essencium — das Boilerplate verfehlt seinen Zweck

### Was sich ändert

- **React + Vite** statt Next.js (schnellerer Dev-Server, kein Framework-Overhead)
- **TanStack Start im SPA-Modus** statt Next.js App Router (type-safe, SSR bei Bedarf)
  - Kein `index.html` — TanStack Start rendert das HTML via `__root.tsx`
  - `router.tsx` ist die zentrale Router-Konfiguration
  - `routeTree.gen.ts` wird automatisch generiert (nicht manuell bearbeiten)
- **React Compiler** ab Tag 1 (automatische Memoization)
- **shadcn/ui + Base UI** statt Mantine (Copy-Ownership statt Blackbox-Dependency)
- **Copy-statt-Import** für Components (Projekte sind eigenständig nach Scaffolding)
- **4 Repos** statt 1 Monorepo (klarere Trennung der Verantwortlichkeiten)
- **TypeScript maximal strikt** — `strict` + `noUncheckedIndexedAccess` + weitere Flags

### Budget & Team

- **15.000–20.000 EUR** (~34-44 Personentage bei ~50 EUR/h)
- **2 aktive Entwickler + 1 Reviewer + Claude Code**
- **10 Sprints à 2 Wochen** (Mai–September 2026)
- **1-2 PT pro Woche** pro Entwickler (Kapazität ist fluide)

---

## Referenz-Repo

Das bestehende Essencium Frontend liegt unter `../essencium-frontend/` und dient als:

- **Feature-Referenz**: Auth-Flow, User-Management, Rollen/Rechte — die Business-Logik wird übertragen
- **API-Referenz**: REST-Endpoints, Request/Response-Typen, Error-Codes
- **Secrets/Env-Referenz**: `.env`-Struktur und Variablen-Namen übernehmen
- **i18n-Referenz**: Bestehende Translation-Keys und -Struktur als Basis

GitHub: https://github.com/Frachtwerk/essencium-frontend
Docs: https://docs.essencium.dev/

---

## Die 4 Repos

| Repo                         | Zweck                                    | Status         |
| ---------------------------- | ---------------------------------------- | -------------- |
| `essencium-frontend-v2`      | Boilerplate (dieses Repo)                | In Entwicklung |
| `essencium-components`       | Frachtwerk Component Library + Storybook | Ab Sprint 5    |
| `frachtwerk-frontend-config` | ESLint + Prettier npm-Packages           | Ab Sprint 4    |
| `essencium-docs`             | Dokumentation Frontend + Backend         | Ab Sprint 8    |

---

## Vollständiger Tech-Stack

| Kategorie     | Technologie                                      | Begründung                                                                       |
| ------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- |
| Framework     | React 19 + Vite via TanStack Start (SPA)         | Schnellster Dev-Server, SSR bei Bedarf aktivierbar                               |
| Compiler      | React Compiler                                   | Automatische Memoization, kein manuelles useMemo/useCallback                     |
| Routing       | TanStack Router (in Start integriert)            | Type-safe, file-based, `__root.tsx` rendert das HTML-Dokument                    |
| Server-State  | TanStack Query + fetch-Wrapper                   | Caching, Mutations, kein Axios nötig                                             |
| API-Typen     | Hey-API (`@hey-api/openapi-ts`)                  | Generiert TypeScript-Types + TanStack-Query-Helpers aus OpenAPI-Spec automatisch |
| Client-State  | Jotai (optional)                                 | Atomic, lightweight, nur für globalen UI-State                                   |
| UI Primitives | shadcn/ui + Base UI                              | Aktiv maintained (vs. Radix), Copy-Ownership                                     |
| Tabellen      | TanStack Table                                   | Headless, passt zu shadcn/ui DataTable                                           |
| Styling       | Tailwind CSS v4                                  | Utility-first, CSS-first config, keine tailwind.config.ts                        |
| Typing        | TypeScript 6 + strict + noUncheckedIndexedAccess | Zero-any, explizite Return Types, maximale Typsicherheit                         |
| i18n          | i18next + react-i18next                          | Standard, kein Next.js-Wrapper nötig                                             |
| Forms         | React Hook Form + Zod                            | shadcn/ui-Standard, type-safe Validation                                         |
| Datum/Zeit    | dayjs                                            | Lightweight, immutable                                                           |
| Testing       | Vitest + Playwright                              | Unit + E2E, Vite-nativ                                                           |
| Linting       | ESLint 10 + Prettier → später Vite+ (Oxlint)     | ESLint 10 mit @eslint-react nativer Support, Migration geplant                   |

---

## Routing-Konventionen (TanStack Start)

- **File-based Routing** via TanStack Router
- **Pathless Layout-Routes** mit Underscore-Prefix: `_authenticated.tsx`
- **Directory-Pattern** für Route-Children: `_authenticated/dashboard.tsx` (nicht Flat: `_authenticated.dashboard.tsx`)
- **Route-Guards** via `beforeLoad` — nicht via Component-Logik
- **`__root.tsx`** rendert das vollständige HTML-Dokument (`<html>`, `<head>`, `<body>`, Providers)
- **`router.tsx`** ist die zentrale Router-Konfiguration (`getRouter()` + Route-Tree)
- **`routeTree.gen.ts`** wird automatisch generiert — niemals manuell bearbeiten

---

## OpenAPI-Workflow (Type-Generierung)

Kein manuelles Schreiben von TypeScript-Interfaces für Backend-Typen. Die komplette Kette:

```
Spring-Annotationen (@RestController, @GetMapping, …)
       ↓  springdoc-openapi (bereits im Essencium Backend enthalten)
backend/openapi.yaml          ← im Git-Repo versioniert
       ↓  Hey-API (@hey-api/vite-plugin, automatisch bei pnpm dev)
src/generated/client/         ← TypeScript-Types + TanStack-Query-Helpers (gitignored)
       ↓  dein Code
useSuspenseQuery({...findAllUsersOptions(...)})
```

### YAML aktualisieren

Die YAML wird **nicht** automatisch beim Backend-Build erzeugt. Manuell nach Backend-Änderungen:

```bash
curl http://localhost:8080/v3/api-docs.yaml > backend/openapi.yaml
```

Dann die YAML committen — das Frontend regeneriert die Types beim nächsten `pnpm dev` automatisch.

### Was generiert wird

- `src/generated/client/types.gen.ts` — alle TypeScript-Interfaces (z.B. `UserRepresentation`)
- `src/generated/client/@tanstack/react-query.gen.ts` — fertige Query-Option-Factories (z.B. `findAllUsersOptions(...)`)

### Referenz-Implementierung

Die vollständige Konfiguration (inkl. Hot-Reload auf YAML-Änderungen) liegt in `eps-core/frontend/vite.config.ts`.

---

## Roadmap: 10 Sprints

### Sprint 1 (Mai 5–16): Foundation

> Ziel: Leeres Boilerplate startet, baut, lintet.

- [x] **1.1** Repo + Vite Setup (0,5 PT) — Repo erstellen, TanStack Start mit SPA-Modus konfigurieren, `dev` und `build` verifizieren
- [x] **1.2** React Compiler + Tailwind (0,5 PT) — babel-plugin-react-compiler einbinden, Tailwind v4 installieren und konfigurieren
- [x] **1.3** shadcn/ui + Base UI Init (0,5 PT) — `npx shadcn init` mit Base UI, erste Components (Button, Input, Card) hinzufügen
- [x] **1.4** Projektstruktur + Tooling (0,5 PT) — Ordnerstruktur, TypeScript strict flags, ESLint 10/Prettier, Husky + lint-staged, CLAUDE.md + SPEC.md korrigieren
- [ ] **1.5** Environment-Config + CI (1 PT) — .env-Handling, GitHub Actions (Install → Lint → Type-Check → Build), README
- [ ] **1.R** Sprint Review (0,5 PT)

### Sprint 2 (Mai 19–30): Routing & Auth

> Ziel: Boilerplate mit Login-Flow und geschützten Seiten.

- [ ] **2.1** TanStack Router Grundstruktur (0,5 PT) — `_authenticated.tsx` Layout, Login, Dashboard, 404 — Directory-Pattern
- [ ] **2.2** API-Client + Type-Generierung (1 PT) — Hey-API (`@hey-api/openapi-ts` + `@hey-api/vite-plugin`) einbinden; `backend/openapi.yaml` als Quelle; generiert `src/generated/client/` (Types + TanStack-Query-Helpers) automatisch bei `pnpm dev`; Hey-API-Client mit Auth-Token-Injection, Base-URL und 401-Redirect konfigurieren — kein handgeschriebener fetch-Wrapper nötig
- [ ] **2.3** TanStack Query Setup (0,5 PT) — QueryClient, `useCurrentUser()`, `useLogin()`, DevTools
- [ ] **2.4** Authentication-Flow (1 PT) — Login-Seite mit RHF + Zod, Token-Handling, Refresh, Logout, Route-Guard via `beforeLoad`
- [ ] **2.5** i18n + dayjs (0,5 PT) — i18next Setup, Language-Detection, Basis-Translations (de/en), dayjs mit Locale
- [ ] **2.R** Sprint Review (0,5 PT)

### Sprint 3 (Jun 2–13): Core Pages & Layout

> Ziel: Boilerplate deckt den Kern-Scope des aktuellen Essencium ab.

- [ ] **3.1** Sidebar (1 PT) — shadcn/ui Sidebar, Navigation-Items, Responsive (Collapsible/Drawer), Active-State
- [ ] **3.2** Header + Breadcrumbs (0,5 PT) — Sidebar-Toggle, Auto-Breadcrumbs aus Router, User-Dropdown, Language-Switcher
- [ ] **3.3** User-Liste (0,5 PT) — TanStack Table mit Sortierung, Pagination, Suche, Server-side via TanStack Query
- [ ] **3.4** User Create/Edit (0,5 PT) — RHF + Zod Formular, Create/Edit via Route-Param, Mutations, Toast
- [ ] **3.5** Rollen & Rechte (0,5 PT) — Rollen-Liste, Rechte-Matrix, `<CanAccess>` Component, Route-Guards
- [ ] **3.6** Error-Handling + Toasts (0,5 PT) — Error-Boundary, Sonner Toasts, API-Error-Handler, 403/500-Seiten
- [ ] **3.R** Sprint Review (0,5 PT)

### Sprint 4 (Jun 16–27): Feinschliff + Config-Repo

> Ziel: Boilerplate feature-complete. Config-Packages auf npm.

- [ ] **4.1** Profil + Settings (0,5 PT) — Eigene Daten bearbeiten, Passwort ändern, Sprache/Theme-Einstellungen
- [ ] **4.2** Dark Mode + Theming (0,5 PT) — Tailwind dark: Klassen, Theme-Toggle, Frachtwerk-Farben als CSS-Variablen
- [ ] **4.3** DataTable-Component (0,5 PT) — Wiederverwendbare DataTable (TanStack Table + shadcn/ui), Server/Client-Variante
- [ ] **4.4** Config-Repo aufsetzen (0,5 PT) — Repo `frachtwerk-frontend-config`, ESLint + Prettier extrahieren, pnpm Workspace
- [ ] **4.5** Config-Repo CI + Publishing (0,5 PT) — GitHub Actions, Release-Please, Boilerplate auf npm-Packages umstellen
- [ ] **4.6** Boilerplate-Dokumentation (0,5 PT) — README, Code-Kommentare, CONTRIBUTING.md, `CLAUDE.md`
- [ ] **4.R** Sprint Review (0,5 PT)

### Sprint 5 (Jun 30–Jul 11): Component Library Setup

> Ziel: Component Library läuft mit Storybook und ersten Components.

- [ ] **5.1** Repo + Storybook Init (0,5 PT) — Repo `essencium-components`, Storybook mit Vite-Builder, Tailwind + Base UI
- [ ] **5.2** Story-Conventions (0,5 PT) — Ordnerstruktur, Story-Template, Autodocs, Contribution-Guide
- [ ] **5.3** Generische Modal-Component (0,5 PT) — Confirmation/CRUD/Info Varianten, Story
- [ ] **5.4** ProgressBar (0,5 PT) — Frachtwerk-Styling, Varianten, Story
- [ ] **5.5** Freitext-Input mit Counter (0,5 PT) — Zeichen-Counter, Validation-Feedback, Story
- [ ] **5.6** Menübox (0,5 PT) — Icon + Name + Link Grid, Story
- [ ] **5.R** Sprint Review (0,5 PT)

### Sprint 6 (Jul 14–25): Components Batch 1

> Ziel: ~9 Components in der Library.

- [ ] **6.1** User-Liste mit Suchfeld & Toggle (0,5 PT)
- [ ] **6.2** Durchsuchbare Icon-Liste (0,5 PT)
- [ ] **6.3** Zeitraum-Inputs: Uhrzeit (0,5 PT)
- [ ] **6.4** Zeitraum-Inputs: Datum + Kombiniert (0,5 PT)
- [ ] **6.5** Carousel (0,5 PT)
- [ ] **6.6** File-Liste mit Download & Edit (0,5 PT)
- [ ] **6.R** Sprint Review (0,5 PT)

### Sprint 7 (Jul 28–Aug 8): Components Batch 2

> Ziel: ~13 Components. Die komplexesten sind durch.

- [ ] **7.1** Tree-Liste: Grundstruktur (0,5 PT)
- [ ] **7.2** Tree-Liste: Suche + Highlight (0,5 PT)
- [ ] **7.3** Tree-Liste: Edit-Funktionen (0,5 PT)
- [ ] **7.4** Select mit Tree-Dropdown (0,5 PT)
- [ ] **7.5** Formbuilder: Schema + Rendering (0,5 PT)
- [ ] **7.6** Formbuilder: Validation + Layout + Conditionals (0,5 PT)
- [ ] **7.7** Dropdowns mit Component-Options (0,5 PT)
- [ ] **7.R** Sprint Review (0,5 PT)

### Sprint 8 (Aug 11–22): Letzte Components + Docs

> Ziel: Alle 15 Components fertig. Docs-Seite live.

- [ ] **8.1** Stepper mit Icons (0,5 PT)
- [ ] **8.2** Download Utility Function + Unit-Tests (0,5 PT)
- [ ] **8.3** Docs-Repo aufsetzen (0,5 PT) — Repo `essencium-docs`, Framework, Deploy-Pipeline
- [ ] **8.4** Docs: Architektur + Tech-Stack (0,5 PT)
- [ ] **8.5** Docs: Boilerplate-Guide (0,5 PT)
- [ ] **8.6** Docs: Component Library Guide (0,5 PT)
- [ ] **8.R** Sprint Review (0,5 PT)

### Sprint 9 (Aug 25–Sep 5): Integration & QA

> Ziel: Alles integriert, getestet, reviewed.

- [ ] **9.1** End-to-End Integration (0,5 PT) — Frisches Projekt aus Boilerplate erstellen, Components integrieren
- [ ] **9.2** Unit-Tests (1 PT) — Vitest für kritische Components und Hooks, Coverage-Ziel 70%
- [ ] **9.3** E2E-Tests (0,5 PT) — Playwright: Login, User-CRUD, Navigation, Logout
- [ ] **9.4** KI-Kontextdateien (0,5 PT) — CLAUDE.md + SPEC.md für alle Repos finalisieren
- [ ] **9.5** Security + Performance (0,5 PT) — npm audit, Lighthouse, Bundle-Size, CSP-Empfehlung
- [ ] **9.R** Sprint Review (0,5 PT)

### Sprint 10 (Sep 8–19): Polish & Release

> Ziel: v1.0.0 released, vorgestellt, erstes Projekt startet.

- [ ] **10.1** Feedback einarbeiten (1 PT)
- [ ] **10.2** Release vorbereiten (0,5 PT) — v1.0.0, Release Notes, Changelog, GitHub Releases
- [ ] **10.3** Gilde-Präsentationen (0,5 PT) — Live-Demo Frontend-Gilde + UI/UX-Gilde
- [ ] **10.4** Erstes Projekt vorbereiten (0,5 PT) — Konkretes Projekt identifizieren, Handover
- [ ] **10.R** Sprint Review (0,5 PT)

---

## Component Library — identifizierte Components

Aus dem Projekt-Screening (Jourfix, UDBZ, OSL):

| #   | Component                                | Komplexität | Sprint |
| --- | ---------------------------------------- | ----------- | ------ |
| 1   | Generische Modal-Component               | Mittel      | 5      |
| 2   | ProgressBar                              | Einfach     | 5      |
| 3   | Freitext-Input mit Counter               | Einfach     | 5      |
| 4   | Menübox (Submenü-Alternative)            | Einfach     | 5      |
| 5   | User-Liste mit Suchfeld & Toggle         | Mittel      | 6      |
| 6   | Durchsuchbare Icon-Liste                 | Mittel      | 6      |
| 7   | Zeitraum- & Datum-Inputs (Uhrzeit)       | Mittel      | 6      |
| 8   | Zeitraum- & Datum-Inputs (Datum + Kombi) | Mittel      | 6      |
| 9   | Carousel                                 | Mittel      | 6      |
| 10  | File-Liste mit Download & Edit           | Mittel      | 6      |
| 11  | Tree-Liste mit Suche & Edit              | Hoch        | 7      |
| 12  | Select mit Tree-Dropdown                 | Hoch        | 7      |
| 13  | Generischer Formbuilder                  | Hoch        | 7      |
| 14  | Dropdowns mit Component-Options          | Mittel      | 7      |
| 15  | Stepper mit Icons                        | Mittel      | 8      |
| 16  | Download Utility Function                | Einfach     | 8      |

---

## Für später eingeplant (Post-v1.0)

### Vite+ Migration

ESLint + Prettier durch Oxlint + Oxfmt ersetzen, alles in eine `vite.config.ts`. Sobald Vite+ aus dem Alpha raus ist und die TanStack-Start-Integration steht. Betrifft Repo `frachtwerk-frontend-config` — das könnte dann obsolet werden.

### TanStack Start SSR

Im SPA-Modus gestartet. Bei Bedarf kann jedes Projekt selektives SSR pro Route aktivieren — eine Config-Änderung, kein Refactoring. Relevant, sobald ein Projekt SEO oder schnellere First-Paint-Zeiten braucht.

---

## Definition of Done (pro Task)

- [ ] Code ist geschrieben und funktioniert
- [ ] TypeScript strict mode — keine `any`, kein `@ts-ignore`, kein `@ts-expect-error` ohne Kommentar
- [ ] Alle exportierten Funktionen haben explizite Return Types
- [ ] Kein `as`-Casting ohne Kommentar warum
- [ ] Array-Zugriffe behandeln `T | undefined` (via `noUncheckedIndexedAccess`)
- [ ] Lint + Format clean (`pnpm lint && pnpm format:check`)
- [ ] Für Components: Story in Storybook existiert mit mindestens Default + 2 Varianten
- [ ] Für Features: Mindestens ein Unit-Test für Happy Path
- [ ] PR erstellt, Review durch dritten Dev
- [ ] CLAUDE.md / SPEC.md aktualisiert, falls sich Architekturentscheidungen ändern
