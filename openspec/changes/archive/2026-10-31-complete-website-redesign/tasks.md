# Tasks

## 1. Checks and safety net

- [x] 1.1 Add `@nuxt/eslint`, `eslint`, `typescript`, and `vue-tsc`, with `lint` and `typecheck` scripts, then fix existing issues and verify both commands pass
- [x] 1.2 Add Vitest with `@nuxt/test-utils` and a `test` script, and verify `npm run test` runs
- [x] 1.3 Write store tests for current GPA, CGPA, course add and remove, and forecast results, leaving out behavior features 2 to 6 will change, and verify they pass against unchanged stores
- [x] 1.4 Add Playwright and `@axe-core/playwright` with a `test:e2e` script that runs a production build on 1280px and 390px widths, and verify a smoke test passes
- [x] 1.5 Write Playwright journeys on the current site for registration, sign in and out, adding a year, semester, and course, the dashboard, a forecast, and settings, moving by clicks rather than reloads, and verify they pass
- [x] 1.6 Add the design audit test (fonts, type sizes, spacing, gradients, sideways scroll, contrast), and verify it reports violations on the current site, with its assertions held as expected failures until group 7

## 2. Design system

- [x] 2.1 Add Tailwind v4 through `@tailwindcss/vite`, connect its `dark:` variant to Nuxt Color Mode, and verify with `npm run build` that a utility class applies and existing pages still render
- [x] 2.2 Declare theme colors for both themes and the motion and hero width tokens in `main.css`, and replace the fonts in `nuxt.config.ts` with Geist, verifying by loading a page in both themes
- [x] 2.3 Add the named text style utilities and shared button, form, card, and badge styles with their focus states, and verify on a temporary page in both themes that each state is visible, then delete that page
- [x] 2.4 Add `@phosphor-icons/vue`, and verify an icon renders in a server-rendered page
- [x] 2.5 Add the shared scroll reveal composable with reduced motion support, and verify with a unit test that it skips setup under reduced motion

## 3. Site frame and foundations

- [x] 3.1 Redesign `default.vue` with a floating nav, full height phone menu, and new footer, deleting the scroll listener and the "Built for students, by students" line, and verify menu open, close, and links with Playwright at both widths
- [x] 3.2 Add a skip to content link to all three layouts, and verify the first Tab press and focus move with Playwright
- [x] 3.3 Add `ConfirmDialog` on the native dialog element and replace the `confirm()` calls in settings and semesters, and verify cancel, Escape, confirm, and focus return with Playwright
- [x] 3.4 Add the corrected title, favicon, and sharing tags, and the `NUXT_PUBLIC_SITE_URL` setting defaulting to https://grademate.xyz, and verify with a test that the title is standard Latin letters, the favicon loads, and the sharing image address is absolute
- [x] 3.5 Add `/privacy` and `/terms` with draft text matching what the app does today, linked from the footers, and verify the links with Playwright

## 4. Landing page

- [x] 4.1 Remove the old landing page's markup and styles, then build the hero with one primary action and the flat preview from one sample data array, and verify with Playwright the one action at 390px and that semester count equals chart bars
- [x] 4.2 Rebuild the hero as the code-drawn "Chart your course" scene, and verify with Playwright the target control, the star count, and no sideways scroll
- [x] 4.2a Stop for owner review of the hero in both themes and at both widths, and record the approval or requested changes before continuing (approved by the owner on the "Chart your course" scene)
- [x] 4.3 Build the four feature sections with interface fragments, and verify with Playwright that all 24 features appear with no unavailable labels
- [x] 4.4 Build the tagline reveal, and verify with Playwright the word order, no replay, and full color under reduced motion
- [x] 4.5 Build how it works with the "See a demo" link through a new `useDemo` composable also used by the sign in page, and verify with Playwright that a signed-out visitor lands on the dashboard with demo data
- [x] 4.6 Build the proof section using marked placeholders only, and verify with Playwright that the old unproven phrases are gone from the site
- [x] 4.7 Build the FAQ of six to twelve questions, and verify keyboard reading with Playwright
- [x] 4.8 Build the final call to action with the same single action, and verify with Playwright that it matches the hero and that page copy has no hyphens, em dashes, or banned words
- [x] 4.9 Render `public/og-image.png` from the finished design, and verify the sharing test loads it

## 5. Sign in, registration, and error pages

- [x] 5.1 Redesign `auth.vue`, `login.vue`, and `register.vue` around the night scene so they match the landing page, removing blobs, the grid, and the dead forgot password link, and verify the existing journeys and the audit pass on these pages
- [x] 5.2 Redesign `error.vue` and `ColorModeToggle.vue`, and use the night scene with the line "This star isn't on your chart", and verify with Playwright that an unknown address shows the new page in both themes

## 6. Dashboard

- [x] 6.1 Redesign `dashboard.vue` with new navigation, current page indication, and phone menu, and verify navigation with Playwright at both widths
- [x] 6.2 Redesign the overview, replacing the ring's gradient with SVG and redrawing the chart on theme change, and verify with Playwright that the chart follows a theme switch and that the shown CGPA is unchanged
- [x] 6.3 Redesign semesters, including a table that scrolls within its own container on phones, and verify the course journey and no page overflow at 390px
- [x] 6.4 Redesign the forecaster, replacing symbols with Phosphor icons, and verify the forecast journey gives the same results
- [x] 6.5 Redesign settings, replacing emoji flags with labels, and verify the profile, theme, scale, export, and clear data journeys

## 7. Whole site verification

- [x] 7.1 Turn the design audit's expected failures into required passes for every page in both themes at both widths, fix what it reports, remove leftover old CSS from `main.css` including the skeleton gradient, and verify no page keeps a scoped style block without a specific need
- [x] 7.2 Check every public link with Playwright, with calculator links as the only allowed failures
- [x] 7.3 Walk through the skill's quick checklist and each `Features.md` feature 1 test, noting anything not met, and verify none remain beyond what is recorded
- [x] 7.4 Update the design sections of `README.md` and `Spec.md` to match the new system, and verify no mention of Fraunces, DM Sans, or navy remains in them
- [x] 7.5 Run `npm run lint`, `typecheck`, `test`, `build`, and `test:e2e` until all pass
- [x] 7.6 Stop for owner review of the full site, and on approval tick feature 1 in `Features.md` (approved by the owner)

## Workflow follow-up

- Keep this off production until the owner decides, ideally after at least features 2 to 6.
- Replace proof placeholders and have the legal draft reviewed before launch.
- Archive the change after review.
