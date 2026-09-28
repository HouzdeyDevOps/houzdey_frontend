# Frontend Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the Critical/High/Medium frontend findings from the 2026-09-28 security audit in `houzdey_frontend` — stored XSS on blog pages, JWTs in localStorage, JSON-LD script-breakout injection, client-only admin gating, and missing security headers.

**Architecture:** Five tasks. Task 3 (cookie-based auth) is the big one and is **sequenced after `houzdey_backend`'s Task 2 ships** (same cookie contract, see the shared spec) — everything else here is independent and can go first.

**Tech Stack:** Next.js 16 (App Router), React 19, Redux Toolkit, axios, Tiptap.

**Spec:** `docs/superpowers/specs/2026-09-28-security-hardening-spec.md` (repo-relative: `../../../../docs/superpowers/specs/2026-09-28-security-hardening-spec.md`, since the spec lives one level up at the shared `houzdey/` root).

## Global Constraints

- **This repo's `node_modules/` is not installed.** Run `npm install` (or `bun install` — both `package-lock.json` and `bun.lock` are committed; use whichever the person doing the install already has set up) before starting Task 5, and before trusting any Next.js-16-specific API shape used below. This repo's own `AGENTS.md` warns that this Next.js version has breaking changes from older versions: **read `node_modules/next/dist/docs/` for the middleware guide before writing `middleware.ts` in Task 5** rather than assuming the API below is exactly right — it reflects the stable, long-standing `NextRequest`/`NextResponse` middleware shape, but confirm against the installed version's own docs/types first.
- No new runtime dependency is added except `isomorphic-dompurify` (Task 1) — chosen specifically because `BlogDetailClient.tsx` is a client component that Next still server-renders on first load, so a browser-only sanitizer (`dompurify` alone) would throw on `document`/`window` during SSR.
- **No automated test suite exists in this repo** (no `*.test.ts(x)` files, no test runner configured). Per the spec's scope decision, this plan does not introduce one — each task's verification step is a manual browser/DevTools check instead of an automated test.
- Every task ends with its own commit. Do not batch multiple tasks into one commit.

## Review Focus

- Task 3 must not leave any call site still reading `Authorization: Bearer ${localStorage.getItem('token')}` — a stale, always-`null` header would be sent alongside the valid cookie and, per the backend contract, the (invalid) header takes precedence over the cookie, silently breaking auth for that one call site. `services/upload.ts` and `api/auth.ts`'s `updatePersonalInfo` are the two places this bites hardest.
- Task 3 must fix the two "sign out" buttons (`ProfileDropdown.tsx`, `Navbar.tsx`) to call `authApi.logout()` (which now clears the httpOnly cookies server-side), not just `dispatch(logout())` — httpOnly cookies cannot be cleared by client JS at all, so without this fix, "sign out" would stop working entirely under the new cookie model even though it looks like it worked before.
- Task 3's `ProtectedRoute` must gate on `isInitialized` (the async cookie-based `/users/me` check), not a synchronous `isLoading`/localStorage flag — the old synchronous localStorage check is gone, and gating on the wrong flag would redirect a logged-in user away during the brief page-load window before `/users/me` resolves.
- Task 2's JSON-LD escaping must be applied via the shared helper at **every** one of the 12 listed call sites, not just the blog page — the for-sale/for-rent/property/state pages all embed admin- or listing-controlled text the same way.
- Task 5's `middleware.ts` matcher must not accidentally intercept `/admin`'s own sign-in redirect target (`/`) in a way that creates a redirect loop.

---

### Task 1: Sanitize blog HTML before rendering (stored XSS)

**Files:**
- Modify: `package.json`
- Modify: `components/blog/BlogDetailClient.tsx:1-13, 152`

- [ ] **Step 1: Add the sanitizer dependency**

```json
// package.json — add to "dependencies"
    "isomorphic-dompurify": "^2.19.0",
```

- [ ] **Step 2: Install it**

```bash
npm install
```

- [ ] **Step 3: Sanitize before rendering**

```tsx
// components/blog/BlogDetailClient.tsx — add to the top imports (after line 13)
import DOMPurify from 'isomorphic-dompurify';
```

