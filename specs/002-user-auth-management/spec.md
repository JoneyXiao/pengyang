# Feature Specification: User Authentication & Role Management

**Feature Branch**: `002-user-auth-management`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User description: "Please create a login page that simplifies the user registration and login process to enhance the overall user experience. Users will need to provide a username and password. By default, there will be one super admin user. After logging in, other users can request to become admin users, but only the super admin can view these requests and approve or reject them. The super admin has user management permissions, while both the super admin and admin users can manage website content. All users have a default football avatar and can edit their profiles."

## Clarifications

### Session 2026-04-22

- Q: What authentication/storage approach should be used for user accounts? → A: Supabase Auth for login + Supabase Postgres for user profiles/roles.
- Q: Should users register with a username, an email address, or both? → A: Email for auth + required username for display (both collected at registration).
- Q: How long should a user session remain valid before expiring due to inactivity? → A: 7 days.
- Q: Should role-based access be enforced via Supabase RLS policies, application-level middleware, or both? → A: Both RLS + application middleware (defense-in-depth).
- Q: How should the default super admin account be created? → A: Automated seed migration using environment variables for credentials.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Register and Log In (Priority: P1)

A new user visits the site and wants to create an account. They navigate to the registration page, enter a username and password, and submit the form. After successful registration, they are directed to log in. They enter their credentials on the login page and gain access to the authenticated area of the site.

**Why this priority**: Registration and login are the gateway to all other features. Without working authentication, no other user stories can function.

**Independent Test**: Navigate to the registration page, create an account with a unique username and valid password, then log in with those credentials. Verify the user lands on an authenticated dashboard page.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they navigate to the login page, **Then** they see a form with email and password fields, a login button, and a link to register.
2. **Given** an unauthenticated visitor on the registration page, **When** they submit a valid email, a unique username, and a valid password, **Then** an account is created and they are prompted to log in.
3. **Given** a registered user on the login page, **When** they enter valid email and password and submit, **Then** they are authenticated and redirected to their dashboard.
4. **Given** a visitor on the registration page, **When** they submit a username that already exists, **Then** they see a clear error message indicating the username is taken.
5. **Given** a user on the login page, **When** they enter incorrect credentials, **Then** they see a clear error message without revealing whether the email or password was wrong.

---

### User Story 2 — Super Admin Manages Admin Requests (Priority: P1)

The super admin logs in and sees a notification or section indicating pending admin requests. They can view the list of users who have requested admin privileges, review each request, and approve or reject them. Approved users immediately gain admin permissions; rejected users are notified of the decision.

**Why this priority**: The super admin's ability to manage roles is the core authorization mechanism. Without it, no other users can gain admin permissions.

**Independent Test**: Log in as the super admin, verify the admin request management area is visible, approve one request and reject another, then verify the approved user has admin permissions and the rejected user does not.

**Acceptance Scenarios**:

1. **Given** the super admin is logged in, **When** they navigate to the user management area, **Then** they see a list of pending admin role requests with the requester's username and request date.
2. **Given** the super admin views a pending request, **When** they approve it, **Then** the requesting user's role is updated to admin and the request is removed from the pending list.
3. **Given** the super admin views a pending request, **When** they reject it, **Then** the request is removed from the pending list and the user's role remains unchanged.
4. **Given** there are no pending requests, **When** the super admin views the management area, **Then** they see an empty state message indicating no pending requests.

---

### User Story 3 — User Requests Admin Role (Priority: P2)

A regular logged-in user wants to help manage website content. They find an option to request admin privileges, submit the request, and see a confirmation that their request is pending. They can check the status of their request while waiting for the super admin to act on it.

**Why this priority**: This enables the delegation of content management responsibilities and is the user-facing side of the role management workflow.

**Independent Test**: Log in as a regular user, submit an admin role request, verify the request shows as pending, then log in as super admin and confirm the request appears.

**Acceptance Scenarios**:

1. **Given** a logged-in regular user, **When** they view their dashboard, **Then** they see an option to request admin privileges.
2. **Given** a logged-in regular user, **When** they submit an admin role request, **Then** they see a confirmation that their request is pending review.
3. **Given** a user with a pending request, **When** they view their dashboard, **Then** they see the current status of their request (pending).
4. **Given** a user whose request was approved, **When** they view their dashboard, **Then** they see their updated role as admin and the request option is no longer shown.
5. **Given** a user whose request was rejected, **When** they view their dashboard, **Then** they see that their request was not approved and can submit a new request.

---

### User Story 4 — Edit User Profile (Priority: P2)

A logged-in user wants to personalize their profile. They navigate to their profile page, see their default football avatar, and can update their display name and other profile details. The changes are saved and reflected immediately.

**Why this priority**: Profile editing personalizes the experience and gives users ownership of their identity on the platform.

**Independent Test**: Log in as any user, navigate to the profile page, verify the default football avatar is displayed, update the display name, save, and confirm the change persists on page reload.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they navigate to their profile page, **Then** they see their current profile information including the default football avatar.
2. **Given** a logged-in user on the profile page, **When** they edit their display name and save, **Then** the updated name is displayed and persists across sessions.
3. **Given** a newly registered user, **When** they view their profile, **Then** a default football avatar is displayed automatically.

---

### User Story 5 — Role-Based Content Management Access (Priority: P3)

Admin users and the super admin can access content management features to update website content (matches, team info, photos). Regular users cannot see or access content management areas. The super admin additionally has access to user management features that admin users cannot see.

**Why this priority**: Content management is the primary purpose of admin roles. This story ensures permissions are enforced correctly.

