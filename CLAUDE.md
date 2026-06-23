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

**Wichtig:** Kopiere keine Implementierungsdetails blind — das alte Repo nutzt Next.js + Mantine, wir nutzen einen komplett anderen Stack. Übernimm die _Logik_ und _Datenstrukturen_, nicht den Code.

## Tech-Stack

| Kategorie       | Technologie                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| Framework       | React 19 + Vite (via TanStack Start, SPA-Modus)                                                       |
| Compiler        | React Compiler (automatische Memoization)                                                             |
| Routing         | TanStack Router (in TanStack Start integriert)                                                        |
| Server-State    | TanStack Query + Hey-API-Client (kein Axios, kein handgeschriebener fetch-Wrapper)                    |
| API-Typen       | Hey-API (`@hey-api/openapi-ts`) — generiert Types + TanStack-Query-Helpers aus `backend/openapi.yaml` |
| Client-State    | Jotai (optional, für globalen UI-State)                                                               |
| UI Primitives   | shadcn/ui + Base UI (nicht Radix)                                                                     |
| Tabellen        | TanStack Table + shadcn/ui DataTable                                                                  |
| Styling         | Tailwind CSS                                                                                          |
| i18n            | i18next + react-i18next                                                                               |
| Forms           | React Hook Form + Zod                                                                                 |
| Datum/Zeit      | dayjs                                                                                                 |
| Testing         | Vitest (Unit) + Playwright (E2E)                                                                      |
| Linting         | ESLint 10 + Prettier (Migration zu Vite+/Oxlint geplant)                                              |
| Package Manager | pnpm                                                                                                  |

## Projektstruktur

```
essencium-frontend-v2/
├── backend/
│   └── openapi.yaml               # Manuell gepflegter Snapshot der Backend-API (committed)
├── src/
│   ├── generated/
│   │   └── client/                # Auto-generiert via Hey-API — NICHT committen, NICHT manuell bearbeiten
│   ├── api/
│   │   └── client.ts              # Hey-API-Client-Konfiguration (Auth-Token, Base-URL, 401-Redirect)
│   ├── hooks/data/                # Domain-Hooks: importieren generierte *Options()-Factories
│   ├── components/
│   │   ├── ui/                    # shadcn/ui + Base UI Components (via CLI)
│   │   └── shared/                # Eigene wiederverwendbare Components
│   ├── hooks/                     # Custom Hooks (useAuth, usePermissions, etc.)
│   ├── lib/                       # Utilities (dayjs-Config, i18n-Config, Zod-Schemas)
│   ├── routes/                    # TanStack Router file-based Routes
│   │   ├── __root.tsx             # Root-Dokument (<html>, <head>, <body>, Providers)
│   │   ├── _authenticated.tsx     # Pathless Layout: Sidebar + Header (auth-Seiten)
│   │   ├── _authenticated/
│   │   │   ├── dashboard.tsx
│   │   │   ├── users/
│   │   │   │   ├── index.tsx
│   │   │   │   └── $userId.tsx
│   │   │   ├── roles.tsx
│   │   │   ├── profile.tsx
│   │   │   └── settings.tsx
│   │   ├── login.tsx              # Öffentlich, kein Layout
│   │   └── index.tsx              # Redirect → /dashboard oder /login
│   ├── router.tsx                 # Router-Konfiguration (getRouter + Route-Tree)
│   ├── routeTree.gen.ts           # Auto-generated — NICHT manuell bearbeiten
│   └── styles/
│       └── globals.css            # Tailwind v4 + CSS-Variablen + Fonts
├── public/                        # Statische Assets (Bilder, Favicon)
├── tests/
│   ├── unit/                      # Vitest Unit-Tests
│   └── e2e/                       # Playwright E2E-Tests
├── CLAUDE.md                      # Diese Datei
├── SPEC.md                        # Roadmap und Gesamtbild
├── STYLE_GUIDE.md                 # Frachtwerk UI Style Guide
├── vite.config.ts                 # TanStack Start + React Compiler Config
├── components.json                # shadcn/ui Config (Base UI)
├── tsconfig.json                  # strict: true + alle strengen Flags
├── eslint.config.mjs              # ESLint v10 flat config
├── .prettierrc                    # Prettier Config (Essencium-Regeln)
├── commitlint.config.mjs          # Conventional Commits
├── lint-staged.config.mjs         # Staged-Files Hook-Config
├── package.json
└── .env.example
```

