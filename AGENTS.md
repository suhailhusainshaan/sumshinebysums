# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router project for the Sumshine admin dashboard and storefront. Main source code lives in `src/`:
- `src/app/` routes and layouts, including `src/app/admin/*` for admin pages and `src/app/(public)/*` for storefront pages
- `src/components/admin/` and `src/components/common/` shared UI building blocks
- `src/lib/axios.ts` authenticated API client
- `src/hooks/`, `src/context/`, `src/service/`, and `src/types/` for reusable logic and typing
- `public/` static images and icons
- `docs/` API and product-admin reference docs

## Build, Test, and Development Commands
- `npm run dev` starts the local app at `http://localhost:4028`
- `npm run build` creates the production build
- `npm run start` or `npm run serve` runs the built app
- `npm run lint` runs ESLint across the repo
- `npm run lint:fix` auto-fixes lint issues where possible
- `npm run type-check` runs `tsc --noEmit`
- `npm run format` formats `src/**/*.{ts,tsx,css,md,json}` with Prettier

Run `npm ci` when matching CI locally.

## Coding Style & Naming Conventions
Use TypeScript, 2-space indentation, semicolons, single quotes, trailing commas, and a `printWidth` of 100. Prefer server components unless hooks or browser APIs are required. Reuse existing admin UI such as `ComponentCard`, table patterns, and common form inputs before creating new components. Use PascalCase for React components (`ListProducts.tsx`), camelCase for hooks/utilities (`useAuth.ts`), and keep route folders aligned with URLs.

## Testing Guidelines
There is no dedicated unit or e2e test suite configured yet. The enforced baseline is lint plus full TypeScript validation. Before opening a PR, run `npm run lint` and `npm run type-check`. If you add tests later, place them near the feature or under a clear `__tests__/` folder and name them `*.test.ts(x)`.

## Commit & Pull Request Guidelines
Recent history favors short, focused commit messages such as `added edit view product and view variant` or `pagination and list products`. Keep commits scoped to one change, use imperative phrasing, and avoid mixing refactors with feature work. PRs should include a concise summary, linked issue or task, screenshots or recordings for UI changes, API notes when endpoints change, and confirmation that lint/type-check passed.

## Security & Configuration Tips
The app expects backend APIs at `http://localhost:8080/api`. Authenticated requests use the bearer token from `localStorage` via the Axios interceptor. Do not commit secrets from `.env`, and preserve existing admin behaviors unless the task explicitly requires a breaking change.
