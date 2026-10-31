# visual-design-system Specification

## Purpose

Defines the shared visual rules every GradeMate page follows, so the whole site looks like one finished product in both themes and on every screen size.

## Requirements

### Requirement: Single approved typeface
Every page SHALL use one approved typeface, with no italic text and no weight above bold. Fraunces and DM Sans SHALL NOT be used.

#### Scenario: Fonts on any page
- **WHEN** any page is rendered in either theme
- **THEN** all text uses the approved typeface, none is italic, and no weight exceeds 700

### Requirement: Approved type and spacing values
Every font size SHALL come from the approved type scale, and every margin, padding, and gap SHALL come from the approved spacing values: 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, or 96 pixels.

#### Scenario: Audit of a page
- **WHEN** the computed styles of visible elements are checked on any page at wide and 390px widths
- **THEN** every font size, margin, padding, and gap is an approved value

### Requirement: Flat backgrounds
Page and component backgrounds SHALL be flat. The only permitted gradient SHALL be on the landing page hero heading text. Dark mode UI backgrounds SHALL use only approved colors. Illustrations MAY use their own flat colors.

#### Scenario: Background audit
- **WHEN** elements on any page are checked in either theme
- **THEN** none has a gradient background except the hero heading text, and no glow blob or grid overlay is present

### Requirement: Generated look removed
Pages SHALL NOT use tilted previews, pulsing badges, uppercase section labels, emoji as icons, or rows of identical feature cards.

#### Scenario: Feature presentation
- **WHEN** a visitor views the landing page feature sections
- **THEN** features are grouped into varied sections rather than one repeated card grid

#### Scenario: Icons
- **WHEN** any page shows an icon
- **THEN** it comes from the approved icon set and no emoji or text symbol stands in for it

### Requirement: Dark and light themes
Every page SHALL work and stay readable in dark and light modes, with text meeting WCAG AA contrast.

#### Scenario: Switching theme
- **WHEN** a student changes theme on any page, including one showing the GPA chart
- **THEN** all content, including the chart, updates to the new theme without a reload

#### Scenario: Contrast
- **WHEN** an automated contrast check runs on each page in each theme
- **THEN** it reports no text contrast violations

### Requirement: Responsive layout
Every page SHALL be usable from 390px wide upward, with no sideways scrolling and with button text inside its button.

#### Scenario: Phone width
- **WHEN** any page is viewed at 390px wide
- **THEN** the page does not scroll sideways and no button text overflows

### Requirement: Interaction states
Every button and link SHALL have visible hover and keyboard focus states, and buttons SHALL show pressed feedback.

#### Scenario: Keyboard focus
- **WHEN** a keyboard user moves focus to a button or link
- **THEN** a visible focus indicator appears

### Requirement: Weighted, restrained motion
Animated transitions SHALL decelerate into place, last at least 200ms, and move only with transform and opacity. Scroll reveals SHALL happen once per section.

#### Scenario: Reduced motion
- **WHEN** a visitor has reduced motion turned on
- **THEN** content appears without movement

#### Scenario: Scrolling back up
- **WHEN** a visitor scrolls back to a section that already revealed
- **THEN** the reveal does not replay