**Wichtig zu TanStack Start:**

- Es gibt **kein `index.html`** — TanStack Start rendert das HTML-Dokument vollständig via `__root.tsx` (`<html>`, `<head>`, `<body>`, `<HeadContent />`, `<Scripts />`)
- `router.tsx` ist die zentrale Router-Konfiguration und bindet den Route-Tree ein
- `routeTree.gen.ts` wird von TanStack Router automatisch generiert und darf **nicht** manuell bearbeitet werden

## Architektur-Entscheidungen

### TanStack Start im SPA-Modus

Wir nutzen TanStack Start statt TanStack Router allein. Der SPA-Modus ist aktiviert (`spa: { enabled: true }` in der Vite-Config). Das bedeutet: Kein SSR, kein Server-Rendering — aber die Möglichkeit, beides pro Route zu aktivieren, wenn ein Projekt das braucht. Der Overhead gegenüber Router-allein ist eine Config-Zeile.

### shadcn/ui + Base UI (nicht Radix)

Radix UI wird fragwürdig maintained seit der WorkOS-Akquisition. Base UI ist von den gleichen Machern (plus Material UI + Floating UI Team), hat v1.0 erreicht, wird aktiv weiterentwickelt, und shadcn/ui unterstützt es offiziell seit Dezember 2025. Bei `npx shadcn init` wird Base UI als Primitive-Library gewählt.

### React Compiler

Der React Compiler ist ab Tag 1 aktiviert. Er eliminiert die Notwendigkeit für manuelles `useMemo`, `useCallback` und `React.memo`. Schreib normalen React-Code — der Compiler optimiert automatisch.

### TypeScript Strict Mode

TypeScript ist maximal strikt konfiguriert — über den Standard `strict: true` hinaus:

| Flag                               | Zweck                                                        |
| ---------------------------------- | ------------------------------------------------------------ |
| `strict: true`                     | strictNullChecks, noImplicitAny, strictFunctionTypes etc.    |
| `noUncheckedIndexedAccess`         | `array[0]` ist `T \| undefined` — verhindert Runtime-Crashes |
| `noUnusedLocals`                   | Keine ungenutzten Variablen                                  |
| `noUnusedParameters`               | Keine ungenutzten Parameter                                  |
| `noFallthroughCasesInSwitch`       | Kein Fall-through in switch-Statements                       |
| `forceConsistentCasingInFileNames` | Verhindert Case-Fehler bei Imports                           |

`exactOptionalPropertyTypes` ist bewusst **nicht** aktiviert — es ist inkompatibel mit TanStack Router's internen Typen.

### Kein Axios

Wir nutzen einen dünnen fetch-Wrapper (`src/api/client.ts`) statt Axios. TanStack Query ist das eigentliche Tool für Server-State — der fetch-Wrapper liefert nur die rohe Request-Logik (Base-URL, Auth-Header, Error-Handling). Das sind ~30 Zeilen Code, keine externe Library.

### Copy-statt-Import für Components

Components aus der Frachtwerk Component Library (`essencium-components`) werden in Projekte _kopiert_, nicht als npm-Dependency importiert. Das ist der shadcn/ui-Ansatz: volle Ownership, keine Dependency-Kopplung.

### ESLint 10 mit @eslint-react/eslint-plugin

ESLint 10 (Feb 2026) hat Breaking Changes gegenüber eslint-plugin-react, das noch nicht kompatibel ist. Wir nutzen `@eslint-react/eslint-plugin` als nativen ESLint-10-Ersatz (TypeScript-first, aktiv maintained). `eslint-plugin-jsx-a11y` und `eslint-plugin-react-hooks` werden via `@eslint/compat`'s `fixupPluginRules()` gewrappt bis sie nativ ESLint 10 unterstützen.

