# GradeMate — Features

This document breaks down every bug fix and feature still to be built on top of what [Spec.md](Spec.md) describes, in the order they should be built. A complete redesign of the website comes first, so every later feature is built in the finished design, and the landing page only has to be done once. Bugs come next, starting with the one that can erase a student's records, because every later feature relies on saved data and GPA results being correct. A backup import follows as a safety net. Real accounts and online storage come after that, so that later features have somewhere safe to keep a student's data. Every feature is free, with no paid plan.

Tick a feature in the list below when everything under **How it works** is built and all its **Tests** pass.

## Progress

- [x] 1. Complete website redesign
- [ ] 2. Keep records after a page reload
- [ ] 3. Courses with no grade
- [ ] 4. Changing the grading scale
- [ ] 5. Separate records for each account
- [ ] 6. Consistent classifications
- [ ] 7. Import from a backup
- [ ] 8. Backend setup and real accounts
- [ ] 9. Online storage of records
- [ ] 10. Custom grading scales
- [ ] 11. Retakes and school rules
- [ ] 12. Enter a score, get the grade
- [ ] 13. Keyboard navigation in the course table
- [ ] 14. Saved degree goal
- [ ] 15. What-if grades
- [ ] 16. Assessment tracker
- [ ] 17. Scholarship and honors tracker
- [ ] 18. PDF export of semester reports
- [ ] 19. Progress share link
- [ ] 20. Course templates
- [ ] 21. Calculator pages for each grading scale

---

## Design

### 1. Complete website redesign

**What it does:** Overhauls the whole website using the `landing-page-design` skill, so it stops looking AI-generated and looks like a product someone would pay to use. The landing page is written once, for the finished product, and won't need revisiting as features ship.

**How it works**
- **Whole site:** The landing page, sign-in, registration, error page, and every dashboard screen are all redesigned, using the skill's visual rules for type, spacing, corners, colors, icons, and motion.
- **One design system:** Fonts, colors, and text styles are set in one place, in both dark and light modes. Fraunces, DM Sans, and the navy background are replaced. Every feature after this one uses the same system.
- **AI generated look removed:** This includes the glow blobs, grid overlay, tilted browser preview, italic accent word, pulsing badge, uppercase section labels, emoji used as icons, and rows of identical cards.
- **Landing page structure:** One primary action, creating a free account, with competing buttons removed from the main banner and the final call to action. The headline names the outcome and the audience. It also has a product preview that shows on phones, an FAQ, a large tagline section that reveals word by word on scroll, and a proof section.
- **Landing page features, present:**
  - Semester GPA and CGPA tracking
  - Records organised by academic year and semester
  - GPA progress chart
  - 4.0, 5.0, and UK grading scales
  - Classification of the current CGPA
  - Target forecaster with scenarios
  - JSON data export
  - Dark and light modes
  - Demo data
- **Landing page features, proposed:**
  - Real accounts with password reset (feature 8)
  - Records synced across devices (feature 9)
  - Import from a backup (feature 7)
  - Custom grading scales (feature 10)
  - Retakes and school rules (feature 11)
  - Enter a score, get the grade (feature 12)
  - Keyboard entry for courses (feature 13)
  - Saved degree goal (feature 14)
  - What-if grades (feature 15)
  - Assessment tracker (feature 16)
  - Scholarship and honors tracker (feature 17)
  - PDF semester reports (feature 18)
  - Progress share link (feature 19)
  - Course templates (feature 20)
  - Free calculator pages for each grading scale (feature 21)
- **Accuracy:** Testimonials, student counts, and other proof are real or clearly marked placeholders, so "Join students who track their academic progress" and "Built for students, by students" are replaced. The page title is retyped using normal letters, because "GradeMate" currently contains Cyrillic lookalike characters. The product preview shows the same number of semesters in its stats and its chart.
- **Demo:** "See a demo" opens the demo directly, the same way the sign-in page's demo button does.
- **Site basics:** Privacy and terms pages, a favicon, social sharing tags, and a skip to content link. Browser pop-up confirmations are replaced with designed dialogs, and the sticky header's scroll handling is made lighter and cleaned up properly.
- **Build order:** Sections are built one at a time in the order the skill sets out: hero, benefits, how it works, proof, FAQ, and final call to action. The other pages follow.

