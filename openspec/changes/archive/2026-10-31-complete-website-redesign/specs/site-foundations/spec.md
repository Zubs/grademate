# Spec Delta

## Purpose

Defines the site-wide essentials that make GradeMate feel finished and trustworthy: legal pages, correct metadata and sharing, keyboard access, safe confirmations, and working links.

## ADDED Requirements

### Requirement: Legal pages
The site SHALL have privacy and terms pages, linked from the footer of every public layout.

#### Scenario: Opening a legal page
- **WHEN** a visitor follows the privacy or terms link
- **THEN** the page opens in the site design and offers a way back to the home page

### Requirement: Correct page identity
Every page SHALL have a title spelling "GradeMate" with standard Latin letters, and the site SHALL have a branded favicon.

#### Scenario: Title check
- **WHEN** the title of any page is read
- **THEN** every letter of "GradeMate" is a standard Latin character

#### Scenario: Favicon
- **WHEN** any page loads
- **THEN** the branded favicon is served successfully

### Requirement: Social sharing
The landing page SHALL provide a title, description, and image for link previews.

#### Scenario: Reading sharing tags
- **WHEN** the page source of the landing page is read
- **THEN** it includes title, description, and image sharing tags, and the image file loads

### Requirement: Skip to content
Every page SHALL offer a skip to content link as its first keyboard stop.

#### Scenario: First Tab press
- **WHEN** a keyboard user presses Tab once after a page loads
- **THEN** "Skip to content" appears and has focus, and activating it moves focus to the main content

### Requirement: Designed confirmation dialogs
Destructive confirmations SHALL use a designed dialog rather than a browser pop-up, and cancelling SHALL change nothing.

#### Scenario: Cancelling clear all data
- **WHEN** a student opens the clear all data dialog and cancels it, or presses Escape
- **THEN** the dialog closes and their records are unchanged

#### Scenario: Confirming removal of a year
- **WHEN** a student confirms removing an academic year
- **THEN** that year and its semesters are removed

#### Scenario: Keyboard use in a dialog
- **WHEN** a dialog is open
- **THEN** keyboard focus stays inside it, and returns to the triggering control when it closes

### Requirement: Working links
Every link SHALL lead to a real page or section. Links to calculator pages are the only exception until those pages are built.

#### Scenario: Link check
- **WHEN** every link on the public pages is followed
- **THEN** each one succeeds, apart from links to calculator pages

### Requirement: Light scroll handling
The site header SHALL NOT run work on an unthrottled scroll listener, and SHALL leave no listener behind after navigating away.

#### Scenario: Leaving a page
- **WHEN** a visitor scrolls and moves between pages
- **THEN** no header scroll listener accumulates

### Requirement: Existing features keep working
The redesign SHALL NOT remove or change the behavior of any present feature, including GPA results.

#### Scenario: Main journeys after the redesign
- **WHEN** a student registers, signs in and out, adds years, semesters, and courses, views the dashboard, runs a forecast, and changes settings
- **THEN** each works as it did before, with the same calculated results
