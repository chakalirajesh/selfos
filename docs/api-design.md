# SelfOS REST API Design Specification

This document details the complete production-ready REST API design contract for **SelfOS**.

---

## Global API Standards

### Base URL

All API requests must be routed through the following base endpoint:

```
/api/v1

```

### Protocol & Data Format

* **Protocol:** HTTPS only
* **Format:** JSON Request/Response body format (`Content-Type: application/json`, `Accept: application/json`)
* **Authentication Scheme:** HTTP Bearer Token passed via the `Authorization` header (`Authorization: Bearer <JWT_ACCESS_TOKEN>`).

### Pagination, Sorting, and Filtering

All resource collection listings (collections returned as arrays) support standardized query properties to optimize memory usage and database querying efficiency:

* `page`: Zero-indexed page number (default: `0`)
* `size`: Number of records returned per page (default: `20`, maximum: `100`)
* `sort`: Sorting criteria using format `propertyName,direction` (e.g., `createdAt,desc` or `priority,asc`)
* **Filtering:** Handled via explicit request parameters (e.g., `?status=TODO&category=DevOps`) mapped into native Spring Data JPA Specifications.

### Standard & Validation Error Formats

When an operational exception or input validation constraint fails, the application returns a uniform error schema payload alongside standard HTTP status codes.

#### Standard Error Response Format (`401`, `403`, `404`, `500`)

```json
{
  "timestamp": "2026-06-04T06:15:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Task with ID f8c8d32a-514c-4235-908d-2a10cb39c711 was not found.",
  "path": "/api/v1/tasks/f8c8d32a-514c-4235-908d-2a10cb39c711"
}

```

#### Validation Error Response Format (`400 Bad Request`)

```json
{
  "timestamp": "2026-06-04T06:15:02Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for 2 fields.",
  "path": "/api/v1/auth/register",
  "errors": {
    "email": "Must be a well-formed email address.",
    "password": "Password must contain at least one digit and be at least 8 characters long."
  }
}

```

---

## 1. Authentication Module (`/auth`)

### Register

* **HTTP Method:** `POST`
* **Endpoint:** `/auth/register`
* **Description:** Provisions a new user account profile in the database.
* **Authentication Required:** No
* **Headers:** * `Content-Type: application/json`
* **Query Parameters:** None
* **Path Variables:** None
* **Validation Rules:**
* `fullName`: Required, length $2$–$100$ characters.
* `email`: Required, must pass RFC 5322 email regex verification. Unique across database context.
* `password`: Required, minimum 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 numeric digit.


* **Request Body Example:**

```json
{
  "fullName": "Alex Developer",
  "email": "alex@selfos.dev",
  "password": "StrongPassword123!"
}

```

* **Response Body Example:**

```json
{
  "userId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "email": "alex@selfos.dev",
  "role": "USER",
  "createdAt": "2026-06-04T06:15:00Z"
}

```

* **HTTP Status Codes:**
* `201 Created` — User created successfully.
* `400 Bad Request` — Input structural field validation failure or conflicting email address.



### Login

* **HTTP Method:** `POST`
* **Endpoint:** `/auth/login`
* **Description:** Validates client credentials against the stored secure crypt hash and generates a stateless Access JWT and a secure database-backed Refresh Token.
* **Authentication Required:** No
* **Headers:** `Content-Type: application/json`
* **Query Parameters:** None | **Path Variables:** None
* **Validation Rules:** `email` (valid format), `password` (cannot be blank).
* **Request Body Example:**

```json
{
  "email": "alex@selfos.dev",
  "password": "StrongPassword123!"
}

```

* **Response Body Example:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YjFkZWI0ZC0zYjdkLTRiYWQtOWJkZC0yYjBkN2IzZGNiNmQiLCJyb2xlcyI6WyJVU0VSIl0sImlhdCI6MTc4MDY0OTYwMCwiZXhwIjoxNzgwNjUzMjAwfQ...",
  "refreshToken": "cc8e3a24-11fa-4b8c-bc8f-d1a2f6b8909c",
  "tokenType": "Bearer",
  "expiresIn": 3600
}