**Independent Test**: Log in as each role (regular user, admin, super admin) and verify that content management is only visible to admin and super admin, and user management is only visible to super admin.

**Acceptance Scenarios**:

1. **Given** a logged-in admin user, **When** they view the navigation, **Then** they see a link to the content management area.
2. **Given** a logged-in admin user, **When** they navigate to the content management area, **Then** they can view and edit website content.
3. **Given** a logged-in regular user, **When** they view the navigation, **Then** they do not see a link to the content management area.
4. **Given** a logged-in regular user, **When** they attempt to access the content management URL directly, **Then** they are redirected to their dashboard with an access denied message.
5. **Given** a logged-in admin user, **When** they attempt to access the user management URL directly, **Then** they are redirected with an access denied message (only super admin can access).
6. **Given** the super admin, **When** they view the navigation, **Then** they see links to both content management and user management.

---

### Edge Cases

- What happens when a user tries to register with an empty username or password? → The form validates input and shows inline error messages for each invalid field.
- What happens when the super admin account is accidentally deleted? → The super admin account cannot be deleted through the user management interface; it is a protected account.
- What happens when a user submits multiple admin requests? → Only one pending request is allowed per user; the request button is disabled while a request is pending.
- What happens when a user's session expires? → The user is redirected to the login page with a message indicating their session has expired.
- What happens when the super admin demotes an admin user? → The admin user's role reverts to regular user and they lose access to content management on their next page navigation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a registration form that accepts an email address, a unique username (identifier), and a password. An optional display name may be set later via profile editing.
- **FR-002**: System MUST validate that email addresses are valid, display usernames are unique, and passwords meet minimum strength requirements (at least 8 characters).
- **FR-003**: System MUST provide a login form that authenticates users by email and password (via Supabase Auth).
- **FR-004**: System MUST not reveal in error messages whether an email exists or not during login failure.
- **FR-005**: System MUST create a default super admin account via an automated Supabase database seed migration, with credentials (email, password) sourced from environment variables. The seed script MUST be idempotent (safe to re-run without duplicating the account).
- **FR-006**: System MUST assign a default football avatar to every newly registered user.
- **FR-007**: System MUST support three user roles: regular user, admin, and super admin.
- **FR-008**: System MUST allow logged-in regular users to submit a request for admin role promotion.
- **FR-009**: System MUST limit each user to one pending admin request at a time.
- **FR-010**: System MUST allow the super admin to view all pending admin role requests.
- **FR-011**: System MUST allow the super admin to approve or reject each pending admin request.
- **FR-012**: System MUST update the user's role to admin immediately upon approval.
- **FR-013**: System MUST allow the super admin to demote admin users back to regular users.
- **FR-014**: System MUST allow all logged-in users to edit their own profile (username and display name). Avatar customization is out of scope.
- **FR-015**: System MUST restrict content management access to admin and super admin users only, enforced at both the application layer (Next.js middleware for route protection) and the database layer (Supabase RLS policies).
- **FR-016**: System MUST restrict user management access to the super admin only, enforced at both the application layer (Next.js middleware) and the database layer (Supabase RLS policies).
- **FR-017**: System MUST protect the super admin account from deletion.
- **FR-018**: System MUST redirect unauthenticated users to the login page when they attempt to access protected routes.
- **FR-019**: System MUST use Supabase Auth for authentication; password hashing and session management are delegated to Supabase Auth. Plaintext passwords MUST never be stored or logged.
- **FR-020**: System MUST invalidate user sessions after 7 days of inactivity and redirect to the login page.
- **FR-021**: System MUST enforce Row-Level Security (RLS) policies on all Supabase Postgres tables containing user data, profiles, and admin requests, ensuring database-level access control independent of application code.

### Key Entities

- **User**: Represents an individual with access to the system. Supabase Auth manages authentication identity (email, hashed password, sessions). A linked profile row in Supabase Postgres stores: username (unique display name), role (regular/admin/super_admin), avatar (defaults to football avatar), profile information, creation date. Auth user ID is the foreign key.
- **Admin Request**: Represents a user's request for admin role promotion. Stored in Supabase Postgres. Key attributes: requesting user (FK to auth user), request status (pending/approved/rejected), submission date, resolution date, resolved by (super admin reference).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the registration process in under 1 minute.
- **SC-002**: Users can log in within 15 seconds of reaching the login page.
- **SC-003**: The super admin can process (approve or reject) an admin request in under 30 seconds.
- **SC-004**: 95% of users successfully register and log in on their first attempt without encountering confusing errors.
- **SC-005**: Unauthorized users cannot access restricted areas under any circumstances (100% access control enforcement).
- **SC-006**: All password-related data remains secure and is never exposed in any user-facing interface or logs.

## Assumptions

- The existing site already has a navigation structure (from the landing page feature) that can accommodate login/logout links.
- The super admin's initial credentials will be sourced from environment variables and provisioned via an automated Supabase seed migration. The seed is version-controlled but credentials are never committed to the repository.
- "Website content management" refers to managing matches, team information, and photos as defined by the existing landing page feature scope. Detailed content management UI is out of scope for this feature and will be addressed in a future feature.
- Profile editing is limited to display name and personal details; avatar customization (uploading a custom image) is out of scope for this feature — all users use the default football avatar.
- The system will use Supabase Auth for authentication and Supabase Postgres for storing user profiles, roles, and admin requests.
- Rate limiting on login attempts is out of scope for this feature. Supabase Auth provides built-in rate limiting for auth endpoints. Custom application-level rate limiting may be addressed in a future feature.
- All user-facing text will follow the existing Chinese (Simplified) language convention established in the landing page feature.