## Konventionen

### Code-Style

- **TypeScript strict mode** — keine `any`, kein `@ts-ignore`, kein `as`-Casting ohne Kommentar
- Alle exportierten Funktionen haben explizite Return Types
- Functional Components (keine Class Components)
- Named Exports (kein `export default` außer für Routes)
- Pfad-Aliase: `@/components`, `@/lib`, `@/hooks`, `@/api`
- Barrel-Exports (`index.ts`) nur auf Ordner-Ebene, nicht verschachtelt

### Routing (TanStack Start)

- File-based Routing via TanStack Router
- Pathless Layout-Routes mit Underscore-Prefix (`_authenticated.tsx`)
- Route-Children im **Directory-Pattern** (`_authenticated/dashboard.tsx`), nicht Flat-Pattern
- Route-Guards via `beforeLoad` — nicht via Component-Logik
- Search-Params für Filter/Pagination (type-safe via TanStack Router)
- `__root.tsx` rendert das komplette HTML-Dokument — kein separates `index.html`

### Data-Fetching

- API-Types und Query-Helpers werden **automatisch generiert** aus `backend/openapi.yaml` via Hey-API (`pnpm dev` triggert die Regenerierung)
- Niemals TypeScript-Interfaces für Backend-Typen manuell schreiben — sie kommen aus `src/generated/client/` (gitignored)
- YAML nach Backend-Änderungen manuell aktualisieren: `curl http://localhost:8080/v3/api-docs.yaml > backend/openapi.yaml`
- Alle Server-Daten via TanStack Query Hooks mit den generierten `*Options()`-Factories
- Mutations invalidieren relevante Queries
- Optimistic Updates für bessere UX wo sinnvoll

### Forms

- React Hook Form für alle Formulare
- Zod-Schemas für Validation (client-side)
- Schemas leben neben den Formularen, nicht in einem separaten Ordner
- Form-Submit via TanStack Query Mutation

### Styling & Design-System

Quelle der Wahrheit: **Frachtwerk-Styleguide** (https://essencium-styleguide.frachtwerk.de/), eingebacken in `src/styles/globals.css`.

- Tailwind CSS Utility-Klassen
- **Nur Design-Tokens** (semantische CSS-Variablen aus `globals.css`) — keine Hex-/RGB-Werte im Code, keine inline-styles, keine CSS-Module
- Farbwerte/Tokens ausschließlich in `globals.css` ändern (Styleguide ist WIP, Slot-Mappings stabil)
- **Font:** Fira Sans · **Icons:** `@remixicon/react` (line) für App-/Feature-Icons; lucide nur in shadcn-internen Primitives
- Dark Mode via `next-themes` (`.dark`-Klasse) + CSS-Variablen

### i18n

- Alle sichtbaren Strings via `useTranslation()` Hook
- Translation-Keys in Namespace-Struktur: `common.save`, `users.title`, `auth.login`
- Keine hardcodierten Strings in Components

## Für später eingeplant

- **Vite+ Migration**: ESLint + Prettier zu Oxlint + Oxfmt — eine einzige vite.config.ts. Sobald Vite+ stabil ist.
- **TanStack Start SSR**: Bei Bedarf pro Route aktivierbar, kein Refactoring nötig.
- **Config-Repo**: ESLint + Prettier Regeln in `frachtwerk-frontend-config` extrahieren — Sprint 4.

## Zusammenarbeit mit anderen Repos

Dieses Projekt ist Teil eines 4-Repo-Ökosystems:

1. **`essencium-frontend-v2`** (dieses Repo) — Boilerplate
2. **`essencium-components`** — Frachtwerk Component Library + Storybook
3. **`frachtwerk-frontend-config`** — ESLint + Prettier Configs (npm-Packages)
4. **`essencium-docs`** — Dokumentation für Frontend und Backend

Das alte Repo `essencium-frontend` (im gleichen Verzeichnis: `../essencium-frontend/`) wird nur noch für Referenzen und Dependency-Pflege genutzt, nicht mehr weiterentwickelt.