```

* **HTTP Status Codes:**
* `200 OK` — Authentication successful.
* `401 Unauthorized` — Bad credentials provided.



### Refresh Token

* **HTTP Method:** `POST`
* **Endpoint:** `/auth/refresh`
* **Description:** Rotates existing tokens using a valid, non-expired refresh token value.
* **Authentication Required:** No
* **Headers:** `Content-Type: application/json`
* **Query Parameters / Path Variables:** None
* **Validation Rules:** `refreshToken` must be a valid UUID string format.
* **Request Body Example:**

```json
{
  "refreshToken": "cc8e3a24-11fa-4b8c-bc8f-d1a2f6b8909c"
}

```

* **Response Body Example:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "e4f8d29a-71bc-4993-8dfa-a92c3d4f551b",
  "tokenType": "Bearer",
  "expiresIn": 3600
}

```

* **HTTP Status Codes:** `200 OK`, `403 Forbidden` (Token expired/revoked)

### Logout

* **HTTP Method:** `POST`
* **Endpoint:** `/auth/logout`
* **Description:** Invalidates and drops the active refresh token session array from persistence.
* **Authentication Required:** Yes
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Query Parameters / Path Variables / Request Body:** None
* **Response Body Example:**

```json
{
  "message": "Successfully logged out and session token revoked."
}

```

* **HTTP Status Codes:** `200 OK`, `401 Unauthorized`

### Forgot Password

* **HTTP Method:** `POST`
* **Endpoint:** `/auth/forgot-password`
* **Description:** Dispatches a short-lived password reset email to a valid user address.
* **Authentication Required:** No
* **Headers:** `Content-Type: application/json`
* **Request Body Example:** `{"email": "alex@selfos.dev"}`
* **Response Body Example:** `{"message": "If the account exists, a password recovery link has been dispatched."}`
* **HTTP Status Codes:** `202 Accepted`, `400 Bad Request`

### Change Password

* **HTTP Method:** `POST`
* **Endpoint:** `/auth/change-password`
* **Description:** Replaces a user's password payload after validating their current password.
* **Authentication Required:** Yes
* **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
* **Validation Rules:** `newPassword` must fulfill standard structural password complexity conditions.
* **Request Body Example:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword456!"
}

```

* **Response Body Example:** `{"message": "Password updated successfully."}`
* **HTTP Status Codes:** `200 OK`, `400 Bad Request` (Bad old password or simple new password format), `401 Unauthorized`

---

## 2. Task Module (`/tasks`)

### Create Task

* **HTTP Method:** `POST` | **Endpoint:** `/tasks`
* **Description:** Creates a task mapped to the authenticated user context.
* **Authentication Required:** Yes
* **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
* **Validation Rules:**
* `title`: Mandatory, size max 255 chars.
* `priority`: Value inside enumeration `['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']`.
* `status`: Value inside enumeration `['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']`.


* **Request Body Example:**

```json
{
  "title": "Complete CI/CD Architecture Draft",
  "description": "Design clean deployment workflows for Kubernetes.",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2026-06-10T18:00:00Z",
  "category": "DevOps",
  "projectId": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
}

```

* **Response Body Example:**

```json
{
  "id": "f8c8d32a-514c-4235-908d-2a10cb39c711",
  "title": "Complete CI/CD Architecture Draft",
  "description": "Design clean deployment workflows for Kubernetes.",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2026-06-10T18:00:00Z",
  "category": "DevOps",
  "projectId": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "createdAt": "2026-06-04T11:00:00Z"
}