**Tests**
- The landing page lists every present and proposed feature above.
- The main banner has one primary action.
- A signed-out visitor who presses "See a demo" lands on the dashboard with demo data and isn't sent to the sign-in page.
- At 390px wide, every page has no sideways scroll and button text stays inside its button. On the landing page, the primary action is visible on the first screen.
- Every page works and stays readable in both dark and light modes.
- Every page uses only the skill's approved fonts, spacing, text styles, and icons, with no background gradients or italics.
- With reduced motion turned on, the tagline shows at full colour straight away.
- The tagline reveal happens once and doesn't replay on scrolling back up.
- Each FAQ answer can be reached and read with the keyboard.
- Every link goes to a real page, including privacy and terms. Calculator links are the only exception, until feature 21 is built.
- Pressing Tab from the top reaches "skip to content" first, and it moves focus to the main content.
- Every button and link has visible hover and focus states.
- Sharing the landing page link shows its title, description, and image.
- The page title contains only standard Latin letters in "GradeMate".
- The preview's semester count matches the number of bars in its chart.
- The site contains no invented stats or testimonials.
- A visitor on a phone reads the landing page, presses the primary action, reaches the sign-up form, and arrives at a dashboard in the same design.

**Done when:** Every page meets the skill's checklist and looks like one finished product, and the landing page needs no further changes as features 2 to 21 ship.

---

## Bug fixes

### 2. Keep records after a page reload

**What it does:** Stops a page reload from signing students out and stops the next save from erasing their records.

**How it works**
- Today, the browser reads saved data when the app starts, then the empty state sent by the server replaces it. The next save writes that near-empty list over the real records.
- Saved sign-in details and records are loaded once the app has started in the browser, so server state can't replace them.
- The check that protects dashboard pages waits until saved sign-in details have loaded, because the server can't read them.
- Nothing is saved until the student's records have finished loading.

**Tests**
- Reloading any dashboard page keeps the student signed in and on the same page.
- Opening `/dashboard/forecast` directly while signed in opens the forecaster.
- Opening a dashboard page while signed out goes to the sign-in page.
- Opening the sign-in page while signed in goes to the dashboard.
- The CGPA is the same before and after a reload.
- Adding a year after a reload keeps all the existing years.
- Unreadable saved data doesn't crash the app and isn't overwritten until the student makes a change.
- A signed-in page doesn't flash the sign-in screen while loading.
- A student adds a course, reloads, closes the browser, reopens the site, and still sees the course.

**Done when:** Reloading never signs a student out or loses a record, both locally and on the live Netlify site.

### 3. Courses with no grade

**What it does:** Stops a course with no grade from counting as an F.

**How it works**
- A course with no grade is treated differently from a course with a grade worth zero points.
- Courses with no grade are left out of the semester GPA, CGPA, total credits, and courses completed count.
- A semester with no graded courses shows no GPA and isn't included in the CGPA or chart.
- Records already saved with a blank grade are treated the same way.

**Tests**
- One A on 3 credits gives a 4.00 GPA, and adding a course with no grade leaves it at 4.00 with 3 credits.
- An A and an F on 3 credits each give a 2.00 GPA.
- Changing a course's grade back to no grade removes it from the GPA.
- A semester of only ungraded courses doesn't change the CGPA.
- Courses completed counts only graded courses.
- The forecaster ignores ungraded courses.
- A saved course with a blank grade from before this fix is left out of the GPA.

**Done when:** Pressing "Add course" never changes a GPA until a grade is chosen.

### 4. Changing the grading scale

**What it does:** Makes changing the scale recalculate every GPA, as the settings screen promises.

**How it works**
- Each course's points are looked up again from the new scale, then every semester GPA and the CGPA are recalculated.
- A grade with the same name on the new scale takes that scale's points.
- A grade that doesn't exist on the new scale counts as no grade, and the course is flagged so the student can choose a new one.
- The original grade is kept, so switching back restores it.

**Tests**
- An A on 3 credits gives a 4.00 GPA on the 4.0 scale and 5.00 on the 5.0 scale.
- The CGPA, chart, and forecaster all use the new scale straight away.
- An A- moved to the 5.0 scale is flagged and left out of the GPA.
- Switching from 4.0 to 5.0 and back restores the original grades and GPA.
- The new scale and results are still there after a reload.
- With no records, changing the scale causes no errors.

**Done when:** Every number on every page matches the chosen scale right after changing it.

### 5. Separate records for each account

**What it does:** Stops one student seeing another's records on a shared browser, and stops the demo overwriting real records.

