# GEMINI.md - Sumshine Admin Project Context

This document provides essential context and instructions for the Sumshine Admin (Next.js) project.

## Project Overview
Sumshine Admin is a modern admin dashboard built for managing product catalogs, including products, variants, categories, and brands. It is designed for high performance and a polished user experience.

- **Primary Domain**: Admin Dashboard / Product Management
- **Main Technologies**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS.
- **Key Features**: Product/Variant CRUD, Image Management, Analytics Dashboards, Calendar Integration.

## Architecture & Conventions

### 1. Project Structure
- `src/app/`: App router pages. Admin routes are under `admin/`. Public routes like `login/` and `register/` are at the root.
- `src/components/`: Reusable UI components. Admin-specific components are often in `src/components/admin/`.
- `src/hooks/`: Custom React hooks (e.g., `useAuth`, `useModal`).
- `src/lib/`: Shared logic, including `axios.ts` for API calls and `AuthGuard.tsx` for route protection.
- `src/service/`: API service layers (e.g., `auth.service.ts`).
- `src/types/`: Centralized TypeScript interfaces (e.g., `product.ts`).
- `docs/`: API contracts and project documentation.

### 2. Authentication & Authorization
- **Mechanism**: Token-based authentication using Bearer tokens stored in `localStorage`.
- **Role-Based Access Control (RBAC)**: Managed by `AuthGuard.tsx`. 
    - `SUPER_ADMIN` has access to `/admin`.
    - Non-admins are redirected to `/login` if they try to access `/admin`.
    - Admins are redirected to `/admin` if they try to access the root public pages while logged in.
- **Hooks**: Use `useAuth()` to access the current user and login/logout functions.

### 3. API Communication
- **Client**: Axios instance in `src/lib/axios.ts`.
- **Base URL**: `http://localhost:8080/api` (configurable).
- **Conventions**: Responses typically follow a `{ data, message, status }` wrapper.
- **Interceptors**: Automatically attaches the `Authorization: Bearer <token>` header if a token exists in `localStorage`.

### 4. Styling & Assets
- **CSS**: Utility-first styling with Tailwind CSS.
- **Assets**: Use the `getAssetPath(path)` utility from `src/utils/assetPath.ts` for all static assets and images to ensure compatibility with production base paths (e.g., `/sumshinebysums`).
- **Images**: Remote patterns are configured in `next.config.mjs` for Unsplash, Pexels, and Pixabay.

### 5. Development Conventions
- **TypeScript**: Strict mode enabled. Path aliases (e.g., `@/*`, `@/components/*`) are defined in `tsconfig.json`.
- **Linting**: ESLint and Prettier are used for code quality and formatting.
- **Error Handling**: `react-hot-toast` is used for UI notifications.

## Key Commands

### Development
- `npm run dev`: Starts the development server on [http://localhost:4028](http://localhost:4028).
- `npm run type-check`: Runs TypeScript compiler in no-emit mode to check for errors.
- `npm run lint`: Runs ESLint check.
- `npm run format`: Formats code using Prettier.

### Build & Deploy
- `npm run build`: Builds the production-ready application.
- `npm run export`: Exports the application for static hosting.
- `npm run deploy`: Combines build and export commands.
- `npm run serve`: Starts the production server locally.

## Critical Notes
- **Next.js 15/React 19**: This project uses cutting-edge versions of Next.js and React. Ensure all new components follow the latest patterns (e.g., Server Components where appropriate, though much of the admin is client-side).
- **API Contract**: Refer to `docs/product-admin-api.md` for the definitive backend integration guide.
- **Build Warnings**: `next.config.mjs` currently ignores TypeScript and ESLint errors during builds. This should be addressed as the project matures.
