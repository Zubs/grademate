# Proposal

## Why

A full page reload signs students out, and their next save can permanently erase their records. The fault was reproduced on a local build, and the live site runs code with the same logic. Every later feature relies on saved records, so this comes first among the bug fixes.

## What Changes

- Keep students signed in, and on the same page, after reloading or directly opening any dashboard page.
- Load saved sign-in details and records so that empty server state can't replace them.
- Block saving until records have finished loading, so an empty list can't overwrite real records.
- Send signed-out visitors from dashboard pages to sign in, and signed-in students from the sign-in and registration pages to the dashboard, without showing the wrong page first.
- Handle unreadable saved data without crashing, and leave it in place until the student makes a change.
- Add regression tests that use real reloads, which earlier tests deliberately avoided.

**Not in this change:** separating records by account or protecting them from the demo (feature 5), real accounts (feature 8), and recovering records already lost to this bug, because they no longer exist anywhere.

## Capabilities

### New Capabilities
- `record-persistence`: How a student's sign-in state and records survive reloads, direct page opens, and closing the browser, and when saved data may be written.

### Modified Capabilities

None. The existing specs don't cover persistence, and their requirements still hold.

## Impact

- **Code:** `app/stores/auth.ts`, `app/stores/academic.ts`, `app/middleware/auth.ts`, `app/middleware/guest.ts`, `nuxt.config.ts`, and a new client plugin.
- **Tests:** new Playwright reload journeys and store unit tests. Existing store tests need to load the store first.
- **Dependencies:** none.
- **Hosting:** dashboard, sign-in, and registration pages stop being rendered on the server. Saved data keeps its current format.
