# CLAUDE.md — Essencium Frontend v2

## Was ist dieses Projekt?

Essencium Frontend v2 ist das neue Boilerplate für Frontend-Projekte bei Frachtwerk. Es ersetzt das bestehende Essencium Frontend (Next.js + Mantine) durch einen modernen, schlanken Stack: React + Vite + TanStack Start + shadcn/ui + Base UI.

Das Ziel: Jedes neue Frontend-Projekt bei Frachtwerk startet mit diesem Boilerplate und ist danach eigenständig — kein Dependency-Lock-in, kein Framework-Overhead.

## Gesamtplan & Roadmap

Der vollständige Plan — Warum der Wechsel, Budget, alle 10 Sprints, Component Library Backlog, Post-v1.0 Ausblick und Definition of Done — liegt in **[SPEC.md](./SPEC.md)**.

Wenn du den Kontext hinter einer Architekturentscheidung brauchst oder wissen willst, was als nächstes ansteht: SPEC.md ist die Referenz.

## Referenz-Repo

Das bestehende Essencium Frontend liegt im gleichen Verzeichnis:

```
../essencium-frontend/
```

**Nutze dieses Repo stets als Referenz** für:
- Bestehende Feature-Implementierungen (Auth-Flow, User-Management, Rollen/Rechte)
- API-Endpoints und Datenstrukturen (die REST-API des Spring-Boot-Backends bleibt gleich)
- Secrets und Environment-Variablen (`.env`-Struktur übernehmen)
- i18n-Translations (bestehende Keys und Struktur als Ausgangspunkt)
- Business-Logik, die 1:1 übertragen werden soll

**Wichtig:** Kopiere keine Implementierungsdetails blind — das alte Repo nutzt Next.js + Mantine, wir nutzen einen komplett anderen Stack. Übernimm die *Logik* und *Datenstrukturen*, nicht den Code.

## Tech-Stack

| Kategorie | Technologie |
|---|---|
| Framework | React 19 + Vite (via TanStack Start, SPA-Modus) |
| Compiler | React Compiler (automatische Memoization) |
| Routing | TanStack Router (in TanStack Start integriert) |
| Server-State | TanStack Query + dünner fetch-Wrapper (kein Axios) |
| Client-State | Jotai (optional, für globalen UI-State) |
| UI Primitives | shadcn/ui + Base UI (nicht Radix) |
| Tabellen | TanStack Table + shadcn/ui DataTable |
| Styling | Tailwind CSS |
| i18n | i18next + react-i18next |
| Forms | React Hook Form + Zod |
| Datum/Zeit | dayjs |
| Testing | Vitest (Unit) + Playwright (E2E) |
| Linting | ESLint + Prettier (Migration zu Vite+/Oxlint geplant) |
| Package Manager | pnpm |

## Projektstruktur

```
essencium-frontend-v2/
├── src/
│   ├── api/                  # fetch-Wrapper, API-Client, Query-Keys
│   │   ├── client.ts         # Basis fetch-Wrapper mit Auth-Token-Injection
│   │   └── queries/          # TanStack Query Hooks (useUsers, useRoles, etc.)
│   ├── components/
│   │   ├── ui/               # shadcn/ui + Base UI Components (via CLI kopiert)
│   │   └── shared/           # Projekt-eigene wiederverwendbare Components
│   ├── hooks/                # Custom Hooks (useAuth, usePermissions, etc.)
│   ├── lib/                  # Utilities (dayjs-Config, i18n-Config, Zod-Schemas)
│   ├── routes/               # TanStack Router file-based Routes
│   │   ├── __root.tsx        # Root-Layout mit Providers
│   │   ├── _auth.tsx         # Layout für authentifizierte Seiten (Sidebar, Header)
│   │   ├── _auth/
│   │   │   ├── dashboard.tsx
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   ├── profile.tsx
│   │   │   └── settings.tsx
│   │   └── login.tsx         # Öffentliche Login-Seite
│   └── styles/
│       └── globals.css       # Tailwind + CSS-Variablen
├── public/
├── tests/
│   ├── unit/                 # Vitest Unit-Tests
│   └── e2e/                  # Playwright E2E-Tests
├── .cursor/
│   └── rules                 # Cursor AI Kontext-Regeln
├── CLAUDE.md                 # Diese Datei
├── SPEC.md                   # Roadmap und Gesamtbild
├── vite.config.ts            # TanStack Start + React Compiler Config
├── tailwind.config.ts
├── components.json           # shadcn/ui Config (Base UI)
├── tsconfig.json
├── package.json
└── .env.example
```