```tsx
// components/blog/BlogDetailClient.tsx — replace line 152
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
```

- [ ] **Step 4: Verify manually**

Run the dev server (`npm run dev`), open a real blog post, and confirm it still renders headings/links/lists/images the same as before. Then, in a scratch script or the browser console, confirm the sanitizer strips a payload:
```js
import DOMPurify from 'isomorphic-dompurify';
console.log(DOMPurify.sanitize('<p>hi</p><img src=x onerror="alert(1)"><script>alert(2)</script>'));
// Expect: "<p>hi</p><img src=\"x\">" — no onerror attribute, no <script> tag
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components/blog/BlogDetailClient.tsx
git commit -m "security: sanitize blog HTML with DOMPurify before rendering"
```

---

### Task 2: Escape JSON-LD to prevent script-tag breakout

**Files:**
- Create: `lib/safeJsonLd.ts`
- Modify: `app/layout.tsx:155`
- Modify: `app/(pages)/blog/[slug]/page.tsx:119,123`
- Modify: `app/(pages)/state/[state]/page.tsx:86`
- Modify: `app/(pages)/properties/[id]/page.tsx:186,190`
- Modify: `app/(pages)/properties/for-sale/[...slug]/page.tsx:290,294,298`
- Modify: `app/(pages)/properties/for-rent/[...slug]/page.tsx:291,295,299`

**Interfaces:**
- Produces: `safeJsonLdString(data: unknown): string` in `lib/safeJsonLd.ts` — every call site below imports and uses this instead of a bare `JSON.stringify(...)`.

- [ ] **Step 1: Create the helper**

```ts
// lib/safeJsonLd.ts
/**
 * JSON.stringify a JSON-LD object for embedding in a <script type="application/ld+json">
 * tag. Escapes '<' so a value containing the literal substring "</script>" cannot break
 * out of the script tag — < is valid JSON and round-trips through JSON.parse (which
 * is how search engines' structured-data parsers read this content) back to '<'.
 */
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
```

- [ ] **Step 2: Use it at every call site**

Each of the 12 occurrences below is a one-line change: `JSON.stringify(varName)` → `safeJsonLdString(varName)`, plus adding the import to that file if not already present.

```tsx
// app/layout.tsx — add import, then replace line 155
import { safeJsonLdString } from '@/lib/safeJsonLd';
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(websiteJsonLd) }}
```

```tsx
// app/(pages)/blog/[slug]/page.tsx — add import, then replace lines 119 and 123
import { safeJsonLdString } from '@/lib/safeJsonLd';
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(jsonLd) }}
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(breadcrumbJsonLd) }}
```

```tsx
// app/(pages)/state/[state]/page.tsx — add import, then replace line 86
import { safeJsonLdString } from '@/lib/safeJsonLd';
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(jsonLd) }}
```

```tsx
// app/(pages)/properties/[id]/page.tsx — add import, then replace lines 186 and 190
import { safeJsonLdString } from '@/lib/safeJsonLd';
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(propertyJsonLd) }}
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(breadcrumbJsonLd) }}
```

```tsx
// app/(pages)/properties/for-sale/[...slug]/page.tsx — add import, then replace lines 290, 294, 298
import { safeJsonLdString } from '@/lib/safeJsonLd';
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(propertyJsonLd) }}
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(breadcrumbJsonLd) }}
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(faqJsonLd) }}
```

```tsx
// app/(pages)/properties/for-rent/[...slug]/page.tsx — add import, then replace lines 291, 295, 299
import { safeJsonLdString } from '@/lib/safeJsonLd';
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(propertyJsonLd) }}
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(breadcrumbJsonLd) }}
// ...
dangerouslySetInnerHTML={{ __html: safeJsonLdString(faqJsonLd) }}
```

- [ ] **Step 3: Verify manually**

```js
// Quick check of the escaping behavior
import { safeJsonLdString } from '@/lib/safeJsonLd';
const evil = { headline: '</script><script>alert(1)</script>' };
console.log(safeJsonLdString(evil));
// Expect the literal substring "</script>" to NOT appear anywhere in the output
console.log(JSON.parse(safeJsonLdString(evil)).headline === evil.headline); // true — round-trips correctly
```
Then load a real blog post and a real property page and confirm, via "View Page Source," that the JSON-LD `<script>` blocks are still present and Google's Rich Results Test (or just eyeballing the structured data) still parses them correctly.

