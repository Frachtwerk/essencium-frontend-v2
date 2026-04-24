<div align="center">

# Essencium Frontend v2

[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Build](https://github.com/Frachtwerk/essencium-frontend-v2/actions/workflows/ci.yml/badge.svg)

Modern frontend boilerplate for Frachtwerk projects.  
React 19 + Vite 8 + TanStack Start + shadcn/ui.

[Report an issue](https://github.com/Frachtwerk/essencium-frontend-v2/issues)

</div>

---

## Tech Stack

| Category      | Technology                                       |
| ------------- | ------------------------------------------------ |
| Framework     | React 19 + Vite 8 (via TanStack Start, SPA mode) |
| Routing       | TanStack Router (file-based, type-safe)          |
| Server-State  | TanStack Query                                   |
| UI Primitives | shadcn/ui + Base UI                              |
| Styling       | Tailwind CSS                                     |
| Forms         | React Hook Form + Zod                            |
| i18n          | i18next + react-i18next                          |
| Testing       | Vitest (Unit) + Playwright (E2E)                 |
| Language      | TypeScript 6 (strict mode)                       |

## Getting Started

### Prerequisites

- [Node.js 24 LTS](https://nodejs.org/) — managed via [Volta](https://volta.sh)
- [pnpm 10](https://pnpm.io/)

### Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
pnpm preview  # serve the production build locally
```

### Environment Variables

```bash
cp .env.example .env
```

See `.env.example` for available variables. All `VITE_`-prefixed variables are embedded into the client bundle at build time.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./CODE_OF_CONDUCT.md) before submitting a pull request.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
