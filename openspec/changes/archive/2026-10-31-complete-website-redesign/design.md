# Design

## Context

See `proposal.md` for motivation and the specs for requirements. Today's site is Nuxt 3 with plain scoped CSS, about 5,200 lines across layouts and pages, and shared tokens in `app/assets/css/main.css`. Icons are hand-pasted SVGs plus emoji. There are no lint, type check, or test tools. `CLAUDE.md` requires them after every plan, and this is the first plan. Three bugs affect testing and are out of scope: a full reload signs a student out (feature 2), the demo overwrites saved records (feature 5), and classifications disagree (feature 6).

## Goals / Non-Goals

**Goals:**
- One design system that later features can use without inventing values.
- A landing page that won't need edits as features ship.
- Automated checks that protect the current behavior through the redesign.

**Non-Goals:**
- Changing store logic or fixing features 2 to 6.
- Building proposed features. They appear only as landing page copy.
- Deploying to production.

## Decisions

### Tailwind CSS, as the skill proposes
The owner chose Tailwind, because the skill states its type scale, radius, and motion rules in Tailwind terms. Tailwind v4 is added through its official `@tailwindcss/vite` plugin in `nuxt.config.ts`, which needs no extra Nuxt module and little configuration. Alternative: `@nuxtjs/tailwindcss` is a further wrapper that adds nothing this project needs.

- **Markup:** redesigned pages and layouts use utility classes in their templates, and their scoped `<style>` blocks are removed. Old pages keep working on the old `main.css` rules until their task replaces them.
- **Tokens:** `main.css` imports Tailwind and declares theme colors with `@theme`, backed by CSS variables that change with the theme. The existing `dark` and `light` classes from Nuxt Color Mode drive Tailwind's `dark:` variant through `@custom-variant`.
- **Text styles:** the skill's named styles (`heading-1`, `body-3`, `button-md`, and so on) are defined once as `@utility` classes, so pages don't repeat size and weight.
- **Allowed values:** only Tailwind steps matching the skill's spacing table are used: `0`, `0.5`, `1`, `2`, `3`, `4`, `6`, `8`, `10`, `12`, `16`, `20`, and `24`. Arbitrary values such as `text-[19px]` aren't allowed, except for the skill's own base motion curve and 680px hero width, which are defined once as theme tokens. The design audit enforces the computed results.

### Geist as the one typeface
Geist replaces both fonts through the existing Google Fonts link, so no package is needed. GPA figures use tabular numerals instead of adding Geist Mono. Alternative: Manrope has a softer look, while Geist reads more like a precise tool.

### Colors keep amber, drop navy
Dark surfaces use the skill's `#181818`, `#1F1F1F`, `#272727`, and `#313131`. Light mode uses white and neutral gray surfaces. Amber stays as the single accent for continuity, used sparingly: primary actions, current state, and key figures. Amber text in light mode is a darker shade so it passes contrast. Semantic green and red remain for status only. Alternative: a new accent color would discard the only brand equity the product has, and the feature only asks to replace navy.

### Phosphor icons
`@phosphor-icons/vue` replaces hand-pasted SVGs, emoji, and text symbols such as the warning and check marks. It is approved by the skill, renders on the server, and imports per icon. Flags become plain scale labels.

### Landing page composition
Layout type A, classic hero plus sections, because the product is clear from a preview. The order is floating nav, hero, feature sections, tagline reveal, how it works, proof, FAQ, and final call to action.

The 24 features are grouped into four sections with different layouts, each with a real interface fragment, so they don't become a wall of cards:

| Section | Features |
|---|---|
| Know where you stand | GPA and CGPA tracking, year and semester records, progress chart, classification, retakes and school rules, assessment tracker |
| Plan what comes next | Target forecaster and scenarios, what if grades, saved degree goal, scholarship and honors tracker |
| Fits your school | 4.0, 5.0, and UK scales, custom scales, free calculator pages |
| Enter it once, keep it safe | Score to grade, keyboard entry, course templates, real accounts with password reset, sync across devices, JSON export, backup import, PDF reports, progress share link, dark and light modes, demo data |

"What-if" is written "what if" because the skill bans hyphens in copy.

Draft hero copy, to be refined during the build:
- **Headline:** "Know your GPA / and what it takes to raise it"
- **Subheadline:** "GradeMate tracks every grade for university students on 4.0, 5.0, and UK scales, then shows the results you need to reach your target."
- **Primary action:** "Create your free account"
- **Proof line:** "Free for every student. No credit card."

"See a demo" sits as a text link at the end of how it works, so it doesn't compete in the main banner or final call to action. The header offers a text "Sign in" link beside a small button for the same primary action.

### "Chart your course" hero art, drawn in code
The owner found the first heroes boring and pointed to pages built around one striking image with a visual metaphor. The hero becomes a full-screen night scene: a student on a hill looking up at a sky where stars form a rising line, one per semester, ending at a bright target star. The owner chose art drawn in code over generated images, so it costs nothing.

