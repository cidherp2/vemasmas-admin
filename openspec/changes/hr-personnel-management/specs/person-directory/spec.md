# Spec Delta

## Purpose

Give authenticated HR users a searchable and responsive personnel directory with complete person lifecycle management, clear validation, and feedback for successful or failed data operations.

## ADDED Requirements

### Requirement: Personnel list

The system SHALL display authenticated users a table or equivalent responsive list containing each person's name, email, phone, role, and status.

#### Scenario: List loads successfully

- **WHEN** an authenticated user opens the Personas route and the data request succeeds
- **THEN** the system displays the returned people with the required fields and an action to open each person's detail view

#### Scenario: List is loading

- **WHEN** the Personas route is waiting for its initial data request
- **THEN** the system displays stable loading placeholders and does not present stale controls as if the request had completed

#### Scenario: Empty list is returned

- **WHEN** the data request succeeds with no people
- **THEN** the system displays an explicit empty state with an available action to create the first person

### Requirement: Search and filtering

The system SHALL filter the visible personnel list in real time by case-insensitive name or email text and SHALL provide a status filter that can be combined with the search text.

#### Scenario: User searches by name

- **WHEN** the user enters text that matches part of a person's name
- **THEN** the visible list contains matching people and excludes non-matching people without a full page reload

#### Scenario: User combines search and status filters

- **WHEN** the user enters search text and selects a status
- **THEN** the visible list contains only people matching both criteria

#### Scenario: No filter result exists

- **WHEN** active search or filters match no records
- **THEN** the system displays a no-results state and provides a way to clear the active filters

### Requirement: Person creation

The system SHALL allow an authenticated user to create a person with required name, email, and phone fields, an optional role, and a status that defaults to active when omitted.

#### Scenario: Person is created

- **WHEN** the user submits valid person data and the persistence operation succeeds
- **THEN** the new person appears in the directory with a generated identifier and creation timestamp, and the user receives success feedback

#### Scenario: Duplicate email is rejected

- **WHEN** the user submits an email already assigned to another person
- **THEN** the system keeps the form available, identifies the conflict in accessible feedback, and does not create a duplicate record

### Requirement: Person editing

The system SHALL allow an authenticated user to edit an existing person's name, email, phone, role, and status using the same validation rules as creation.

#### Scenario: Person is updated

- **WHEN** the user submits valid changes for an existing person and the persistence operation succeeds
- **THEN** the directory and the person's detail view show the updated values and the user receives success feedback

#### Scenario: Edit request fails

- **WHEN** an update request fails because of a network, authorization, RLS, or server error
- **THEN** the system preserves the entered values, reports a recoverable error, and does not present the update as successful

### Requirement: Person deletion

The system SHALL require explicit confirmation before deleting a person and SHALL remove the record only after the delete operation succeeds.

#### Scenario: Delete is confirmed

- **WHEN** the user confirms deletion and the persistence operation succeeds
- **THEN** the person is removed from the directory and the user receives success feedback

#### Scenario: Delete is cancelled

- **WHEN** the user closes or cancels the delete confirmation
- **THEN** the person remains unchanged and no delete request is sent

### Requirement: Person detail view

The system SHALL provide a dedicated detail view that displays the complete persisted person record and exposes permitted edit and delete actions.

#### Scenario: Detail view loads

- **WHEN** an authenticated user opens an existing person's detail route
- **THEN** the system displays the person's name, email, phone, role, status, identifier, and creation timestamp

#### Scenario: Person does not exist

- **WHEN** the detail request returns no matching person
- **THEN** the system displays a not-found state and provides navigation back to the directory

### Requirement: Form validation

The system SHALL reject person data unless name, email, and phone are present, the email has a valid email format, and the phone contains exactly ten numeric digits.

#### Scenario: Invalid person form is submitted

- **WHEN** the user submits a person form with missing required data, an invalid email, or a phone that is not exactly ten digits
- **THEN** the form identifies each invalid field inline, prevents the persistence request, and keeps the entered values available for correction

#### Scenario: Valid optional role is omitted

- **WHEN** the user submits valid required fields without a role
- **THEN** the form is accepted and the persisted role remains empty or null according to the database contract

### Requirement: Operation feedback and access errors

The system SHALL expose loading state during person reads and writes and SHALL provide accessible feedback for network failures, HTTP failures, authentication failures, and RLS or permission failures.

#### Scenario: Read request fails

- **WHEN** a person list or detail read fails
- **THEN** the system displays an error state with a retry action and does not silently show an empty successful state

#### Scenario: Mutation is in progress

- **WHEN** a create, update, or delete operation is being submitted
- **THEN** the relevant controls are disabled or protected from duplicate submission and a loading indicator is visible

#### Scenario: Permission is denied

- **WHEN** Supabase rejects a person operation because the session is missing or an RLS policy denies access
- **THEN** the system reports an actionable permission error and does not mutate local displayed data as if the operation succeeded

### Requirement: Responsive directory experience

The system SHALL keep directory data, forms, actions, and validation feedback usable at mobile, tablet, and desktop breakpoints without horizontal content loss.

#### Scenario: Directory is viewed on a narrow viewport

- **WHEN** the user opens the directory or a person form on a mobile-sized viewport
- **THEN** the layout adapts its columns and actions so all required information and controls remain reachable without page-level horizontal scrolling