```

* **HTTP Status Codes:** `201 Created`, `400 Bad Request`, `401 Unauthorized`

### Update Task

* **HTTP Method:** `PUT` | **Endpoint:** `/tasks/{id}`
* **Description:** Completely updates an existing task object.
* **Authentication Required:** Yes
* **Headers:** Standard JSON + Security Authorization Bearer
* **Path Variables:** `id` (Valid UUIDv4 format matching a record owned by the user)
* **Request Body Example:**

```json
{
  "title": "Complete CI/CD Architecture Draft - Final",
  "description": "Design deployment workflows for Kubernetes with Helm integration.",
  "priority": "CRITICAL",
  "status": "IN_PROGRESS",
  "dueDate": "2026-06-12T12:00:00Z",
  "category": "DevOps",
  "projectId": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
}

```

* **Response Body Example:** Returns the updated task object structure with an updated `updatedAt` field.
* **HTTP Status Codes:** `200 OK`, `400`, `401`, `404 Not Found`

### Delete Task

* **HTTP Method:** `DELETE` | **Endpoint:** `/tasks/{id}`
* **Description:** Deletes a task by its UUID.
* **Authentication Required:** Yes
* **Path Variables:** `id` (UUID format)
* **Request Body / Response Body:** None
* **HTTP Status Codes:** `204 No Content`, `401`, `404`

### Get Task

* **HTTP Method:** `GET` | **Endpoint:** `/tasks/{id}`
* **Description:** Fetches structural details for a single task.
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID format)
* **Response Body Example:**

```json
{
  "id": "f8c8d32a-514c-4235-908d-2a10cb39c711",
  "title": "Complete CI/CD Architecture Draft - Final",
  "status": "IN_PROGRESS",
  "priority": "CRITICAL",
  "category": "DevOps",
  "projectId": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
}

```

* **HTTP Status Codes:** `200 OK`, `401`, `404`

### Search Task (Filtered Collection Lookup)

* **HTTP Method:** `GET` | **Endpoint:** `/tasks`
* **Description:** Returns a pageable list of tasks matching the specified search parameters.
* **Authentication Required:** Yes
* **Query Parameters:** `status`, `priority`, `category`, `page`, `size`, `sort`
* **Response Body Example:**

```json
{
  "content": [
    { "id": "f8c8d32a-514c-4235-908d-2a10cb39c711", "title": "Complete CI/CD Architecture Draft - Final", "status": "IN_PROGRESS" }
  ],
  "pageable": { "pageNumber": 0, "pageSize": 20 },
  "totalElements": 1,
  "totalPages": 1
}

```

* **HTTP Status Codes:** `200 OK`, `400`

---

## 3. Goal Module (`/goals`)

### Create Goal

* **HTTP Method:** `POST` | **Endpoint:** `/goals`
* **Authentication Required:** Yes | **Validation Rules:** `goalName` (required), `targetDate` must be a future date timestamp.
* **Request Body:** `{"goalName": "Become AWS Architect", "description": "Pass SAA-C03", "startDate": "2026-06-01T00:00:00Z", "targetDate": "2026-09-01T00:00:00Z"}`
* **Response Body:** `{"id": "e4026da4-fcda-4c40-9da2-1b12b59fa821", "goalName": "Become AWS Architect", "progressPercentage": 0, "status": "NOT_STARTED"}`
* **HTTP Status Codes:** `201 Created`, `400`

### Get Goals (List)

* **HTTP Method:** `GET` | **Endpoint:** `/goals`
* **Authentication Required:** Yes | **Query Parameters:** `status`, `page`, `size`, `sort`
* **Response Body:** Paged wrapper payload envelope enclosing `goals` array schemas.
* **HTTP Status Codes:** `200 OK`

### Get Goal

* **HTTP Method:** `GET` | **Endpoint:** `/goals/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID format)
* **Response Body:** Full representation of the single targeted Goal object configuration.
* **HTTP Status Codes:** `200 OK`, `404`

### Update Goal

