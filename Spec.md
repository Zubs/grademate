# GradeMate — Website Spec

**Website:** https://grademate.xyz
**Stage:** In development (pre-release)

---

## 1. Introduction

GradeMate helps university students keep track of their grades. Students record their courses and grades by semester, see their semester GPA and overall CGPA update straight away, and find out what grades they need to reach a target. It works with the 4.0 scale, the 5.0 scale and UK degree classifications, so students can use the system their university uses.

In this version, sign-in is simulated and everything is saved in the student's own browser. There is no real account system yet, so records stay on one device and are lost if the browser's data is cleared. Real accounts and online storage are planned. See [Features.md](Features.md) for everything still to be built.

---

## 2. Business context

- **Audience:** University students who want to follow their academic progress and plan for a target result.
- **Grading systems:** 4.0 (common in the US), 5.0 (common in Nigeria) and UK degree classifications.
- **Cost:** Free to use.
- **Code:** Hosted on GitHub.

---

## 3. User roles

| Role | Description |
|---|---|
| **Visitor** | Anyone on the public site. Can read the landing page, sign in or create an account. |
| **Student** | A signed-in user. Can manage their academic record, run forecasts and change their settings. |

---

## 4. Features

### 4.1 Public site

- **Landing page:** Explains the product, with a main banner, a preview of the dashboard, the main features, how it works in three steps, the supported grading scales and a final call to create an account.
- **Create an account:** Name, email and password, plus a choice of grading scale.
- **Sign in:** Email and password, with a shortcut to try the product using demo data.
- **Light and dark mode:** A toggle on the site. Dark is the default.
- **Page not found:** A custom error page.
- **Legal pages:** Privacy and terms.

### 4.2 Student dashboard

- **Overview:** Shows the student's CGPA and classification, total credits, courses completed, semester count and best semester GPA. Also includes a chart of GPA by semester, the change since the last semester and a list of recent semesters. New students see a getting started screen.
- **Semesters:** Add or remove academic years and semesters (First, Second or Summer). Within a semester, add, edit or remove courses with a name, code, credits and grade. The semester GPA updates straight away.
- **Target forecaster:** The student enters a target CGPA and the credits they have left. It shows the average GPA they need, how realistic that is, which grades meet it and how different results would change their final CGPA.
- **Settings:** Update profile details and institution, choose the theme and change the grading scale. Changing the scale recalculates all GPAs while keeping the grades entered.
- **Data:** Download all records as a JSON file, load demo data or clear everything.

**Example forecast**

> Current CGPA: 3.20 from 60 credits
> Target CGPA: 3.40 with 30 credits to go
>
> You need an average GPA of 3.80 across 30 credits.
> A stretch goal, so stay focused

---

## 5. Design and branding

The site uses neutral surfaces with an amber accent, in both dark and light modes, and the Geist font throughout. Public pages share a code-drawn night scene, where a student charts their semesters as stars toward a target star.

---

## 6. Tech stack

| Area | Choice |
|---|---|
| Framework | Nuxt 3 (Vue) |
| App data | Pinia, saved in the browser's local storage |
| Styling | Tailwind CSS |
| Charts | Chart.js |
| Testing | Vitest and Playwright |
| Light and dark mode | Nuxt Color Mode |
| Hosting | Netlify |
