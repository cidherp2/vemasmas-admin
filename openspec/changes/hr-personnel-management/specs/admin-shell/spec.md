# Spec Delta

## Purpose

Provide an authenticated administrative shell that lets HR users move between core areas, understand the current location, and use the interface comfortably on desktop and mobile devices.

## ADDED Requirements

### Requirement: Administrative navigation

The system SHALL provide a persistent administrative shell with navigation entries for Dashboard, Personas, and Configuracion, and SHALL indicate the entry that corresponds to the current route.

#### Scenario: Current section is indicated

- **WHEN** an authenticated user navigates to a section
- **THEN** the matching navigation entry is visibly marked active and the page content remains inside the administrative shell

#### Scenario: Sidebar is collapsed on desktop

- **WHEN** the user toggles the sidebar collapse control on a desktop viewport
- **THEN** the navigation changes to its compact state while preserving icon access, active state, and the control to restore the expanded state

### Requirement: Mobile navigation drawer

The system SHALL make primary navigation available through an off-canvas drawer on mobile-sized viewports without reducing the page content below the viewport width.

#### Scenario: Mobile user opens navigation

- **WHEN** an authenticated user activates the mobile navigation control
- **THEN** the navigation drawer opens above the page content and exposes the same primary destinations as desktop navigation

#### Scenario: Mobile user selects a destination

- **WHEN** the user selects a destination from the mobile drawer
- **THEN** the application navigates to that destination and closes the drawer

### Requirement: Header controls

The system SHALL expose a header with quick navigation search, a light/dark theme control, and a profile menu containing the authenticated user's account action and logout action.

#### Scenario: Header is available across private pages

- **WHEN** an authenticated user opens any private route
- **THEN** the header controls are available without requiring the user to return to the dashboard

#### Scenario: Profile menu is opened

- **WHEN** the user activates the profile control
- **THEN** the account menu opens and presents a clearly labeled logout action

### Requirement: Command palette

The system SHALL provide a command palette that can be opened with the platform command shortcut or an explicit header control and SHALL offer navigation commands for available administrative sections.

#### Scenario: Command palette opens by keyboard

- **WHEN** the user presses Command-K on macOS or Control-K on another supported platform
- **THEN** the command palette opens with focus in its search field

#### Scenario: Command palette closes

- **WHEN** the user presses Escape or selects a command
- **THEN** the palette closes, and selecting a command also navigates to the selected destination

### Requirement: Theme selection

The system SHALL allow the user to switch between light and dark themes and SHALL preserve readable contrast for navigation, content, form feedback, and data tables in both themes.

#### Scenario: User switches theme

- **WHEN** the user activates the theme control
- **THEN** the shell and visible page content switch to the selected theme without a full page reload

#### Scenario: Theme is restored

- **WHEN** the user reloads the application after selecting a theme
- **THEN** the previously selected theme is restored before private content becomes interactive
