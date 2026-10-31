# GradeMate — Nuxt 3 Rewrite

> Your academic journey, tracked. A full-product GPA calculator built with Nuxt 3, Pinia, and Chart.js.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

---

## Project structure

```
grademate/
├── app/
│   ├── assets/css/main.css        # Tailwind theme and shared styles
│   ├── app.vue                    # Root with page transitions
│   ├── error.vue                  # 404 page
│   ├── components/
│   │   ├── ColorModeToggle.vue    # Dark/light toggle
│   │   ├── NightScene.vue         # Code-drawn hero artwork
│   │   └── ProductPreview.vue     # Interactive hero preview
│   ├── layouts/
│   │   ├── default.vue            # Marketing layout (header + footer)
│   │   ├── auth.vue               # Auth layout (centered card, blurred bg)
│   │   └── dashboard.vue          # App layout (sidebar + topbar)
│   ├── middleware/
│   │   ├── auth.ts                # Redirect unauthenticated users → /login
│   │   └── guest.ts               # Redirect authenticated users → /dashboard
│   ├── pages/
│   │   ├── index.vue              # Landing page
│   │   ├── login.vue              # Sign in
│   │   ├── register.vue           # Create account
│   │   └── dashboard/
│   │       ├── index.vue          # Overview — CGPA, chart, stats
│   │       ├── semesters.vue      # Academic years + course entry
│   │       ├── forecast.vue       # Target grade forecaster
│   │       └── settings.vue       # Profile, scale, data export
│   ├── public/                    # Favicon and sharing image
│   └── stores/
│       ├── auth.ts                # User auth state (localStorage-backed)
│       └── academic.ts            # Years → Semesters → Courses + GPA logic
├── tests/                         # Vitest unit tests and Playwright browser tests
├── nuxt.config.ts
└── package.json
```

---

## Pages

| Route                  | Layout    | Auth       | Description                                              |
|------------------------|-----------|------------|----------------------------------------------------------|
| `/`                    | default   | public     | Landing page with hero, features, FAQ, and CTA            |
| `/privacy`, `/terms`   | default   | public     | Legal pages                                              |
| `/login`               | auth      | guest-only | Sign in form with demo shortcut                          |
| `/register`            | auth      | guest-only | Registration with scale selection + password strength    |
| `/dashboard`           | dashboard | required   | Overview — CGPA ring, stats, GPA chart, recent semesters |
| `/dashboard/semesters` | dashboard | required   | Add years/semesters, course entry table                  |
| `/dashboard/forecast`  | dashboard | required   | Target CGPA forecaster + scenarios table                 |
| `/dashboard/settings`  | dashboard | required   | Profile, theme, grading scale, data export               |

---

## Design system

Tailwind CSS theme tokens and shared styles live in `app/assets/css/main.css`, following the `landing-page-design` skill.

**Colors:** Neutral dark and light surfaces with one amber accent. The night scene artwork in `NightScene.vue` uses its own flat colors.
**Typography:** `Geist`, with named text styles such as `heading-1`, `body-3`, and `button-md`.
**Icons:** Phosphor.
**Dark/light:** Class-based through `@nuxtjs/color-mode`, connected to Tailwind's `dark:` variant.

---

## Data model

```
User (localStorage: grademate_user)
  └── AcademicYear[]  (localStorage: grademate_years)
        └── Semester[]
              └── Course[]
                    ├── name, code
                    ├── credits (number)
                    ├── grade (string — from active scale)
                    └── gradePoints (number)
```

Computed: `Semester.gpa`, `Semester.totalCredits`, `Store.cgpa` (weighted average across all semesters).

---

## Grading scales

| Scale              | Max | Configured grades            |
|--------------------|-----|------------------------------|
| 4.0 (US)           | 4.0 | A+ through F (11 grades)     |
| 5.0 (NG)           | 5.0 | A through F (6 grades)       |
| UK Classifications | 4.0 | First, 2:1, 2:2, Third, Fail |

Switch in `/dashboard/settings`. Switching recalculates GPA values; raw grades remain stored.

---

## Connecting a real backend

The auth store (`stores/auth.ts`) currently mocks login/register with a setTimeout.  
Replace those functions with real API calls:

```typescript
// stores/auth.ts — replace mock login
async function login(email: string, password: string) {
    isLoading.value = true
    const res = await $fetch('/api/auth/login', {
        method: 'POST', body: {email, password}
    })
    user.value = res.user
    // store token in httpOnly cookie via useRuntimeConfig or useCookie
    isLoading.value = false
}
```

For the academic data store, replace `persist()` calls with API syncs and keep localStorage as an optimistic cache.

**Recommended backend:** Laravel (as planned) with these endpoints:

- `POST /api/auth/login|register|logout`
- `GET|POST|DELETE /api/years`
- `GET|POST|DELETE /api/years/:id/semesters`
- `GET|POST|PUT|DELETE /api/semesters/:id/courses`

---

## Scripts

```bash
npm run dev       # Dev server at localhost:3000
npm run build     # Production build
npm run generate  # Static site generation (for Netlify/Vercel)
npm run preview   # Preview production build locally
npm run lint      # ESLint
npm run typecheck # Static analysis
npm run test      # Vitest unit tests
npm run test:e2e  # Playwright browser tests, including the design audit
```

Deploy to Netlify: set build command to `npm run generate`, publish dir to `.output/public`.
