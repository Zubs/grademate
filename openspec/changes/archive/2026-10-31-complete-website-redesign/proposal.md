# Proposal

## Why

GradeMate looks like a generated template, which undercuts a product meant to feel worth paying for even though it is free. Redesigning first means every later feature in `Features.md` is built in the finished design, and the landing page, written for the finished product, is only done once.

## What Changes

- Replace the visual design of every page (landing, sign-in, registration, error, and all dashboard screens) with one design system that follows the `landing-page-design` skill, in dark and light modes.
- Move styling to Tailwind CSS, as the skill proposes, replacing the scoped CSS in each page.
- Replace Fraunces, DM Sans, and the navy background. Remove the glow blobs, grid overlay, tilted preview, italic accent, pulsing badge, uppercase labels, emoji icons, and rows of identical cards.
- Rebuild the landing page around one primary action, creating a free account, with a new hero, feature sections, how it works, proof, FAQ, tagline reveal, and final call to action.
- List all 24 present and proposed features from `Features.md` on the landing page, with no "coming soon" labels. This is a deliberate product decision.
- Make "See a demo" open the demo for signed-out visitors, instead of sending them to sign in.
- Fix accuracy problems: replace unproven claims with real proof or marked placeholders, remove the Cyrillic lookalike letters from the page title, and make the product preview consistent.
- Add privacy and terms pages, a favicon, social sharing tags, a skip to content link, and designed confirmation dialogs. Remove the unthrottled header scroll listener.
- Add the checks `CLAUDE.md` requires after every plan: ESLint, `nuxt typecheck`, Vitest, and Playwright, as `npm run lint`, `typecheck`, `test`, and `test:e2e`.

**Not in this change:** the bugs in features 2 to 6 (including the reload data loss), any feature from 7 to 21, and any deployment to production. See `design.md` for why the redesign must not go live on its own.

## Capabilities

### New Capabilities
- `visual-design-system`: The shared look of every page: fonts, text styles, spacing, colors, icons, motion, themes, interaction states, and responsive behavior.
- `landing-page`: What the public landing page says and does: primary action, feature list, demo entry, proof, FAQ, and tagline reveal.
- `site-foundations`: Site-wide essentials: legal pages, page metadata and sharing, skip link, confirmation dialogs, and working links.

### Modified Capabilities

None. `openspec/specs/` is empty.

## Impact

- **Code:** `app/assets/css/main.css`, `nuxt.config.ts`, all layouts and pages, `app/error.vue`, and `ColorModeToggle.vue`. New pages for privacy and terms, a dialog component, and a demo composable. The stores keep their current logic.
- **Dependencies:** adds `tailwindcss`, `@tailwindcss/vite`, `@phosphor-icons/vue`, `@axe-core/playwright`, `@nuxt/eslint`, `eslint`, `typescript`, `vue-tsc`, `vitest`, `@nuxt/test-utils`, and `@playwright/test`, with whatever peer packages they require. No new paid services.
- **Docs:** `README.md` and `Spec.md` design sections, and the `Features.md` progress list.
