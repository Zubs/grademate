# CLAUDE.md

## Project

GradeMate (https://grademate.xyz) is a website that helps university students track their grades. Students record courses and grades by semester, see their semester GPA and CGPA, and forecast the grades they need to reach a target. It supports the 4.0, 5.0, and UK grading systems. Sign-in is currently simulated and records are saved in the browser, until real accounts and online storage are built. The whole platform is free, with no paid plan, but it should be built to the quality of a product people would pay for.

- [Spec.md](Spec.md) describes the product.
- [Features.md](Features.md) lists every feature in build order, with how it works and its tests. Build features in that order and tick each one in the progress list once it's complete.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Nuxt 3 (Vue 3, TypeScript) |
| App data | Pinia, saved in the browser's local storage |
| Charts | Chart.js |
| Light and dark mode | Nuxt Color Mode |
| Styling | Tailwind CSS, with theme tokens and shared styles in `app/assets/css/main.css` |
| Testing | Vitest, with Nuxt Test Utils |
| Browser testing | Playwright |
| Linting | ESLint, with the Nuxt ESLint module |
| Static analysis | `nuxt typecheck` (vue-tsc) |
| Backend (planned) | PHP / Laravel |
| Site hosting | Netlify |
| Backend hosting (planned) | Render, using Docker |

## Commands

```bash
npm install
npm run dev
npm run build
```

Use `npm run dev` rather than `npx nuxt dev`, because the dev server needs the `TMPDIR=/tmp` setting in that script.

## Coding rules

- **No comments.** Write code that explains itself through clear names. Only add a comment when the code is genuinely complicated or something is deliberately set up for a future change.
- **Keep it simple.** Write the simplest code that meets the requirement. Don't add abstractions, layers, or options that aren't needed yet.
- **Use what's built in first.** Before writing custom logic, use what Nuxt, Vue, Pinia, and the browser already provide. Only install a third-party package when the built-in options can't do the job, and prefer packages already listed in the tech stack.
- **Keep running costs at zero.** Don't add paid services or features that cost money per use. The only expected costs are the domain and whatever is needed to host the backend.

## Design and landing page

- Use the `landing-page-design` skill for all web UI work, including the dashboard.
- The landing page deliberately lists every present and proposed feature in [Features.md](Features.md), so it only has to be written once. Don't remove a feature from it because it isn't built yet.
- Never invent testimonials, statistics, or student counts. Use clearly marked placeholders until real ones exist.

## After every plan

Once a plan has been applied, run these checks and fix every issue they report:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Repeat until all five pass with no errors.

These checks must also work as a regression test of every existing feature, not only the one that changed:

- `npm run test` must cover the logic of every completed feature, so add tests for any that aren't covered yet.
- `npm run test:e2e` runs Playwright on both a wide screen and a phone width. It must cover the main journeys: the landing page, demo, registration, sign-in and sign-out, adding years, semesters, and courses, the dashboard, the forecaster, settings, and every feature ticked in [Features.md](Features.md).
- Each new feature adds Playwright tests for the browser tests listed under it in [Features.md](Features.md).

If a regression appears, fix it and run all the checks again.

These tools and scripts aren't set up yet. The first plan must add them, using the tools in the tech stack. Don't consider the work finished until every check passes, and say plainly if any check couldn't be run.