## Architektur-Entscheidungen

### TanStack Start im SPA-Modus
Wir nutzen TanStack Start statt TanStack Router allein. Der SPA-Modus ist aktiviert (`spa: { enabled: true }` in der Vite-Config). Das bedeutet: Kein SSR, kein Server-Rendering — aber die Möglichkeit, beides pro Route zu aktivieren, wenn ein Projekt das braucht. Der Overhead gegenüber Router-allein ist eine Config-Zeile.

### shadcn/ui + Base UI (nicht Radix)
Radix UI wird fragwürdig maintained seit der WorkOS-Akquisition. Base UI ist von den gleichen Machern (plus Material UI + Floating UI Team), hat v1.0 erreicht, wird aktiv weiterentwickelt, und shadcn/ui unterstützt es offiziell seit Dezember 2025. Bei `npx shadcn init` wird Base UI als Primitive-Library gewählt.

### React Compiler
Der React Compiler ist ab Tag 1 aktiviert. Er eliminiert die Notwendigkeit für manuelles `useMemo`, `useCallback` und `React.memo`. Schreib normalen React-Code — der Compiler optimiert automatisch.

### Kein Axios
Wir nutzen einen dünnen fetch-Wrapper (`src/api/client.ts`) statt Axios. TanStack Query ist das eigentliche Tool für Server-State — der fetch-Wrapper liefert nur die rohe Request-Logik (Base-URL, Auth-Header, Error-Handling). Das sind ~30 Zeilen Code, keine externe Library.

### Copy-statt-Import für Components
Components aus der Frachtwerk Component Library (`essencium-components`) werden in Projekte *kopiert*, nicht als npm-Dependency importiert. Das ist der shadcn/ui-Ansatz: volle Ownership, keine Dependency-Kopplung.

## Konventionen

### Code-Style
- TypeScript strict mode
- Functional Components (keine Class Components)
- Named Exports (kein `export default` außer für Routes)
- Pfad-Aliase: `@/components`, `@/lib`, `@/hooks`, `@/api`
- Barrel-Exports (`index.ts`) nur auf Ordner-Ebene, nicht verschachtelt

### Routing
- File-based Routing via TanStack Router
- Layout-Routes mit Underscore-Prefix (`_auth.tsx`)
- Route-Guards via `beforeLoad` — nicht via Component-Logik
- Search-Params für Filter/Pagination (type-safe via TanStack Router)

### Data-Fetching
- Alle Server-Daten via TanStack Query Hooks
- Query-Keys in `src/api/queries/` zentralisiert
- Mutations invalidieren relevante Queries
- Optimistic Updates für bessere UX wo sinnvoll

### Forms
- React Hook Form für alle Formulare
- Zod-Schemas für Validation (client-side)
- Schemas leben neben den Formularen, nicht in einem separaten Ordner
- Form-Submit via TanStack Query Mutation

### Styling
- Tailwind CSS Utility-Klassen
- shadcn/ui CSS-Variablen für Theming (in `globals.css`)
- Keine inline-styles, keine CSS-Module
- Dark Mode via Tailwind `dark:` Klassen + CSS-Variablen

### i18n
- Alle sichtbaren Strings via `useTranslation()` Hook
- Translation-Keys in Namespace-Struktur: `common.save`, `users.title`, `auth.login`
- Keine hardcodierten Strings in Components

## Für später eingeplant

- **Vite+ Migration**: ESLint + Prettier zu Oxlint + Oxfmt — eine einzige vite.config.ts. Sobald Vite+ stabil ist.
- **TanStack Start SSR**: Bei Bedarf pro Route aktivierbar, kein Refactoring nötig.

## Zusammenarbeit mit anderen Repos

Dieses Projekt ist Teil eines 4-Repo-Ökosystems:

1. **`essencium-frontend-v2`** (dieses Repo) — Boilerplate
2. **`essencium-components`** — Frachtwerk Component Library + Storybook
3. **`frachtwerk-frontend-config`** — ESLint + Prettier Configs (npm-Packages)
4. **`essencium-docs`** — Dokumentation für Frontend und Backend

Das alte Repo `essencium-frontend` (im gleichen Verzeichnis: `../essencium-frontend/`) wird nur noch für Referenzen und Dependency-Pflege genutzt, nicht mehr weiterentwickelt.