- [ ] **Step 4: Commit**

```bash
git add lib/safeJsonLd.ts app/layout.tsx "app/(pages)/blog/[slug]/page.tsx" "app/(pages)/state/[state]/page.tsx" "app/(pages)/properties/[id]/page.tsx" "app/(pages)/properties/for-sale/[...slug]/page.tsx" "app/(pages)/properties/for-rent/[...slug]/page.tsx"
git commit -m "security: escape JSON-LD to prevent script-tag breakout injection"
```

---

### Task 3: Migrate from localStorage JWTs to httpOnly cookie auth [depends on houzdey_backend Task 2]

**Files:**
- Create: `lib/axiosDefaults.ts`
- Modify: `lib/axios.ts` (full rewrite)
- Modify: `api/axios-config.ts` (full rewrite)
- Modify: `api/auth.ts` (targeted: `signin`, `updatePersonalInfo`, `googleSignIn`, `facebookSignIn`, `appleSignIn`, `refreshAccessToken`, `logout`)
- Modify: `providers/AuthProvider.tsx` (full rewrite)
- Modify: `store/slices/userAuthSlice.ts` (full rewrite)
- Modify: `store/middleware/authMiddleware.ts` (full rewrite)
- Modify: `store/store.ts`
- Modify: `hooks/useAuth.ts`
- Modify: `components/auth/protected-route.tsx`
- Modify: `services/upload.ts`
- Modify: `components/auth/signin-modal.tsx:56`
- Modify: `components/auth/login-verification-modal.tsx:46`
- Modify: `components/auth/GoogleAuthButton.tsx:31-34`
- Modify: `components/navbar/ProfileDropdown.tsx:1-4,57-60`
- Modify: `components/navbar/Navbar.tsx:21,189-192`

**Interfaces:**
- Consumes: the backend cookie contract — `access_token`/`refresh_token` httpOnly cookies set by `/users/login`, `/users/token`, `/users/refresh`, `/users/social/google/callback`; cleared by `/users/logout`, `/users/logout-all`.
- Produces: `login` action payload shrinks from `{ user, token }` to `{ user }` — every dispatcher of `login(...)` in this task must drop `token`.

- [ ] **Step 1: Global `withCredentials` default**

```ts
// lib/axiosDefaults.ts
import axios from 'axios';

// Ensures every raw `axios.*` call (not just the two configured instances below)
// sends the httpOnly auth cookies automatically.
axios.defaults.withCredentials = true;
```

- [ ] **Step 2: Rewrite `lib/axios.ts`**

```ts
// lib/axios.ts — full file
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  _isRetry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) {
    return true;
  }
  const status = error.response.status;
  return status >= 500 && status < 600;
};

const delay = (ms: number, attempt: number) =>
  new Promise(resolve => setTimeout(resolve, ms * Math.pow(2, attempt - 1)));

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: RetryConfig = error.config;

    if (isRetryableError(error) && !originalRequest._isRetry) {
      const retryCount = originalRequest._retryCount || 0;

      if (retryCount < MAX_RETRIES) {
        originalRequest._retryCount = retryCount + 1;
        originalRequest._isRetry = true;
        await delay(RETRY_DELAY, retryCount + 1);
        return axiosInstance(originalRequest);
      }
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token travels via the httpOnly cookie — no body needed, and the
        // new access_token cookie is set automatically by this response.
        await axios.post(`${API_BASE_URL}/users/refresh`, {}, { withCredentials: true });

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

- [ ] **Step 3: Rewrite `api/axios-config.ts`**

```ts
// api/axios-config.ts — full file
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_BASE_URL}/users/refresh`, {}, { withCredentials: true });

        processQueue(null);
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

- [ ] **Step 4: Strip token handling from `api/auth.ts`**

```ts
// api/auth.ts — replace the signin function body (lines 35-94, only the try block's happy path changes; the catch block is unchanged)
  async signin(data: UserSignInParams): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      return response.data;
    } catch (error: any) {
      // ...unchanged catch block from the original function...
```

```ts
// api/auth.ts — replace updatePersonalInfo (lines 136-153)
  async updatePersonalInfo(formData: FormData) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/me`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to update personal information.");
    }
  },
```

```ts
// api/auth.ts — replace googleSignIn (lines 193-211)
  async googleSignIn({ code }: GoogleSignInParams): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/google/callback`,
        { code: code },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Google sign in failed");
    }
  },