- **Drawing:** inline SVG with flat color layers: concentric sunset rings, hills, a campus skyline, and a student at a telescope. It has no gradients, so it follows the flat background rule through poster-style color steps. Stars come from a seeded generator, so server and browser render the same.
- **Colors:** the scene is artwork, so its indigo and sunset colors sit outside the UI background list. It looks the same in both themes, and the hero uses the dark tokens in both.
- **Layout:** the background art and the constellation are separate SVGs. The background crops to any screen, while the constellation stays fully visible in its own layout slot.

### Product preview as the constellation
The constellation and a translucent readout panel replace the earlier preview. Both use one sample data array, so the semester count and stars can't disagree. A slider moves the target star and updates the average needed, using `transform` and `opacity` only. Alternative: a screenshot would go stale and couldn't respond.

### Shared demo entry
A `useDemo` composable holds what `handleDemo` in `login.vue` does now: simulated demo sign-in, load demo data, and open the dashboard. Both the landing page and sign-in page call it. It keeps the existing overwrite bug, which feature 5 fixes in that one place.

### Tagline reveal and scroll reveals
An `IntersectionObserver` per word, removed after it fires, with server-rendered text at full color and muting applied only after the page starts in the browser. Without JavaScript the text stays readable. Reduced motion skips the setup entirely. Section reveals use one shared composable on the same basis.

### Navigation needs no scroll listener
The header becomes a compact floating bar with a translucent, blurred surface that looks the same at every scroll position, so the listener in `default.vue` is deleted, not throttled. On phones, the menu opens as a full height panel with links arriving in sequence.

### Native dialog element
A `ConfirmDialog` component wraps the browser's `<dialog>`, which provides focus containment, Escape, and focus return. It replaces the `confirm()` calls in `settings.vue` and `semesters.vue`. Alternative: a dialog library would add a dependency for what the platform already does.

### Chart and CGPA ring
Chart colors are read from CSS tokens and redrawn when the color mode changes, which fixes a chart that today stays in its old theme. Fonts change to Geist. The CGPA ring's `conic-gradient` becomes an SVG circle, to meet the no gradient rule. The `.skeleton` shimmer gradient in `main.css` is removed, as nothing should use it.

### Metadata and sharing image
`nuxt.config.ts` gets the corrected title, favicon, and sharing tags. A new `public/` folder holds `favicon.svg` and a 1200 by 630 `og-image.png`, rendered once from the new design. The sharing tags use the live address, https://grademate.xyz, as the default for a `NUXT_PUBLIC_SITE_URL` setting, so preview deploys can override it.

### Legal pages
`/privacy` and `/terms` use the default layout. Their text is a plain draft, accurate to what the app does today: records stay in the browser, and sign-in is simulated. Features 8 and 9 must update them, because they change where data lives.

### Test tooling and regression approach
- **Lint and types:** `@nuxt/eslint` and `nuxt typecheck` with `vue-tsc`. Existing issues are fixed in the first group, so later diffs stay clean.
- **Unit tests:** Vitest with `@nuxt/test-utils` on the stores, to lock in current GPA, CGPA, and forecast results before the redesign. These avoid asserting the known bugs, so features 2 to 6 can fix them freely.
- **Browser tests:** Playwright runs on 1280px and 390px widths against a production build, with journeys written before page redesigns, then updated with new selectors. Tests move through the app by clicking and never rely on a full reload surviving, because of feature 2.
- **Design audit:** a Playwright test walks every page in both themes, checking computed fonts, sizes, spacing, gradients, and overflow against the spec's values. `@axe-core/playwright` checks contrast and accessibility. This makes the design rules enforceable for later features too.

## Risks / Trade-offs

- **[Promising features that don't exist]** The landing page lists 15 unbuilt features, and visitors could sign up and lose data to the reload bug. → This change does not deploy to production. Keep it on a branch or preview link until at least features 2 to 6 are done. The decision on when to go live remains the owner's.
- **[Placeholders visible in proof]** Marked placeholders look unfinished. → Replace them with real proof before launch. Never fill them with invented content.
- **[Code-drawn art looks more graphic than painted]** It won't match generated paintings. → The owner accepted this when choosing it, and the poster style leans into it.
- **[Whether it looks generated is subjective]** The audit can't judge taste. → The owner reviews the hero before the remaining sections are built, and the full site at the end.
- **[Strict spacing in dense tables]** The approved spacing values may feel tight in the course table on phones. → Let the table scroll inside its own container at narrow widths, rather than scroll the page.
- **[Large diff across every page]** Regressions are easy to introduce. → Unit and browser tests land first, and stores stay untouched.
- **[Legal text is a draft]** It hasn't had legal review. → Flag it to the owner at completion.

## Migration Plan

No data changes. Records in local storage keep their format. Rollback is reverting the branch.