**How it works**
- Records saved in the browser belong to the account's email address.
- Signing out hides the records from view without deleting them, and signing back in with the same email restores them.
- Existing records with no owner are given to the first account that signs in.
- Demo data is kept apart from real records, and leaving the demo discards it.
- Pressing "Load demo data" in Settings asks first if the student has records.

**Tests**
- After Alice signs out and Bob signs in, Bob sees no records.
- When Alice signs back in, her records and CGPA are unchanged.
- Trying the demo and then signing in to a real account shows the real records.
- Cancelling "Load demo data" changes nothing.
- Clear all data removes only the current account's records.
- Records saved before this fix appear for the first account to sign in, and only for that account.

**Done when:** No account can see or change another account's records in the same browser, and the demo can't replace real records.

### 6. Consistent classifications

**What it does:** Gives each CGPA one correct classification everywhere it appears.

**How it works**
- The dashboard and forecaster use one shared set of classification rules, instead of a copy each, with the same names.
- Each scale has its own cutoffs.
- Forecaster quick targets use those same cutoffs.
- The 5.0 scale uses the common Nigerian cutoffs: First from 4.50, Second Class Upper from 3.50, Second Class Lower from 2.40, Third from 1.50, and Pass from 1.00. Rules vary by school, so confirm these against a real university before release.

**Tests**
- Every quick target shows the same classification as its label on every scale.
- On the UK scale, the "First Class" quick target sets 3.70 and shows First Class.
- On the 5.0 scale, a 3.60 CGPA shows Second Class Upper.
- A CGPA exactly on a cutoff gets the higher classification, and 0.01 below gets the lower one.
- The dashboard and forecaster show the same classification for the same CGPA.

**Done when:** The same CGPA never gets two different classifications.

---

## Accounts and data

### 7. Import from a backup

**What it does:** Lets students restore the JSON file they download from Settings.

**How it works**
- An import button sits beside the export button in Settings.
- The file is checked before anything changes, and the student sees how many years, semesters, and courses it holds.
- The student must confirm before the import replaces their current records.
- The file's grading scale is applied, and GPAs are recalculated from its courses rather than trusted from the file.

**Tests**
- Exporting and then importing gives the same records and CGPA.
- A file that isn't JSON, or has the wrong structure, shows a clear error and changes nothing.
- An empty file or a backup with no years is handled without errors.
- Cancelling the confirmation changes nothing.
- A file with an edited GPA still shows the GPA calculated from its courses.
- Text in the file is shown as plain text and can't run as code.
- A student exports, clears all data, imports the file, and sees everything restored.

**Done when:** A student can recover all their records from a backup file.

### 8. Backend setup and real accounts

**What it does:** Replaces the simulated sign-in with real accounts, so an email and password must actually match to sign in.

**How it works**
- A Laravel backend provides register, sign in, and sign out, as planned in `README.md`.
- The sign-in session is kept in a secure cookie that page scripts can't read, rather than in local storage.
- Students can reset a forgotten password by email.
- Passwords are stored hashed, and repeated failed sign-ins are rate-limited.
- Profile details and the chosen grading scale are saved to the account.
- The demo keeps working without a real account and never saves to the server.
- A test suite is set up for the backend.
- The backend is deployed to a staging address that the Netlify site can reach.

**Tests**
- Submitting the sign-in form with an empty email and password shows "required" errors for both.
- A student with the correct email and password is signed in and taken to the dashboard.
- A wrong password shows a generic error that doesn't reveal whether the email exists.
- Registering with an email already in use fails with a clear error.
- After the allowed number of failed attempts, further attempts are blocked for a period.
- An expired password reset link no longer works.
- A signed-out visitor requesting a dashboard page is sent to the sign-in page and returned there after signing in.
- Signing out on a device ends the session on that device.
- The session cookie can't be read by page scripts.
- A student registers, signs out, resets their password, and signs in with the new one.

**Done when:** Only real credentials can sign in, and a student can recover a forgotten password.

### 9. Online storage of records

**What it does:** Saves academic years, semesters, and courses to the student's account, so records are available on any device.

**How it works**
- The backend stores years, semesters, and courses, using the endpoints listed in `README.md`.
- Every request is limited to the signed-in student's own records.
- The browser keeps a local copy so the app stays quick, and changes are sent to the server as they're made.
- The first time a student with records in their browser signs in, they're offered the choice to import those records into their account.
- If a save fails, the student is told and can try again.
- JSON export, backup import, and clear all data work on the online records.

