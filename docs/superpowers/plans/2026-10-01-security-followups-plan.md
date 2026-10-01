# Security Follow-ups (frontend) - Plan

Start from `main` after `security-hardening-2026-09-28` is merged. New branch: `security-followups`.

## Phase 1 - small fix

- [ ] **1. `/users/me` transient errors** (`api/auth.ts::getCurrentUser`, `providers/AuthProvider.tsx`): keep the HTTP status on the thrown error; only a 401/403 should dispatch `logout()` and show the user as signed out. A 5xx/network error should retry or leave state unchanged instead of logging the user out until reload.

## Phase 2 - depends on the backend `COOKIE_DOMAIN` decision

- [ ] **2. Server-side admin gate**: only worth adding if the backend sets `COOKIE_DOMAIN=.houzdey.com` (the site must be able to read the cookie). Then add a check (server component or edge middleware) for `/admin`. Note: the site deploys through OpenNext on Cloudflare; Next 16's Node-runtime `proxy.ts` is not officially supported there, so use the edge `middleware.ts` form. If the cookie domain is NOT shared, skip this: the backend already role-checks every admin API call and `admin/layout.tsx` redirects non-admins client-side.

## Phase 3 - enforce the CSP

- [ ] **3. Switch `Content-Security-Policy-Report-Only` to `Content-Security-Policy`** in `next.config.ts` once the browser console shows no violations on: sign-in (Google), a property with video, maps iframe, analytics, Cloudinary images. Add any host that violates (do not loosen `default-src`). Longer term: nonces to drop `'unsafe-inline'` for scripts.

## Phase 4 - remaining audit findings

- [ ] **4. Re-run `/security-review-all`** against the merged code to re-derive the original Low-severity findings and catch anything the hardening introduced.