* **HTTP Method:** `PUT` | **Endpoint:** `/goals/{id}`
* **Authentication Required:** Yes | **Validation Rules:** `progressPercentage` range $0$–$100$.
* **Request Body:** `{"goalName": "Become AWS Architect Pro", "description": "Pass SAP-C02", "startDate": "2026-06-01T00:00:00Z", "targetDate": "2026-12-31T00:00:00Z", "progressPercentage": 35, "status": "IN_PROGRESS"}`
* **Response Body:** Modified Goal payload output.
* **HTTP Status Codes:** `200 OK`, `400`, `404`

### Delete Goal

* **HTTP Method:** `DELETE` | **Endpoint:** `/goals/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID format)
* **Response Body:** None
* **HTTP Status Codes:** `204 No Content`, `404`

---

## 4. Habit Module & Logs (`/habits`)

### Create Habit

* **HTTP Method:** `POST` | **Endpoint:** `/habits`
* **Authentication Required:** Yes | **Validation Rules:** `targetFrequency` must match `DAILY` or `WEEKLY`.
* **Request Body:** `{"habitName": "LeetCode Daily", "category": "DSA", "targetFrequency": "DAILY"}`
* **Response Body:** `{"id": "a92d10cf-22b1-4c12-ba22-e3d17b4c6ef9", "habitName": "LeetCode Daily", "streakCount": 0, "completionRate": 0.00}`
* **HTTP Status Codes:** `201 Created`, `400`

### Get Habits

* **HTTP Method:** `GET` | **Endpoint:** `/habits`
* **Authentication Required:** Yes | **Query Parameters:** standard page properties
* **HTTP Status Codes:** `200 OK`

### Update Habit

* **HTTP Method:** `PUT` | **Endpoint:** `/habits/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **Request Body:** `{"habitName": "LeetCode Advanced focus", "category": "DSA", "targetFrequency": "DAILY"}`
* **HTTP Status Codes:** `200 OK`, `404`

### Delete Habit

* **HTTP Method:** `DELETE` | **Endpoint:** `/habits/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **HTTP Status Codes:** `204 No Content`, `404`

### Record Habit Log (Check-In Entry)

* **HTTP Method:** `POST` | **Endpoint:** `/habits/{id}/logs`
* **Description:** Logs a daily entry for a habit. The backend uses a database composite unique constraint to prevent duplicate logs for the same date.
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID format)
* **Validation Rules:** `date` must use standard format `YYYY-MM-DD`, `status` must be `COMPLETED` or `MISSED`.
* **Request Body Example:** `{"date": "2026-06-04", "status": "COMPLETED"}`
* **Response Body Example:**

```json
{
  "habitId": "a92d10cf-22b1-4c12-ba22-e3d17b4c6ef9",
  "date": "2026-06-04",
  "status": "COMPLETED",
  "newStreakCount": 6,
  "calculatedCompletionRate": 87.50
}

```

* **HTTP Status Codes:** * `200 OK` — Habit log recorded and streak calculations refreshed.
* `400 Bad Request` — Conflict: An entry has already been recorded for this habit on this date.
* `404 Not Found` — Habit not found.



---

## 5. Learning Tracker Module (`/learning/topics`)

### Create Learning Topic

* **HTTP Method:** `POST` | **Endpoint:** `/learning/topics`
* **Authentication Required:** Yes | **Validation Rules:** `category` must match standard values (`DevOps`, `Java`, `DSA`, `Cloud`, etc.).
* **Request Body:** `{"topicName": "Spring Filters", "category": "Java", "completionPercentage": 10, "hoursStudied": 2.5}`
* **Response Body:** `{"id": "7c9d1a3b-2810-410a-bd3c-8a12d4cf963b", "topicName": "Spring Filters", "hoursStudied": 2.5}`
* **HTTP Status Codes:** `201 Created`, `400`

### Get Learning Topics

* **HTTP Method:** `GET` | **Endpoint:** `/learning/topics`
* **Authentication Required:** Yes | **Query Parameters:** `category`, standard page values
* **HTTP Status Codes:** `200 OK`

### Update Learning Topic

* **HTTP Method:** `PUT` | **Endpoint:** `/learning/topics/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **Request Body:** `{"topicName": "Spring Filters", "category": "Java", "completionPercentage": 100, "hoursStudied": 8.0}`
* **HTTP Status Codes:** `200 OK`, `404`

