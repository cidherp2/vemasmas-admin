# Spec Delta

## Purpose

Provide reliable sign-in and session boundaries so only authenticated HR users can access private administration features while local development remains usable when Supabase is not configured.

## ADDED Requirements

### Requirement: Email and password sign-in

The system SHALL provide a login experience that accepts an email address and password, validates required input, and reports authentication failures without exposing sensitive details.

#### Scenario: Valid credentials are accepted

- **WHEN** a user submits a valid configured email and password
- **THEN** the system establishes an authenticated session and redirects the user to the intended private destination or the dashboard

#### Scenario: Invalid credentials are rejected

- **WHEN** a user submits credentials that Supabase Auth rejects
- **THEN** the system keeps the user on the login screen, displays an accessible error message, and does not expose whether the email or password was incorrect

#### Scenario: Required login input is missing

- **WHEN** the user submits the login form without a required email or password
- **THEN** the form identifies the missing field and does not send an authentication request

### Requirement: Protected private routes

The system SHALL prevent unauthenticated users from accessing Dashboard, Personas, person detail, and person form routes.

#### Scenario: Unauthenticated user requests a private route

- **WHEN** a user without an active session requests a private route
- **THEN** the system redirects the user to Login and retains the requested destination for post-login navigation

#### Scenario: Authenticated user requests a private route

- **WHEN** a user with an active session requests a private route
- **THEN** the system renders the requested route inside the administrative shell

### Requirement: Session restoration

The system SHALL restore the current authentication state when the application starts and SHALL avoid rendering private content as accessible before that state is known.

#### Scenario: Existing session is restored

- **WHEN** the application starts with a valid persisted Supabase session
- **THEN** the user remains authenticated and can access the private route requested after the session check completes

#### Scenario: Session is absent or expired

- **WHEN** the application starts without a valid session or receives a sign-out event
- **THEN** private content is unavailable and the user is directed to Login

### Requirement: Development fallback authentication

When Supabase public configuration is absent in a local development build, the system SHALL expose an explicitly labeled simulated login mode that creates only a local development session and SHALL keep that mode disabled for production builds.

#### Scenario: Local configuration is absent

- **WHEN** a local development build has no Supabase URL and public key configured
- **THEN** the login screen identifies simulated mode and a successful simulated submission grants access only within the local browser session

#### Scenario: Production configuration is absent

- **WHEN** a production build has no Supabase configuration
- **THEN** the system does not grant simulated access and displays a configuration failure state instead

### Requirement: Logout

The system SHALL provide logout from the profile menu, invalidate the active session, and remove access to private routes after logout completes.

#### Scenario: User logs out

- **WHEN** an authenticated user confirms logout
- **THEN** the system ends the configured or simulated session, redirects to Login, and prevents the previous private route from being rendered through browser back navigation