**Tests**
- A new account starts with no records and shows the getting started screen.
- A course added on one device appears on another after signing in.
- A student can't read or change another student's records, even by guessing an ID.
- Removing a year also removes its semesters and courses.
- A course with invalid credits or a grade that isn't on the student's scale is rejected.
- The CGPA calculated on the server matches the one shown in the browser.
- Browser records can be imported once, and importing doesn't create duplicates.
- Declining the import leaves the account unchanged.
- With the connection lost, a failed save shows a message and the entered value isn't silently lost.
- Clear all data removes the records from the server and the browser.
- A student builds a record on a laptop, signs in on a phone, and sees the same CGPA.

**Done when:** A student's records survive clearing the browser's data and appear on every device they sign in to.

---

## Product

### 10. Custom grading scales

**What it does:** Lets students set up their own school's grades when the built-in scales don't match.

**How it works**
- A student creates a scale with a name and a list of grades, each with its points and minimum score.
- Classification cutoffs for the scale are optional, and without them no classification is shown.
- A custom scale can be chosen like any built-in one, and changing to it follows the same rules as feature 4.
- Custom scales are saved to the student's account and included in backups.

**Tests**
- A scale with no name or no grades can't be saved.
- Two grades with the same name are rejected.
- Negative or non-numeric points are rejected.
- A course graded on a custom scale gives the correct GPA, and the CGPA is shown out of that scale's top points.
- A scale with no cutoffs shows no classification and causes no errors.
- Editing a scale's points updates every GPA that uses it.
- A scale in use can't be deleted until the student chooses another.
- A custom scale survives a backup and import.
- A student creates a scale for their school, switches to it, and sees the correct CGPA.

**Done when:** A student whose school isn't covered by a built-in scale can get a correct CGPA.

### 11. Retakes and school rules

**What it does:** Keeps the CGPA correct for repeated courses and pass/fail courses, which schools treat differently.

**How it works**
- A student can mark a course as a retake of an earlier course, and can mark any course as pass/fail.
- A setting chooses how retakes count: average all attempts (the default), use only the latest attempt, or use the highest grade.
- An attempt that no longer counts stays visible, is clearly marked, and is left out of its semester GPA and the CGPA.
- Pass/fail courses are left out of the GPA. A passed course counts toward credits earned, and a failed one doesn't.
- The forecaster and every other GPA figure use these same rules.

**Tests**
- With an F and then an A on 3 credits each, averaging gives a 2.00 CGPA from 6 credits.
- With the same courses, using the latest or the highest grade gives a 4.00 CGPA from 3 credits.
- With an A and then a retake graded C, using the latest gives the C's points, and using the highest gives the A's points.
- Changing the retake setting updates the semester GPAs, CGPA, chart, and forecaster straight away.
- A course can't be a retake of itself or of a later course.
- Removing a retake makes the earlier attempt count again.
- A passed course adds to credits earned without changing the CGPA.
- Retake and pass/fail details survive a backup and import.
- A student who repeated a course sets their school's rule and sees the correct CGPA.

**Done when:** A student's CGPA follows their school's retake rule, and pass/fail courses never change it.

### 12. Enter a score, get the grade

**What it does:** Lets students type a score such as 72% and have the grade chosen for them.

**How it works**
- A course can take a score as well as a grade from the dropdown.
- The grade comes from the minimum scores already in each scale, including custom scales.
- The score is saved with the course, and choosing a grade by hand clears it.
- Changing scale works out the grade again from the saved score.

**Tests**
- On the 5.0 scale, a score of 72 gives an A and 69 gives a B.
- A score exactly on a grade's minimum gets that grade.
- Scores of 0 and 100 work, and scores below 0, above 100, or not numeric are rejected.
- Clearing a score leaves the course with no grade.
- A course with a score keeps it after changing scale, and gets the grade for that scale.
- Choosing a grade by hand replaces the score's grade.
- A custom scale with no minimum scores offers only the dropdown.

**Done when:** A student can enter scores instead of grades and get the correct GPA.

### 13. Keyboard navigation in the course table

**What it does:** Lets students enter a whole semester of courses without using a mouse.

**How it works**
- Tab moves through name, code, credits, score, grade and on to the next course.
- Enter on the last field of the last course adds a new course and moves to its name field.
- Grades can be chosen by typing.
- The focused field is always clearly visible.