```

```ts
// api/auth.ts — replace facebookSignIn (lines 213-240) — note: the backend /social/facebook
// route is currently commented out, so this is presently unreachable; fixed for consistency.
  async facebookSignIn(token: string): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/facebook`,
        {},
        {
          headers: {
            Authorization: token,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.data?.error) {
        throw new Error(error?.response?.data?.error?.message);
      }
      throw new Error("Facebook sign in failed. Please try again.");
    }
  },
```

```ts
// api/auth.ts — replace appleSignIn (lines 263-281) — note: the backend /social/apple/callback
// route is currently commented out, so this is presently unreachable; fixed for consistency.
  async appleSignIn(code: string): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/apple/callback`,
        { code },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Apple sign in failed");
    }
  },
```

```ts
// api/auth.ts — replace refreshAccessToken (lines 394-422)
  async refreshAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/refresh`,
        {},
        { withCredentials: true }
      );
      return response.data.access_token;
    } catch (error: any) {
      throw new Error("Session expired. Please login again.");
    }
  },
```

```ts
// api/auth.ts — replace logout (lines 424-451)
  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
```

- [ ] **Step 5: Rewrite `store/slices/userAuthSlice.ts`**

```ts
// store/slices/userAuthSlice.ts — full file
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  profile_picture?: string;
  phone_number?: string;
  phone_verified?: boolean;
  status?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  email: string | null;
  verificationCode: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  email: null,
  verificationCode: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setVerificationCode: (state, action: PayloadAction<string>) => {
      state.verificationCode = action.payload;
    },
  },
});

export const { login, logout, setInitialized, updateUser, setEmail, setVerificationCode } = userAuthSlice.actions;
export default userAuthSlice;
```

(The auth token is gone from Redux state entirely — it lives only in the httpOnly cookie now, which JS cannot and should not read. This also removes the reducer's direct `localStorage`/side-effect calls, which were a Redux anti-pattern independent of the security fix.)

- [ ] **Step 6: Rewrite `store/middleware/authMiddleware.ts`**

```ts
// store/middleware/authMiddleware.ts — full file
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout } from '../slices/userAuthSlice';
import { setWishlistItems } from '../slices/wishlistSlice';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  actionCreator: logout,
  effect: (action, { dispatch }) => {
    // The httpOnly access_token/refresh_token cookies are cleared server-side by
    // authApi.logout() (POST /users/logout) — client JS cannot read or clear an
    // httpOnly cookie, so there is nothing to do with document.cookie/localStorage
    // for the token here anymore. This listener only clears derived client state.
    localStorage.removeItem('wishlist');
    dispatch(setWishlistItems([]));
  }
});
```

- [ ] **Step 7: Update `store/store.ts`**

```ts
// store/store.ts — full file
import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./slices/userAuthSlice";
import authModalSlice from "./slices/authModalSlice";
import { authMiddleware } from './middleware/authMiddleware';
import propertySlice from "./slices/propertySlice";
import wishlistSlice from './slices/wishlistSlice';

const preloadedState = {
  userAuth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    email: null,
    verificationCode: null,
  }
};

export const store = configureStore({
  reducer: {
    [userAuthSlice.name]: userAuthSlice.reducer,
    [authModalSlice.name]: authModalSlice.reducer,
    [propertySlice.name]: propertySlice.reducer,
    [wishlistSlice.name]: wishlistSlice.reducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- [ ] **Step 8: Rewrite `providers/AuthProvider.tsx`**

```tsx
// providers/AuthProvider.tsx — full file
'use client';

import '@/lib/axiosDefaults';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout, setInitialized } from '@/store/slices/userAuthSlice';
import { setWishlistItems } from '@/store/slices/wishlistSlice';
import { authApi } from '@/api/auth';
import { wishlistApi } from '@/api/wishlist';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const initializeAuth = async () => {
      try {
        // The access_token cookie (if any) is sent automatically with this request.
        const user = await authApi.getCurrentUser();
        dispatch(login({ user }));

        try {
          const wishlistData = await wishlistApi.getWishlistIds();
          const propertyIds = wishlistData.items || [];
          dispatch(setWishlistItems(propertyIds));
        } catch (wishlistError) {
          // Don't fail auth if wishlist fails to load
        }
      } catch (error) {
        dispatch(logout());
        dispatch(setWishlistItems([]));
      }

      dispatch(setInitialized(true));
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, isMounted]);

  if (!isMounted || !isInitialized) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
