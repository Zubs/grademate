# Tasks

## 1. Reproduce the bug in tests

- [x] 1.1 Add Playwright journeys for every scenario in the `record-persistence` spec, using real reloads and direct page opens, and verify the reload and data loss journeys fail against the current code for the expected reason

## 2. Saved data loading

- [x] 2.1 Move local storage reads in `auth.ts` and `academic.ts` into `hydrate()` actions that handle unreadable data and unknown scales, and verify with unit tests that bad data doesn't throw and storage stays untouched
- [x] 2.2 Add the `loaded` guard to `persist()` and update existing store tests to hydrate first, and verify with a unit test that a save before loading writes nothing and a save after loading keeps all records
- [x] 2.3 Add `app/plugins/persisted-state.client.ts`, hydrating straight away on browser-only pages and on `app:mounted` on server-rendered pages, and verify the landing page loads with no hydration warnings in the browser console

## 3. Page access

- [x] 3.1 Set `ssr: false` route rules for `/dashboard/**`, `/login`, and `/register`, and verify with Playwright that the reload, direct open, and redirect journeys pass, including the return to the original page after sign in
- [x] 3.2 Set the app's first paint to the theme background on browser-only pages, and verify with a Playwright test that the sign-in screen never appears during a dashboard reload
- [x] 3.3 Remove any test helper workaround that depended on reloads not working, and verify the existing journeys still pass

## 4. Verification

- [x] 4.1 Run `npm run generate`, and verify the static output serves the landing page's content in its HTML and has a fallback page for the browser-only routes
- [x] 4.2 Update the persistence statements in `Spec.md` and `README.md` if they no longer match, and verify they describe the new behavior
- [x] 4.3 Run `npm run lint`, `typecheck`, `test`, `build`, and `test:e2e` until all pass
- [x] 4.4 Stop for the owner to confirm the reload journey on a Netlify deploy preview, as the feature's done criterion requires, and on confirmation tick feature 2 in `Features.md` (confirmed by the owner)

## Workflow follow-up

- Archive the change after review.
- Deciding when this reaches `grademate.xyz` remains the owner's call, because deploying also publishes the redesign.