### Delete Learning Topic

* **HTTP Method:** `DELETE` | **Endpoint:** `/learning/topics/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **HTTP Status Codes:** `204 No Content`, `404`

---

## 6. DevOps Roadmap Submodule (`/learning/roadmap`)

### Create Roadmap Node

* **HTTP Method:** `POST` | **Endpoint:** `/learning/roadmap`
* **Authentication Required:** Yes | **Validation Rules:** `topicName` must belong to the standard list (`Linux`, `Git`, `Docker`, `Kubernetes`, etc.).
* **Request Body:** `{"topicName": "Kubernetes", "progressPercentage": 0, "status": "NOT_STARTED"}`
* **HTTP Status Codes:** `201 Created`, `400`

### Get Roadmap Nodes

* **HTTP Method:** `GET` | **Endpoint:** `/learning/roadmap`
* **Authentication Required:** Yes
* **Response Body Example:**

```json
{
  "roadmap": [
    { "topicName": "Kubernetes", "progressPercentage": 40, "status": "IN_PROGRESS", "completionDate": null }
  ]
}

```

* **HTTP Status Codes:** `200 OK`

### Update Roadmap Node Progress

* **HTTP Method:** `PUT` | **Endpoint:** `/learning/roadmap/{topicName}`
* **Authentication Required:** Yes | **Path Variables:** `topicName` (String code value matching roadmap taxonomy)
* **Request Body:** `{"progressPercentage": 100, "status": "COMPLETED", "notes": "Understands Ingress configurations."}`
* **Response Body Example:** `{"topicName": "Kubernetes", "status": "COMPLETED", "completionDate": "2026-06-04T11:30:00Z"}`
* **HTTP Status Codes:** `200 OK`, `404`

### Delete Roadmap Node

* **HTTP Method:** `DELETE` | **Endpoint:** `/learning/roadmap/{topicName}`
* **Authentication Required:** Yes | **Path Variables:** `topicName`
* **HTTP Status Codes:** `204 No Content`, `404`

---

## 7. Notes Module (`/notes`)

### Create Note

* **HTTP Method:** `POST` | **Endpoint:** `/notes`
* **Authentication Required:** Yes | **Validation Rules:** `category` must match allowed list (`DevOps`, `Kubernetes`, `AWS`, etc.).
* **Request Body:** `{"title": "K8s Ingress", "category": "Kubernetes", "content": "Markdown text configuration notes."}`
* **Response Body:** `{"id": "bc3d5e2a-14fa-4d1a-ad3e-c6a7b8e9f012", "title": "K8s Ingress"}`
* **HTTP Status Codes:** `201 Created`, `400`

### Get Notes

* **HTTP Method:** `GET` | **Endpoint:** `/notes`
* **Authentication Required:** Yes | **Query Parameters:** `category`, `search` (text keywords)
* **HTTP Status Codes:** `200 OK`

### Update Note

* **HTTP Method:** `PUT` | **Endpoint:** `/notes/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **Request Body:** `{"title": "K8s Ingress v2", "category": "Kubernetes", "content": "Updated markdown payload text"}`
* **HTTP Status Codes:** `200 OK`, `404`

### Delete Note