**Tests**
- Tab and Shift+Tab move through the fields in reading order.
- Enter on the last course adds exactly one new row and focuses its name field.
- Enter on an earlier row doesn't add a row.
- Removing a course with the keyboard moves focus to a sensible neighbouring field.
- The semester GPA updates after a grade is chosen with the keyboard.
- A student adds five courses using only the keyboard.

**Done when:** A full semester can be entered with the keyboard alone.

### 14. Saved degree goal

**What it does:** Lets students save a target CGPA and their degree's total credits, and follow their progress.

**How it works**
- The goal is set once and saved with the student's records and backups.
- The dashboard shows credits earned against the total, the current CGPA against the target, and the average GPA still needed.
- The forecaster starts from the saved goal, and works out the remaining credits, rather than starting from a default of 60.
- The student can change the goal at any time, and can still try other numbers in the forecaster without saving them.

**Tests**
- With no goal set, the dashboard shows a prompt to set one.
- A target above the scale's maximum is rejected.
- Total credits below the credits already earned are rejected.
- With 3.20 from 60 credits, a target of 3.40, and 90 total credits, the dashboard shows a needed average of 3.80.
- Adding a graded course updates the progress straight away.
- Having earned all the credits shows a completed state instead of an error.
- A target that can no longer be reached says so.
- Changing the grading scale asks the student to review their target.
- The goal is still there after a reload.

**Done when:** A student can see at a glance how close they are to their goal and what they still need.

### 15. What-if grades

**What it does:** Lets students try grades for real upcoming courses and see the resulting CGPA without saving anything.

**How it works**
- A student lists upcoming courses with credits, and picks a possible grade for each.
- The resulting semester GPA and CGPA update straight away, and show the change from the current CGPA and any saved goal.
- Courses already in the record with no grade can be pulled in automatically.
- What-if grades never change the real record, GPA, or chart.

**Tests**
- With no courses, a prompt is shown.
- With a 3.00 CGPA from 30 credits, an A on 30 credits on the 4.0 scale shows 3.50.
- Changing a what-if grade updates the result straight away.
- Leaving the page leaves the real CGPA and records unchanged.
- Courses with no grade in the record appear, and their real grade stays blank.
- A course with no what-if grade doesn't change the result.
- A student tries three sets of grades and compares the results to their target.

**Done when:** A student can test any combination of grades without touching their real record.

### 16. Assessment tracker

**What it does:** Shows a student where they stand in a course during the term, and the score they need on what's left to get the grade they want.

**How it works**
- A student adds a course's assessments, each with a name, a weight, and a score once they have one.
- The tracker shows the marks earned so far and the percentage of the course still to come.
- The student picks a target grade, and the tracker shows the average they need on the remaining assessments, using the scale's minimum scores.
- When every assessment has a score, the course can take its final score and grade, as in feature 12.
- A course's assessments feed its possible grade into what-if grades.

**Tests**
- A course with no assessments shows a prompt to add them.
- Weights that don't total 100% show a warning, and no required score is shown until they do.
- On the 5.0 scale, with 80% on coursework worth 30% and an exam worth 70% left, a target of A shows 65.7% needed on the exam.
- A target that needs over 100% says it can no longer be reached.
- A target already secured says so rather than showing a negative score.
- Scores below 0, above 100, or not numeric are rejected.
- With every score entered, the final score gives the right grade and updates the GPA.
- A custom scale with no minimum scores shows the running percentage but no required score.
- The tracker doesn't change the GPA until the student applies the final grade.
- A student enters coursework scores during the term and checks what they need on the final.

**Done when:** A student can see their standing in any course and exactly what they need on what's left.

### 17. Scholarship and honors tracker

**What it does:** Lets students track the GPA they must keep for a scholarship, the dean's list, or graduate school, and warns them when it's at risk.

**How it works**
- A student adds any number of requirements, each with a name, a minimum GPA, and whether it applies to the CGPA or a semester GPA.
- The dashboard shows each requirement as met, at risk (within 0.10 of the minimum), or missed, along with the margin left.
- For a CGPA requirement, the student can enter next semester's credits and see the average needed to stay above the minimum.
- What-if grades show which requirements each set of grades would keep or miss.
- Warnings appear on screen. Nothing is sent by email.

**Tests**
- With no requirements, the dashboard shows a prompt to add one.
- A 3.50 CGPA against a 3.50 minimum counts as met and at risk, and a 3.49 CGPA counts as missed.
- A 3.61 CGPA against a 3.50 minimum counts as met and not at risk.
- With 3.60 from 60 credits, a 3.50 minimum, and 15 credits next semester, the average needed is 3.10.
- A semester GPA requirement checks the latest graded semester.
- A minimum above the scale's maximum is rejected.
- Changing the grading scale asks the student to review their requirements.
- Requirements survive a reload and a backup and import.
- A student adds a scholarship requirement, tries what-if grades, and sees the warning when a set of grades would miss it.

