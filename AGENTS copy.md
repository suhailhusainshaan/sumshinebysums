# AGENTS.md — Full-Stack Engineering Specification

> **Project:** Sumshine Admin *(Sunshine by Sums)*
> **Version:** 2.0 (High-Context)
> **Stack:** Next.js 15.2+ (App Router) · React 19 · Spring Boot 3.4 · 
> **Last Updated:** April 5, 2026
> **Lead Engineer:** Suhail Husain (Software Engineer)

---

## Table of Contents

1. [Technical Foundation & Environment](#1-technical-foundation--environment)
2. [Detailed API Contract](#2-detailed-api-contract-spring-boot-integration)
3. [Frontend & UI Engineering Standards](#4-frontend--ui-engineering-standards)
4. [Operational Protocols](#5-operational-protocols)
5. [Prohibited Actions & Error Handling](#6-prohibited-actions--error-handling)
6. [Task Checklist for Agents](#7-task-checklist-for-agents)

---

## 1. Technical Foundation & Environment

| Layer    | Runtime         |
|----------|-----------------|
| Frontend | Node.js 20+     |
| Backend  | Java 25         |

### Port Mapping

| Service      | URL                          |
|--------------|------------------------------|
| Frontend     | `http://localhost:3000`      |
| Backend API  | `http://localhost:8080/api`  |

### Hardware & Export Profile

- **Hardware:** Optimized for MacBook Pro M5. Prioritize high-density 4K layouts with 60Hz-smooth transitions for all UI suggestions.
- **Static Export:** The project uses `output: 'export'`.
  - ⛔ **Strictly avoid** Node.js-only features (`headers`, `cookies`, filesystem) inside Client Components.

---

## 2. Detailed API Contract (Spring Boot Integration)

### Global Data Wrapper

> ⚠️ **Every** response from the Spring Boot backend follows this structure. Do **not** hallucinate raw arrays.

```typescript
interface ApiResponse<T> {
  data: T;          // The actual payload
  message: string;  // User-friendly feedback
  status: number;   // HTTP status code (200, 201, 400, etc.)
}
```

**Example JSON response (all endpoints):**

```json
{
  "data": "<payload | object | array>",
  "message": "Operation successful",
  "status": 200
}
```

### Feature-Specific Logic

| Feature        | Logic & Constraints |
|----------------|---------------------|
| **Users**      | Supports bulk-delete (`POST` with array of IDs). Includes `toggle-active` and `toggle-lock` via `PATCH`. |
| **Categories** | Hierarchical logic: must handle `parentId`. Always fetch the full tree for category selectors. |
| **Products**   | Decoupled into **Master Records** and **Inventory Variants**. |
| **Variants**   | **Atomic Updates:** Image reordering and deletions must be handled per `variantId`, not as a bulk product save. |

---

### ⚠️ Agent Rule

> When modifying image logic in the frontend (e.g., `src/utils/assetPath.ts`), you **MUST** ensure the naming convention matches the S3 object keys expected by the Python script.

- Any change to product image URLs **must** be compatible with the bulk S3 verification logic.
- Validation breakage in the Python layer is considered a **critical regression**.

---

## 3. Frontend & UI Engineering Standards

### Component Archetypes

| Component         | Usage |
|-------------------|-------|
| `ComponentCard`   | Standard wrapper for all dashboard widgets and grouped forms. |
| **Tables**        | Use the `ListProducts` / `ListCategories` pattern — includes server-side pagination support and `react-hot-toast` for row actions. |
| **Asset Loading** | **MANDATORY:** Use `getAssetPath(path)` from `@/utils/assetPath` for all image/asset references. |

> **Why `getAssetPath`?** It supports the `/sumshinebysums` production base path without hardcoding URLs.

---

### React 19 & Next.js 15 Patterns

| Pattern               | Rule |
|-----------------------|------|
| **Server Components** | Use for all SEO-sensitive pages and initial data hydration in `/admin`. |
| **Client Components** | Use `'use client'` only when interactivity is required. |
| **State Management**  | Use `useAuth` for sessions; local React state for form management. |
| **RBAC**              | `AuthGuard.tsx` is the source of truth. `SUPER_ADMIN` is the required role for all `/admin` routes. |

---

## 4. Operational Protocols

### Critical CLI Commands

| Action       | Command              | Notes                              |
|--------------|----------------------|------------------------------------|
| Start Dev    | `npm run dev`        | Runs on port `4028`.               |
| Pre-Commit   | `npm run type-check` | **Mandatory.** Do not skip.        |
| Linting      | `npm run lint`       | Check for React 19 / Next 15 deprecations. |
| Export       | `npm run deploy`     | Combined build + static export for production. |

---

## 5. Prohibited Actions & Error Handling

| Rule | Description |
|------|-------------|
| 🚫 **No Manual Auth** | Never manually set `Authorization` headers in components. Use the `axios.ts` lib exclusively. |
| 🚫 **No Unsafe Deletes** | User and Product deletions **must** show a confirmation modal using the common UI pattern. |
| 🚫 **No Hardcoded Links** | All internal navigation must use the Next.js `<Link>` component. |
| 🚫 **No Silent Errors** | Never catch an error without notifying the user via `toast.error()`. |

---

## 6. Task Checklist for Agents

Before submitting any code, confirm **all** of the following:

- [ ] Code passes `npm run type-check`
- [ ] All images use `getAssetPath()`
- [ ] Responsive design verified for Admin View
- [ ] API responses are typed using the `ApiResponse<T>` interface
- [ ] No Node.js-only APIs used in exported client routes

---

*Context: Sunshine by Sums Admin Ecosystem*