```

- [ ] **Step 9: Update `hooks/useAuth.ts` to expose `isInitialized`**

```ts
// hooks/useAuth.ts — full file
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function useAuth() {
  const { user, isAuthenticated, isLoading, isInitialized } = useSelector(
    (state: RootState) => state.userAuth
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
  };
}
```

- [ ] **Step 10: Fix `components/auth/protected-route.tsx` to gate on the async cookie check**

```tsx
// components/auth/protected-route.tsx — full file
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { setCurrentModal } from '@/store/slices/authModalSlice';
import { useDispatch } from 'react-redux';
import ProfilePageSkeleton from '@/components/ui/profile-page-skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push('/');
      dispatch(setCurrentModal("signup"));
    }
  }, [isAuthenticated, isInitialized, router, dispatch]);

  if (!isInitialized) {
    return <ProfilePageSkeleton />;
  }

  return isAuthenticated ? <>{children}</> : null;
}
```

- [ ] **Step 11: Fix `services/upload.ts` (was sending `Authorization: Bearer null`)**

```ts
// services/upload.ts — replace the axios.post options (inside uploadFile)
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
```

- [ ] **Step 12: Drop `token` from every `dispatch(login(...))` call**

```tsx
// components/auth/signin-modal.tsx — replace line 56
      dispatch(login({ user: data.user }));
```

```tsx
// components/auth/login-verification-modal.tsx — replace line 46
        dispatch(login({ user: data.user }));
```

```tsx
// components/auth/GoogleAuthButton.tsx — replace lines 31-34
        dispatch(login({
          user: result.user,
        }));
```

- [ ] **Step 13: Fix "sign out" to actually clear the session (httpOnly cookies can't be cleared by client JS)**

```tsx
// components/navbar/ProfileDropdown.tsx — add import near the top (after line 3)
import { authApi } from "@/api/auth";
```

```tsx
// components/navbar/ProfileDropdown.tsx — replace handleLogout (lines 57-60)
  const handleLogout = () => {
    authApi.logout().finally(() => {
      dispatch(logout());
    });
    setIsOpen(false);
  };
```

```tsx
// components/navbar/Navbar.tsx — add import near the top (after line 21)
import { authApi } from "@/api/auth";
```

```tsx
// components/navbar/Navbar.tsx — replace the sign-out button handler (lines 189-192)
                onClick={() => {
                  authApi.logout().finally(() => {
                    dispatch(logout());
                  });
                  toggleMobileMenu();
                }}
```

- [ ] **Step 14: Verify manually**

With `houzdey_backend`'s Task 2 deployed and both apps running:
1. Log in → DevTools → Application → Cookies shows `access_token`/`refresh_token` as `HttpOnly`; Local Storage has no `token`/`refresh_token` keys.
2. Reload the page → still logged in (no flash to logged-out state beyond the initial skeleton).
3. Click "Sign out" → DevTools shows both cookies gone (confirm via `document.cookie`, which was already unable to see them, but a subsequent `/users/me` call now returns 401) → next reload shows logged-out state.
4. Upload a chat/profile image and update personal info while logged in — both must still succeed (regression check on Step 11/Step 4's fixes).
5. Let the access token cookie's short lifetime pass (or manually expire it) and make an authenticated request — confirm the 401 triggers the refresh flow and the request transparently succeeds after.

- [ ] **Step 15: Commit**

```bash
git add lib/axiosDefaults.ts lib/axios.ts api/axios-config.ts api/auth.ts store/slices/userAuthSlice.ts store/middleware/authMiddleware.ts store/store.ts providers/AuthProvider.tsx hooks/useAuth.ts components/auth/protected-route.tsx services/upload.ts components/auth/signin-modal.tsx components/auth/login-verification-modal.tsx components/auth/GoogleAuthButton.tsx components/navbar/ProfileDropdown.tsx components/navbar/Navbar.tsx
git commit -m "security: migrate browser auth from localStorage JWTs to httpOnly cookies"
```

---

### Task 4: Add baseline security headers

**Files:**
- Modify: `next.config.ts:56-73`

- [ ] **Step 1: Extend the `headers()` function**

```ts
// next.config.ts — replace the headers() function (lines 56-73)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https://res.cloudinary.com https://lh3.googleusercontent.com https://www.google-analytics.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com " + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'),
              "frame-src 'self' https://accounts.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