* **HTTP Method:** `DELETE` | **Endpoint:** `/notes/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **HTTP Status Codes:** `204 No Content`, `404`

---

## 8. Projects Module (`/projects`)

### Create Project

* **HTTP Method:** `POST` | **Endpoint:** `/projects`
* **Authentication Required:** Yes | **Validation Rules:** `status` within allowed enum list (`PLANNED`, `ACTIVE`, `COMPLETED`, `ON_HOLD`).
* **Request Body:** `{"projectName": "SelfOS Deployment", "description": "EKS cloud setup", "startDate": "2026-06-01T00:00:00Z", "endDate": "2026-07-01T00:00:00Z", "status": "ACTIVE"}`
* **Response Body:** `{"id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d", "projectName": "SelfOS Deployment", "progress": 0}`
* **HTTP Status Codes:** `201 Created`, `400`

### Get Projects

* **HTTP Method:** `GET` | **Endpoint:** `/projects`
* **Authentication Required:** Yes | **Query Parameters:** `status`
* **HTTP Status Codes:** `200 OK`

### Update Project

* **HTTP Method:** `PUT` | **Endpoint:** `/projects/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **Request Body:** `{"projectName": "SelfOS Deployment", "description": "EKS cloud configurations", "startDate": "2026-06-01T00:00:00Z", "endDate": "2026-07-15T00:00:00Z", "progress": 35, "status": "ACTIVE"}`
* **HTTP Status Codes:** `200 OK`, `404`

### Delete Project

* **HTTP Method:** `DELETE` | **Endpoint:** `/projects/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **HTTP Status Codes:** `204 No Content`, `404`

---

## 9. Career Tracker Module (`/career/applications`)

### Create Career Entry

* **HTTP Method:** `POST` | **Endpoint:** `/career/applications`
* **Authentication Required:** Yes | **Validation Rules:** `status` matches `APPLIED`, `INTERVIEW`, `REJECTED`, `OFFERED`, or `HIRED`.
* **Request Body:** `{"companyName": "CloudTech", "position": "DevOps Engineer", "applicationDate": "2026-06-04T08:00:00Z", "status": "APPLIED"}`
* **Response Body:** `{"id": "d8e32c1a-4f5b-6c7d-8e9f-0a1b2c3d4e5f", "companyName": "CloudTech", "status": "APPLIED"}`
* **HTTP Status Codes:** `201 Created`, `400`

### Get Career Entries

* **HTTP Method:** `GET` | **Endpoint:** `/career/applications`
* **Authentication Required:** Yes | **Query Parameters:** `status`
* **HTTP Status Codes:** `200 OK`

### Update Career Entry

* **HTTP Method:** `PUT` | **Endpoint:** `/career/applications/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **Request Body:** `{"companyName": "CloudTech", "position": "DevOps Engineer", "applicationDate": "2026-06-04T08:00:00Z", "status": "INTERVIEW", "notes": "Technical screening phase."}`
* **HTTP Status Codes:** `200 OK`, `404`

### Delete Career Entry

* **HTTP Method:** `DELETE` | **Endpoint:** `/career/applications/{id}`
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **HTTP Status Codes:** `204 No Content`, `404`

---

## 10. Notification Subsystem (`/notifications`)

### Get Notifications

* **HTTP Method:** `GET` | **Endpoint:** `/notifications`
* **Description:** Retrieves system alerts generated for the current user context.
* **Authentication Required:** Yes
* **Query Parameters:** `unreadOnly` (boolean, optional)
* **Response Body Example:**

```json
{
  "notifications": [
    { "id": "314da12b-411a-4cce-bd21-f8a12d96bc8e", "message": "Task deadline alert.", "type": "IN_APP", "read": false }
  ]
}

```

* **HTTP Status Codes:** `200 OK`, `401`

### Mark Notification Read

* **HTTP Method:** `PATCH` | **Endpoint:** `/notifications/{id}/read`
* **Description:** Marks an unread notification alert as read.
* **Authentication Required:** Yes | **Path Variables:** `id` (UUID)
* **Request Body:** None
* **Response Body Example:** `{"id": "314da12b-411a-4cce-bd21-f8a12d96bc8e", "read": true}`
* **HTTP Status Codes:** `200 OK`, `404`

