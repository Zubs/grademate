# Design

## Context

See `proposal.md` for motivation. Records and sign-in details live only in browser local storage, which the server can't read, yet all pages are rendered on the server. This fails in two ways:

- **State replacement:** each store reads local storage when created, then Pinia overwrites it with the empty state sent by the server. Memory is empty while storage is intact, and the next `persist()` writes the near-empty list over the real records.
- **Wrong redirect:** the `auth` middleware runs on the server, always sees no user, and returns a redirect to `/login`.

Feature 8 will later replace simulated sign-in with a real session.

## Goals / Non-Goals

**Goals:**
- Make data loss through loading impossible, not just unlikely.
- Keep the landing page server-rendered for search engines and sharing.

**Non-Goals:**
- Per-account records or demo separation (feature 5).
- Syncing changes between open browser tabs.
- Changing the storage format.

## Decisions

### Render app pages only in the browser
`routeRules` set `ssr: false` on `/dashboard/**`, `/login`, and `/register`. These pages depend on browser-only data and have no search value, so server rendering gives them nothing. Without it, the middleware runs only where the data exists and the wrong page can't flash. Alternatives: a cookie the server could read would need a rewrite that feature 8 would replace, and a client-only guard with a loading state on server-rendered pages adds complexity for no benefit.

The public landing, privacy, terms, and error pages stay server-rendered.

### Load saved data in one client plugin
Stores stop reading local storage when created, and gain a `hydrate()` action. A new `app/plugins/persisted-state.client.ts` calls it for both stores after Pinia has applied server state, so server state can't replace saved data.

- **Browser-only pages:** the plugin hydrates straight away, so the middleware sees the right user on the first route check.
- **Server-rendered pages:** the plugin hydrates when Vue's first render resolves (`app:suspense:resolve`), because `app:mounted` proved too early and caused a mismatch, so the first browser render matches the server's HTML and avoids a hydration mismatch. A signed-in student on the landing page briefly sees "Create account" before the header updates, which is accepted as minor.

### Guard every save
The academic store keeps a `loaded` flag that `hydrate()` sets. `persist()` does nothing until it is set, as a second safeguard behind the plugin. Alternative: relying on load order alone would leave any future ordering mistake able to destroy data again.

### Unreadable data stays until a change
`hydrate()` catches parse failures and uses empty values, without touching storage. A saved scale outside the known list falls back to `4.0`. The student's next change overwrites the bad data, as the feature specifies. Alternative: deleting bad data on load would destroy anything that could have been recovered by hand.

### Test with real reloads
Playwright tests use real reloads and direct page opens against the production build, reversing the earlier rule that tests avoid reloads. Local storage is seeded through the demo flow, so tests exercise the real save path.

### Exclude calculator links from static generation
Found during implementation: the landing page's calculator links from feature 1 lead to pages that don't exist until feature 21, and they made `npm run generate` fail outright. `/calculator` is excluded from prerendering until then, and feature 21 removes the exclusion.

### Deploy as static files
Found during the deploy preview: Netlify's server function returned a 500 on every server-rendered page, while browser-only pages worked. The same function build worked on macOS and in a clean Linux container on Node 20 and 22, so the cause wasn't found outside Netlify. The app has no server-side needs, so `netlify.toml` now runs `npm run generate` and publishes `dist`, which runs no function. The static output passes the reload and journey tests.

## Risks / Trade-offs

- **[Blank moment on app pages]** Browser-only pages show a blank screen until scripts load. → This replaces a wrong redirect, and the page background is set so it doesn't flash white. A loading template is added only if this looks poor in review.
- **[Static hosting behavior]** The site now depends on static output on Netlify. → Confirm on a Netlify deploy preview before ticking the feature.
- **[Records already lost]** Records overwritten before this fix can't be recovered. → Nothing can be done in code, and `grademate.xyz` stays exposed until this ships.
- **[Shared browser]** Fixing reloads means records now reliably reappear for whoever signs in next. → That exposure already exists, and feature 5 fixes it.

## Migration Plan

No data migration is needed, since the storage format is unchanged. Rollback is reverting the change. Shipping needs care: `grademate.xyz` runs the old code, and deploying this branch also publishes the redesign's unbuilt feature promises, so the owner decides when it goes live.
