# Spec Delta

## Purpose

Defines how a student's sign-in state and academic records survive reloads, direct page opens, and browser restarts, so saved records are never lost to page loading.

## ADDED Requirements

### Requirement: Sign-in survives page loads
A signed-in student SHALL stay signed in and on the same page after reloading or directly opening any page.

#### Scenario: Reloading a dashboard page
- **WHEN** a signed-in student reloads any dashboard page
- **THEN** they remain signed in on that page

#### Scenario: Opening a dashboard page directly
- **WHEN** a signed-in student opens `/dashboard/forecast` directly
- **THEN** the forecaster opens

#### Scenario: Reloading a public page
- **WHEN** a signed-in student reloads the landing page and then opens the dashboard
- **THEN** they are still signed in and see their records

### Requirement: Records survive page loads
A student's records and results SHALL be unchanged by reloading, or by closing and reopening the browser.

#### Scenario: CGPA after a reload
- **WHEN** a student with records reloads a dashboard page
- **THEN** the page shows the same CGPA as before

#### Scenario: Reopening the browser
- **WHEN** a student adds a course, reloads, closes the browser, and reopens the site
- **THEN** the course is still there

### Requirement: Saving never erases unloaded records
The system SHALL NOT write records until saved records have finished loading, and each save SHALL keep all existing records.

#### Scenario: Adding after a reload
- **WHEN** a student reloads and then adds an academic year
- **THEN** all their existing years are kept alongside the new one

#### Scenario: Signing in after visiting the landing page
- **WHEN** a student with saved records loads the landing page, signs in, and adds a year
- **THEN** all their existing years are kept alongside the new one

### Requirement: Page access follows sign-in state
Dashboard pages SHALL be available only to signed-in students, and sign-in and registration pages only to signed-out visitors, without first showing the page the visitor can't use.

#### Scenario: Signed out on a dashboard page
- **WHEN** a signed-out visitor opens a dashboard page
- **THEN** they are sent to the sign-in page, and return to that dashboard page after signing in

#### Scenario: Signed in on the sign-in page
- **WHEN** a signed-in student opens the sign-in or registration page
- **THEN** they are sent to the dashboard

#### Scenario: No sign-in flash
- **WHEN** a signed-in student reloads a dashboard page
- **THEN** the sign-in screen never appears

### Requirement: Unreadable saved data is safe
Unreadable saved data SHALL NOT crash the app, and SHALL stay in place until the student makes a change.

#### Scenario: Corrupted records
- **WHEN** a student's saved records can't be read and they open the dashboard
- **THEN** the getting started screen appears and the saved data is unchanged

#### Scenario: Corrupted sign-in details
- **WHEN** saved sign-in details can't be read and a visitor opens a dashboard page
- **THEN** they are sent to the sign-in page without an error

#### Scenario: Unknown saved scale
- **WHEN** the saved grading scale isn't a supported scale
- **THEN** the default scale is used without an error