---

## 11. Dashboard Analytics Module (`/analytics`)

* **Execution Policy:** Read-only calculation endpoints. These endpoints calculate metrics on the fly from existing module repositories and do not modify underlying data states.

### Dashboard Summary

* **HTTP Method:** `GET` | **Endpoint:** `/analytics/dashboard`
* **Authentication Required:** Yes
* **Response Body Example:**

```json
{
  "totalTasks": 25,
  "completedTasks": 15,
  "pendingTasks": 10,
  "activeGoals": 2,
  "learningProgressPercentage": 64.5,
  "currentHabitStreak": 8,
  "habitCompletionRate": 88.2,
  "projectProgressPercentage": 35.0,
  "recentNotesCount": 5
}

```

* **HTTP Status Codes:** `200 OK`

### Productivity Score

* **HTTP Method:** `GET` | **Endpoint:** `/analytics/productivity-score`
* **Authentication Required:** Yes
* **Response Body:** `{"productivityScore": 84, "evaluationRange": "PAST_7_DAYS", "trend": "UPWARD"}`
* **HTTP Status Codes:** `200 OK`

### Learning Score

* **HTTP Method:** `GET` | **Endpoint:** `/analytics/learning-score`
* **Authentication Required:** Yes
* **Response Body:** `{"totalHoursTracked": 42.5, "roadmapCompletionPercentage": 38.2, "learningStreakDays": 5}`
* **HTTP Status Codes:** `200 OK`

### Goal Completion Rate

* **HTTP Method:** `GET` | **Endpoint:** `/analytics/goals-completion`
* **Authentication Required:** Yes
* **Response Body:** `{"totalGoalsTracked": 6, "completedCount": 2, "inProgressCount": 3, "overallGoalCompletionRate": 33.33}`
* **HTTP Status Codes:** `200 OK`

### Habit Completion Rate

* **HTTP Method:** `GET` | **Endpoint:** `/analytics/habits-completion`
* **Authentication Required:** Yes
* **Response Body:** `{"aggregateHabitCompletionRate": 85.75}`
* **HTTP Status Codes:** `200 OK`

---

## Appendix: OpenAPI/Swagger Documentation Examples

The following OpenAPI 3.0.3 YAML configuration snippet outlines the schema definitions for the `/tasks` endpoints. This configuration is fully compatible with standard UI parsers like `springdoc-openapi-ui`.

```yaml
openapi: 3.0.3
info:
  title: SelfOS Platform Core Engine API
  version: 1.0.0
  description: Production REST contract documentation specification layout for SelfOS modular monolith components.
paths:
  /api/v1/tasks:
    post:
      summary: Create a standalone task item
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TaskRequest'
      responses:
        '201':
          description: Task instantiated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
        '400':
          description: Validation or parameter constraints failed
        '401':
          description: Missing or invalid authentication token
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    TaskRequest:
      type: object
      required:
        - title
        - priority
        - status
      properties:
        title:
          type: string
          maxLength: 255
          example: Complete CI/CD Architecture Draft
        description:
          type: string
          example: Design clean deployment workflows for Kubernetes.
        priority:
          type: string
          enum: [LOW, MEDIUM, HIGH, CRITICAL]
          example: HIGH
        status:
          type: string
          enum: [TODO, IN_PROGRESS, COMPLETED, CANCELLED]
          example: TODO
        dueDate:
          type: string
          format: date-time
          example: "2026-06-10T18:00:00Z"
    TaskResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: f8c8d32a-514c-4235-908d-2a10cb39c711
        title:
          type: string
          example: Complete CI/CD Architecture Draft
        priority:
          type: string
          example: HIGH
        status:
          type: string
          example: TODO
        createdAt:
          type: string
          format: date-time
          example: "2026-06-04T11:00:00Z"

```