**Done when:** A student can see at a glance whether each requirement is safe, and is warned before a result puts it at risk.

### 18. PDF export of semester reports

**What it does:** Lets students download a clean report for advisor meetings, scholarship applications, or internships.

**How it works**
- A download button on each semester creates a PDF, using `jsPDF` and `html2canvas` as suggested in `README.md`.
- The report shows the student's name, institution, semester, courses, credits, grades, semester GPA, CGPA, and grading scale.
- The report always uses a light layout, whichever theme the student has chosen.

**Tests**
- A semester with no courses shows a message instead of an empty report.
- A semester's report lists every course with the same credits and grade as the screen.
- The GPA and CGPA in the report match the dashboard.
- A student with no institution set gets a report with no blank label.
- A semester with enough courses to fill a page continues cleanly on a second page.
- The report looks the same in dark and light mode.
- Long course names don't overflow the page.
- A student downloads a report on desktop and on a phone, and opens it.

**Done when:** A student can download a readable, correct semester report that they'd be happy to show someone.

### 19. Progress share link

**What it does:** Lets students share a private, read-only summary of their progress with a parent, sponsor, or mentor.

**How it works**
- A student creates a link showing their name, CGPA, classification, credits earned, grading scale, and GPA chart. Course grades are hidden unless they choose to include them.
- Every page says "Self-reported by the student. Not an official transcript."
- Links are hard to guess, expire after 30 days by default, and can be turned off at any time.
- The page shows the student's current figures and the date they were last updated.
- Shared pages are hidden from search engines and never allow changes.

**Tests**
- Viewing a link needs no account and shows only the chosen details.
- Course grades don't appear unless the student included them.
- The self-reported label appears on every shared page, in both themes.
- An expired or turned off link shows a clear message and no student data.
- Changing a grade updates the shared page.
- A shared page is marked not to be indexed by search engines.
- A shared page offers no way to change anything, and its requests can't edit records.
- A student with several links can turn off one without affecting the others.
- A student shares a link with a sponsor, who opens it on a phone, and the student later turns it off.

**Done when:** A student can share their progress safely, and no one could mistake it for an official transcript.

### 20. Course templates

**What it does:** Saves new students from typing in every course by offering pre-filled course lists for common degrees.

**How it works**
- When adding a semester, a student can choose a template for their degree and level.
- A template fills in course names, codes, and credits and leaves the grades blank.
- Students can edit or remove anything after applying a template.
- Templates are managed in one place, so more can be added without changing the app's screens.

**Tests**
- With no matching template, a semester can still be filled in by hand.
- Applying a template adds its courses with the right names, codes and credits and no grades.
- Editing a course afterwards changes only that student's copy.
- Applying a template to a semester that already has courses asks first and doesn't silently overwrite them.
- A new student applies a template, adds their grades, and sees the correct GPA.

**Done when:** A student can fill a semester from a template in one step, then enter their grades.

---

## Growth

### 21. Calculator pages for each grading scale

**What it does:** Brings in students searching for a GPA calculator, with a free calculator page for each grading scale.

**How it works**
- One public page per scale, such as `/calculator/4-0-gpa`, `/calculator/5-0-gpa` and `/calculator/uk`.
- Each page has a simple calculator that works without an account, plus a short explanation of how that scale works.
- Pages are pre-rendered so search engines can read them, with their own title, description, and answers to common questions.
- Pages are included in a sitemap, and the landing page's calculator links from feature 1 lead to them. The temporary prerender exclusion for `/calculator` in `nuxt.config.ts` is removed.
- A prompt invites students to create an account and save their results.

**Tests**
- On the 4.0 page, an A and a B on 3 credits each gives a GPA of 3.50.
- On the 5.0 page, an A and a B on 3 credits each gives a GPA of 4.50.
- An empty calculator shows a prompt rather than an error or a GPA of zero.
- Each page's title, description, and main content are in the page source before scripts run.
- The sitemap lists every calculator page.
- Each calculator gives the same GPA as the dashboard for the same courses.
- A student finds a calculator page, works out their GPA, creates an account, and continues in the dashboard.

**Done when:** Each page works without an account, and search engines can read its content.
