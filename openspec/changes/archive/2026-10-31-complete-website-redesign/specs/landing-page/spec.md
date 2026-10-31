# Spec Delta

## Purpose

Defines what the public landing page says and does, so it converts visitors into accounts and describes the finished product without needing to be rewritten as features ship.

## ADDED Requirements

### Requirement: One primary action
The landing page SHALL have one primary action, creating a free account. The main banner and final call to action SHALL offer no competing button.

#### Scenario: Main banner on a phone
- **WHEN** a visitor opens the landing page at 390px wide
- **THEN** the create account action is visible on the first screen and is the only button in the main banner

#### Scenario: Final call to action
- **WHEN** a visitor reaches the final call to action
- **THEN** it offers the same create account action and no sign in button

#### Scenario: Following the primary action
- **WHEN** a visitor on a phone presses the primary action
- **THEN** the sign up form opens, and completing it arrives at a dashboard in the same design

### Requirement: Outcome led headline
The main banner SHALL state the outcome and the audience in its headline, and show a product preview at every screen width.

#### Scenario: Product preview on a phone
- **WHEN** a visitor views the main banner area at 390px wide
- **THEN** the product preview is visible on the page without tilting or overflow

### Requirement: Illustrated main banner
The main banner SHALL fill the screen with a night scene where stars chart a student's semesters toward a target star, looking the same in both themes.

#### Scenario: Moving the target
- **WHEN** a visitor moves the target control
- **THEN** the target star moves to match, and the average needed and its status update

#### Scenario: Reduced motion
- **WHEN** a visitor with reduced motion turned on views the scene
- **THEN** the stars do not twinkle and the target star moves without animating

### Requirement: Complete feature list
The landing page SHALL describe all present features and all features proposed in `Features.md`, with no labels marking any as unavailable.

#### Scenario: Present features listed
- **WHEN** a visitor reads the page
- **THEN** it covers semester GPA and CGPA tracking, records by academic year and semester, the GPA progress chart, the 4.0, 5.0, and UK scales, CGPA classification, the target forecaster with scenarios, JSON data export, dark and light modes, and demo data

#### Scenario: Proposed features listed
- **WHEN** a visitor reads the page
- **THEN** it covers real accounts with password reset, records synced across devices, backup import, custom grading scales, retakes and school rules, score to grade entry, keyboard course entry, a saved degree goal, what if grades, an assessment tracker, a scholarship and honors tracker, PDF semester reports, a progress share link, course templates, and free calculator pages for each scale

### Requirement: Demo entry for signed-out visitors
The landing page SHALL offer "See a demo" outside the main banner and final call to action. It SHALL open the dashboard with demo data without asking the visitor to sign in.

#### Scenario: Pressing See a demo
- **WHEN** a signed-out visitor presses "See a demo"
- **THEN** they land on the dashboard with demo data and are not sent to the sign in page

### Requirement: Truthful proof
The site SHALL NOT present invented testimonials, statistics, or student counts. Missing proof SHALL appear as clearly marked placeholders.

#### Scenario: No real proof yet
- **WHEN** no real testimonial or statistic has been supplied
- **THEN** the proof section shows marked placeholders, and the phrases "Join students who track their academic progress" and "Built for students, by students" appear nowhere

### Requirement: Consistent product preview
Figures in the product preview SHALL agree with each other.

#### Scenario: Semester count
- **WHEN** a visitor views the preview
- **THEN** its semester count equals the number of semester stars in its chart

### Requirement: Frequently asked questions
The landing page SHALL answer six to twelve questions in plain question and answer form, reachable and readable by keyboard.

#### Scenario: Keyboard use
- **WHEN** a keyboard user tabs to a question and activates it
- **THEN** its answer becomes readable and focus stays visible

### Requirement: Tagline reveal
The landing page SHALL have a large tagline section of at least two lines, apart from the main banner, whose words move from muted to full color one at a time as it scrolls into view.

#### Scenario: Scrolling into view
- **WHEN** a visitor scrolls the tagline into view
- **THEN** its words reach full color one at a time, in reading order, and do not replay on scrolling back up

#### Scenario: Reduced motion
- **WHEN** a visitor with reduced motion turned on reaches the tagline
- **THEN** it is already at full color with no animation

### Requirement: Copy rules
Landing page copy SHALL use sentence case headings and buttons, and SHALL contain no hyphens, em dashes, or banned filler words.

#### Scenario: Copy check
- **WHEN** the visible text of the landing page is checked
- **THEN** it contains no hyphen, no em dash, and none of the skill's banned filler words