```

`script-src` keeps `'unsafe-inline'` because Next.js's own hydration/runtime scripts and this repo's inline JSON-LD blocks are not nonce'd — tightening further would require adding a per-request nonce, which is out of scope for this pass. This CSP is still a meaningful improvement: it blocks loading `<script>` from any *other* origin, and Task 1/2's XSS fixes remove the two known injection sinks that this CSP alone wouldn't have caught.

- [ ] **Step 2: Verify manually**

Run `npm run build && npm run start` (headers from `next.config.ts` are not reliably applied under `next dev --turbopack` for all routes), then:
```bash
curl -sI http://localhost:3000/ | grep -i "content-security-policy\|x-content-type-options\|referrer-policy"
```
Then click through the app in a browser (search, property detail, blog, Google sign-in, image loading) with DevTools console open — confirm there are no CSP violation errors blocking real functionality. If a legitimate script/style/image host is blocked, add it to the relevant directive above rather than removing the directive.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "security: add CSP, nosniff, and referrer-policy headers"
```

---

### Task 5: Server-side admin route gate (defense-in-depth)

**Files:**
- Create: `middleware.ts` (repo root, alongside `next.config.ts`)

This task is explicitly defense-in-depth: `houzdey_backend`'s Task 5 (require super-admin for privileged fields, and every admin route already depending on `get_current_admin_user`/`get_current_super_admin_user`) is the actual security boundary. This task only stops the admin bundle from shipping to and mounting for an unauthorized visitor.

**Before writing this file:** run `npm install` if not already done (Global Constraints), then check `node_modules/next/dist/docs/` per this repo's `AGENTS.md` for the Next.js 16 middleware guide, since this project's Next.js version is explicitly flagged as having breaking changes from older versions. The implementation below uses the long-standing `NextRequest`/`NextResponse` middleware shape (stable across many major Next.js versions) — confirm it still matches before proceeding, and adjust if the installed docs say otherwise.

- [ ] **Step 1: Add the middleware**

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAccessTokenCookie = request.cookies.has('access_token');

  if (!hasAccessTokenCookie) {
    const signInUrl = new URL('/', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

Note: this only checks that an `access_token` cookie is *present* — it cannot verify the JWT's signature or the user's role from the edge without either calling the backend or duplicating JWT verification logic here (the JWT secret must not be shipped to the edge/frontend). A present-but-invalid, expired, or non-admin token still reaches `app/(pages)/admin/layout.tsx`, whose existing client-side check (`user.role === "admin" || "super_admin"`) — backed by every admin API call's real backend authorization — remains the actual gate. This middleware only removes the "no cookie at all" case from ever mounting the admin bundle.

- [ ] **Step 2: Verify manually**

1. In an incognito window (no cookies at all), navigate directly to `/admin` → redirected to `/` before the admin bundle loads (confirm via Network tab: no request for admin-only chunks/data).
2. Log in as a normal (non-admin) user, navigate to `/admin` → middleware lets the request through (cookie present), and the existing client-side check in `admin/layout.tsx` redirects away — unchanged behavior, still safe because of the backend's own role checks on every admin API call.
3. Log in as an admin → `/admin` loads normally.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "security: add edge middleware to gate /admin on cookie presence"
```

---

## After all tasks

Per the chosen execution approach (native, single session), run a fresh-context review of the full diff across both repos (`superpowers:requesting-code-review`) before considering this initiative complete.
