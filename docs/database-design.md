# Database Design Specification (database-design.md)

This document contains the complete database design and architectural specification for **SelfOS**. The system is built as a **Modular Monolith** using **PostgreSQL 16**, ensuring strict data isolation between modules at the logical layer while maintaining deployment simplicity.

---

## 1. Database Overview

### Base Metadata

* **Database Name:** `selfos_db`
* **Database Engine:** PostgreSQL 16.x
* **Connection Pool:** HikariCP (Default Spring Boot 3 physical configuration)

### Naming Conventions

* **Tables & Columns:** Lowercase snake_case (e.g., `user_id`, `applied_date`).
* **Table Prefixes:** Every table name is prefixed with its core module identifier to isolate domains within the monolithic database schema:
* `auth_` : Authentication & Session Management
* `tsk_` : Tasks & To-Dos
* `gol_` : High-Level Targets
* `hab_` : Habit Loops & Streaks
* `lrn_` : Skill Acquirements
* `rdm_` : DevOps Tech-Tree Nodes
* `not_` : Markdown Documentation
* `prd_` : Parent Initiatives
* `car_` : Job Hunting Pipeline
* `sys_` : Notifications, Audits, & Cross-Cutting System Logs



### UUID Strategy

The platform uses universally unique identifiers (`UUIDv4`) across all primary keys. This ensures data protection by eliminating serial number tracking vulnerabilities on public APIs, while simplifies data synchronization or vertical database partitioning.

### Audit Columns Strategy

Every table tracks the full lifecycle of its records using a uniform audit structure. The system captures row adjustments via database triggers or Spring Data JPA's native `@CreatedBy` and `@LastModifiedBy` audit auditing frameworks.

---

## 2. Database Tables

### Module: Authentication (`auth_`)

#### Table: `auth_users`

* **Purpose:** Serves as the central security registry for identity management, access roles, and user profiles.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Unique ID generated via `gen_random_uuid()`. |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Legal name of user. |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | System login identifier. |
| `password_hash` | `VARCHAR(60)` | `NOT NULL` | BCrypt encrypted password string. |
| `role` | `VARCHAR(20)` | `NOT NULL`, `CHECK (role IN ('ADMIN', 'USER'))` | Authorization governance tier. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Time record was initiated. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Last update timestamp. |



#### Table: `auth_refresh_tokens`

* **Purpose:** Manages long-lived refresh tokens for secure JWT rotation.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Token identity key. |
| `user_id` | `UUID` | `NOT NULL`, `REFERENCES auth_users(id) ON DELETE CASCADE` | Link to user record. |
| `token` | `VARCHAR(512)` | `NOT NULL`, `UNIQUE` | Cryptographically signed token string. |
| `expiry_date` | `TIMESTAMPTZ` | `NOT NULL` | Token expiration date. |
| `revoked` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | True if explicitly revoked before expiration. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Generation time log. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Modification tracking. |



---

### Module: Task Management (`tsk_`)

#### Table: `tsk_tasks`

* **Purpose:** Stores granular items within a user's task pipeline.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Task identity key. |
| `user_id` | `UUID` | `NOT NULL` | Logical owner reference (`auth_users`). |
| `project_id` | `UUID` | `NULL` | Logical binding tag (`prd_projects`). |
| `title` | `VARCHAR(255)` | `NOT NULL` | Heading of the task summary. |
| `description` | `TEXT` | `NULL` | Context data details. |
| `priority` | `VARCHAR(20)` | `NOT NULL`, `CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))` | Task urgency ranking. |
| `status` | `VARCHAR(20)` | `NOT NULL`, `CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))` | Pipeline execution status. |
| `due_date` | `TIMESTAMPTZ` | `NULL` | Targeted task deadline. |
| `category` | `VARCHAR(50)` | `NULL` | Text grouping filter. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Track fields initialization. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Last update timestamp. |
| `created_by` | `UUID` | `NOT NULL` | Operator entity source tag. |
| `updated_by` | `UUID` | `NOT NULL` | Last modifying user tag. |



---

### Module: Goal Management (`gol_`)

#### Table: `gol_goals`

* **Purpose:** Tracks high-level overarching professional objectives.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Goal identity primary reference key. |
| `user_id` | `UUID` | `NOT NULL` | Target user account relationship ID. |
| `goal_name` | `VARCHAR(255)` | `NOT NULL` | Name of the objective. |
| `description` | `TEXT` | `NULL` | Core roadmap requirements list text. |
| `start_date` | `TIMESTAMPTZ` | `NOT NULL` | Execution phase activation point. |
| `target_date` | `TIMESTAMPTZ` | `NOT NULL` | Target deadline date. |
| `progress_percentage` | `INT` | `NOT NULL DEFAULT 0`, `CHECK (progress_percentage BETWEEN 0 AND 100)` | Progress metric ($0$ to $100$). |
| `status` | `VARCHAR(20)` | `NOT NULL`, `CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))` | High-level execution phase. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Track parameters metadata. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Modification lifecycle updates. |
| `created_by` | `UUID` | `NOT NULL` | Creating user context value. |
| `updated_by` | `UUID` | `NOT NULL` | Modifying user context value. |



---

### Module: Habit Tracking (`hab_`)

#### Table: `hab_habits`

* **Purpose:** Registers routine actions intended for daily or weekly tracking.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Habit identifier key. |
| `user_id` | `UUID` | `NOT NULL` | Target reference identity owner. |
| `habit_name` | `VARCHAR(100)` | `NOT NULL` | Description summary string. |
| `category` | `VARCHAR(50)` | `NULL` | Structural tag parameters context. |
| `target_frequency` | `VARCHAR(20)` | `NOT NULL`, `CHECK (target_frequency IN ('DAILY', 'WEEKLY'))` | Intended frequency schedule. |
| `streak_count` | `INT` | `NOT NULL DEFAULT 0`, `CHECK (streak_count >= 0)` | Active consecutive check-in total. |
| `completion_rate` | `NUMERIC(5,2)` | `NOT NULL DEFAULT 0.00`, `CHECK (completion_rate BETWEEN 0 AND 100)` | Calculated frequency compliance rate. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Audit field. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Audit field. |
| `created_by` | `UUID` | `NOT NULL` | Tracking metadata. |
| `updated_by` | `UUID` | `NOT NULL` | Tracking metadata. |



#### Table: `hab_habit_logs`

* **Purpose:** Logs individual performance entries for habit tracking.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Event reference row index key. |
| `habit_id` | `UUID` | `NOT NULL`, `REFERENCES hab_habits(id) ON DELETE CASCADE` | Underlying parent rule mapping link. |
| `log_date` | `DATE` | `NOT NULL` | target tracking evaluation day point. |
| `status` | `VARCHAR(20)` | `NOT NULL`, `CHECK (status IN ('COMPLETED', 'MISSED'))` | Metric verification status. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Tracking log field point. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Update log field point. |
| `created_by` | `UUID` | `NOT NULL` | Event logger authentication user. |
| `updated_by` | `UUID` | `NOT NULL` | Event logger authentication user. |



> **Constraint Rule:** A composite `UNIQUE(habit_id, log_date)` constraint is applied to prevent duplicate performance logs for the same day.

---

### Module: Learning Tracker (`lrn_`)

#### Table: `lrn_learning_topics`

* **Purpose:** Monitors specialized technical learning objectives and logged study hours.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Topic ID. |
| `user_id` | `UUID` | `NOT NULL` | User identifier link. |
| `topic_name` | `VARCHAR(255)` | `NOT NULL` | Core description (e.g., 'Spring Filters'). |
| `category` | `VARCHAR(50)` | `NOT NULL` | Grouping text tag (e.g., 'Java', 'DSA'). |
| `completion_percentage` | `INT` | `NOT NULL DEFAULT 0`, `CHECK (completion_percentage BETWEEN 0 AND 100)` | Track parameters checklist score. |
| `hours_studied` | `NUMERIC(6,2)` | `NOT NULL DEFAULT 0.00`, `CHECK (hours_studied >= 0.00)` | Aggregated tracking study hours duration. |
| `notes` | `TEXT` | `NULL` | General documentation context. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Standard audit baseline column. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Standard audit baseline column. |
| `created_by` | `UUID` | `NOT NULL` | Execution user reference tracking. |
| `updated_by` | `UUID` | `NOT NULL` | Execution user reference tracking. |



---

### Module: DevOps Roadmap (`rdm_`)

#### Table: `rdm_roadmap_topics`

* **Purpose:** Maps specific skills onto a static technical tree, indicating the user's progress.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Component tracking matrix node row key. |
| `user_id` | `UUID` | `NOT NULL` | Reference target validation context owner. |
| `topic_name` | `VARCHAR(100)` | `NOT NULL`, `CHECK (topic_name IN ('Linux','Git','Docker','Kubernetes','Helm','Jenkins','AWS','Terraform','Argo CD','Prometheus','Grafana'))` | Explicit item names within the tech tree. |
| `progress_percentage` | `INT` | `NOT NULL DEFAULT 0`, `CHECK (progress_percentage BETWEEN 0 AND 100)` | Learning progress checklist score. |
| `status` | `VARCHAR(20)` | `NOT NULL`, `CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))` | Mastery phase indicators tracking. |
| `completion_date` | `TIMESTAMPTZ` | `NULL` | Verified point when status reached completed. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Baseline timestamp tracing entry tracking. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Baseline timestamp tracing entry tracking. |



---

### Module: Notes Module (`not_`)

#### Table: `not_notes`

* **Purpose:** Stores rich markdown text artifacts generated across technical skill investigations.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Markdown text data container token key. |
| `user_id` | `UUID` | `NOT NULL` | Content author lookup target reference tag. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Index card search criteria header. |
| `category` | `VARCHAR(50)` | `NOT NULL` | Sorting folder filter context label. |
| `content` | `TEXT` | `NULL` | Base raw Markdown text data data payload logs. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Management validation entry metrics tracking. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Management validation entry metrics tracking. |
| `created_by` | `UUID` | `NOT NULL` | Base metadata signature validation tracking. |
| `updated_by` | `UUID` | `NOT NULL` | Base metadata signature validation tracking. |



---

### Module: Projects Tracker (`prd_`)

#### Table: `prd_projects`

* **Purpose:** Defines high-level tracking initiatives that unify separate workspace tasks.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Structural container master key. |
| `user_id` | `UUID` | `NOT NULL` | Reference target context authorization owner. |
| `project_name` | `VARCHAR(255)` | `NOT NULL` | Heading identifying the project initiative. |
| `description` | `TEXT` | `NULL` | Structural scope description text logs. |
| `start_date` | `TIMESTAMPTZ` | `NULL` | Scheduled initiation timestamp mapping. |
| `end_date` | `TIMESTAMPTZ` | `NULL` | Scheduled deadline parameter mapping. |
| `progress` | `INT` | `NOT NULL DEFAULT 0`, `CHECK (progress BETWEEN 0 AND 100)` | Aggregated task completion percentage metric. |
| `status` | `VARCHAR(20)` | `NOT NULL`, `CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'ON_HOLD'))` | Operational lifecycle tracking flags. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Base operational verification metadata tags. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Base operational verification metadata tags. |



---

### Module: Career Tracker (`car_`)

#### Table: `car_tracker`

* **Purpose:** Tracks job opportunities and interview steps throughout the hiring process.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Application pipeline track log row reference ID. |
| `user_id` | `UUID` | `NOT NULL` | Associated applicant context user account pointer. |
| `company_name` | `VARCHAR(150)` | `NOT NULL` | Enterprise entity name string. |
| `position` | `VARCHAR(150)` | `NOT NULL` | Target role listing description. |
| `application_date` | `TIMESTAMPTZ` | `NOT NULL` | Point when materials were submitted. |
| `status` | `VARCHAR(20)` | `NOT NULL`, `CHECK (status IN ('APPLIED', 'INTERVIEW', 'REJECTED', 'OFFERED', 'HIRED'))` | Application stage in the recruitment pipeline. |
| `notes` | `TEXT` | `NULL` | Follow-up logs or salary details. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Lifecycle auditing trace parameters. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Lifecycle auditing trace parameters. |



---

### Module: Cross-Cutting Subsystems (`sys_`)

#### Table: `sys_notifications`

* **Purpose:** Stores transient system alerts and reminders generated for user notification lists.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Alert reference identifier token key. |
| `user_id` | `UUID` | `NOT NULL` | Targeted recipient identity target pointer. |
| `message` | `TEXT` | `NOT NULL` | Alert content text logs strings data. |
| `type` | `VARCHAR(20)` | `NOT NULL`, `CHECK (type IN ('EMAIL', 'IN_APP'))` | Messaging delivery route framework tracking. |
| `read` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Flag tracking if the alert has been viewed. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Broadcast scheduling point log marker. |



#### Table: `sys_activity_logs`

* **Purpose:** High-integrity stream logging sensitive events and configuration updates for user audit history trails.
* **Columns & Constraints:**
| Column Name | Data Type | Constraints / Default Values | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | High integrity audit track stream transaction key. |
| `user_id` | `UUID` | `NULL` | Operational target identity reference parameter. |
| `action` | `VARCHAR(255)` | `NOT NULL` | Trace execution path signature description string. |
| `ip_address` | `VARCHAR(45)` | `NULL` | Networking source ingress identity tracker address. |
| `timestamp` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Execution completion metric time ledger marker. |



---

## 3. Relationships

Because SelfOS operates as a decoupled **Modular Monolith**, database schema consistency rules must respect domain boundaries. Foreign key references (`REFERENCES`) are only applied between tables **within the exact same module** or pointing back directly to the core user identity source (`auth_users`). Cross-module interactions are managed using logical data bindings at the application layer to keep data boundaries distinct.

```
+---------------------------------------------------------------------------------------+
| Single PostgreSQL Instance Storage Monolith System                                    |
|                                                                                       |
|  [Module: Authentication]                                                             |
|   auth_users <====== (Hard Database FK Constraint Cascaded) ======> auth_refresh_tokens|
|       ||                                                                              |
|       || 1:N Outbound References (Enforced strictly via application logic layer)      |
|       \/                                                                              |
|  +---------------------------+---------------------------+-------------------------+  |
|  | [Module: Tasks]           | [Module: Habits]          | [Module: Career]        |  |
|  |  tsk_tasks                |  hab_habits               |  car_tracker            |  |
|  |   ||                      |   ||                      |                         |  |
|  |   || (Logical App Link)   |   || (Hard DB FK Cascade) |                         |  |
|  |   \/                      |   \/                      |                         |  |
|  |  prd_projects             |  hab_habit_logs           |                         |  |
|  +---------------------------+---------------------------+-------------------------+  |
+---------------------------------------------------------------------------------------+

```

### One-to-One Relationships

* There are **no strict One-to-One relationships** implemented in this schema design. Profile records and identity objects are combined directly into the main `auth_users` table to maximize scan efficiency and avoid unnecessary table joins.

### One-to-Many Relationships

* `auth_users` $\rightarrow$ `auth_refresh_tokens` [Hard DB Foreign Key Constraint]
* `auth_users` $\rightarrow$ `tsk_tasks` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `gol_goals` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `hab_habits` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `lrn_learning_topics` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `rdm_roadmap_topics` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `not_notes` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `prd_projects` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `car_tracker` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `sys_notifications` [Logical Application-level Binding Rule]
* `auth_users` $\rightarrow$ `sys_activity_logs` [Logical Application-level Binding Rule, `ON DELETE SET NULL`]
* `hab_habits` $\rightarrow$ `hab_habit_logs` [Hard DB Foreign Key Constraint, `ON DELETE CASCADE`]

### Many-to-Many Relationships

* **Cross-cutting Junction Tables are intentionally avoided** in this relational specification. Inter-module relationships—such as connecting a task to a project—are tracked using simple nullable structural ID strings (`project_id`) inside the downstream records. These are resolved dynamically by application components using high-speed index scans.

---

## 4. Primary Keys

All primary keys use uniform **UUID** data structures.

| Target Database Entity Table Name | Assigned PK Column Name | Key Ingress Engine Strategy Configuration Rule |
| --- | --- | --- |
| `auth_users` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `auth_refresh_tokens` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `tsk_tasks` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `gol_goals` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `hab_habits` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `hab_habit_logs` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `lrn_learning_topics` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `rdm_roadmap_topics` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `not_notes` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `prd_projects` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `car_tracker` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `sys_notifications` | `id` | Generated via `gen_random_uuid()` standard defaults |
| `sys_activity_logs` | `id` | Generated via `gen_random_uuid()` standard defaults |

---

## 5. Foreign Keys

The following table lists the relational rules applied across tables to maintain reference integrity within specific storage schemas.

| Source Origin Table | Target Column | Destination Reference Mapping Target | Structural Deletion Policy Rule |
| --- | --- | --- | --- |
| `auth_refresh_tokens` | `user_id` | `auth_users(id)` | `ON DELETE CASCADE` |
| `hab_habit_logs` | `habit_id` | `hab_habits(id)` | `ON DELETE CASCADE` |
| `sys_activity_logs` | `user_id` | `auth_users(id)` | `ON DELETE SET NULL` |

---

## 6. Constraints

### NOT NULL Constraints

Enforced across all required transactional field sets (e.g., entity titles, authentication passwords, data hashes, status string definitions, and default audit fields).

### UNIQUE Constraints

* `auth_users(email)` : Prevents duplicate registration records.
* `auth_refresh_tokens(token)` : Ensures access refresh keys remain unique across active sessions.
* `hab_habit_logs(habit_id, log_date)` : Enforces single daily check-ins for a given habit tracker.

### CHECK Constraints

Ensures structural fields are strictly bounded, preventing invalid or out-of-range updates from reaching database storage rows:

* `auth_users` $\rightarrow$ `CHECK (role IN ('ADMIN', 'USER'))`
* `tsk_tasks` $\rightarrow$ `CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))`
* `tsk_tasks` $\rightarrow$ `CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))`
* `gol_goals` $\rightarrow$ `CHECK (progress_percentage BETWEEN 0 AND 100)`
* `gol_goals` $\rightarrow$ `CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))`
* `hab_habits` $\rightarrow$ `CHECK (target_frequency IN ('DAILY', 'WEEKLY'))`
* `hab_habit_logs` $\rightarrow$ `CHECK (status IN ('COMPLETED', 'MISSED'))`
* `lrn_learning_topics` $\rightarrow$ `CHECK (completion_percentage BETWEEN 0 AND 100)`
* `rdm_roadmap_topics` $\rightarrow$ `CHECK (topic_name IN ('Linux','Git','Docker','Kubernetes','Helm','Jenkins','AWS','Terraform','Argo CD','Prometheus','Grafana'))`
* `rdm_roadmap_topics` $\rightarrow$ `CHECK (progress_percentage BETWEEN 0 AND 100)`
* `rdm_roadmap_topics` $\rightarrow$ `CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))`
* `prd_projects` $\rightarrow$ `CHECK (progress BETWEEN 0 AND 100)`
* `prd_projects` $\rightarrow$ `CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'ON_HOLD'))`
* `car_tracker` $\rightarrow$ `CHECK (status IN ('APPLIED', 'INTERVIEW', 'REJECTED', 'OFFERED', 'HIRED'))`
* `sys_notifications` $\rightarrow$ `CHECK (type IN ('EMAIL', 'IN_APP'))`

### Default Values

* Standard audit timestamps map automatically to execution times using `DEFAULT NOW()`.
* Progress trackers, sequence metrics, and score totals default safely to `0` or `0.00`.
* Flag configurations default to `FALSE` (e.g., `revoked` in token records, `read` in system notifications).

---

## 7. Indexing Strategy

SelfOS uses custom relational database index maps to keep queries fast, preventing full table scans as the size of user data sets grows.

### Search Indexes (B-Tree lookups)

* `idx_auth_users_email` $\rightarrow$ ON `auth_users(email)` : Speeds up credential verification routing.
* `idx_auth_tokens_hash` $\rightarrow$ ON `auth_refresh_tokens(token)` : Ensures rapid token lookups during rotation requests.

### Composite Indexes (Multi-column groupings)

* `idx_tsk_user_status` $\rightarrow$ ON `tsk_tasks(user_id, status)` : Speeds up workspace dashboard queries by quickly locating incomplete tasks for a user.
* `idx_gol_user_status` $\rightarrow$ ON `gol_goals(user_id, status)` : Accelerates milestone filtering on the main user dashboard.
* `idx_hab_logs_composite` $\rightarrow$ ON `hab_habit_logs(habit_id, log_date)` : Boosts performance for heat-map rendering engines tracking habit consistency.
* `idx_not_user_cat` $\rightarrow$ ON `not_notes(user_id, category)` : Optimizes note searches within specific organization folders.

### Performance Optimization Indexes

* `idx_tsk_due_date` $\rightarrow$ ON `tsk_tasks(due_date) WHERE status != 'COMPLETED'` : A partial index that isolates near-term deadlines, optimizing background notification workers while ignoring finished tasks.

---

## 8. UUID Strategy

### Why UUID is used

Using continuous auto-incrementing integers (`BIGINT`) exposes systems to resource enumeration attacks, allowing users to infer system velocity or guess object locations simply by changing ID values in public API endpoints. Using UUID values completely decouples identity parameters from object positioning, providing clean spatial isolation across the architecture.

### UUID Version

The architecture standardizes on **UUID Version 4 (Randomly Generated)**. It relies on the strong pseudo-random number generator algorithms built directly into PostgreSQL 16 to avoid hash collision issues.

### Generation Strategy

Row identity initialization is offloaded directly to the storage cluster configuration layout. By assigning default field initializations to native random token generation syntax (`DEFAULT gen_random_uuid()`), data rows can be safely inserted by clean domain layers without waiting for pre-calculated identity returns from remote storage nodes.

---

## 9. Audit Fields

To provide clear traceability and historical auditing across row states, every transactional business entity includes a standard, non-nullable audit block.

### Column Specification Contract

* `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()` — Keeps an immutable timestamp recording the exact system entry moment.
* `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()` — Tracks modifications, updating automatically via internal database store triggers during changes.
* `created_by`: `UUID NOT NULL` — Records the authenticated user context signature that initiated the item.
* `updated_by`: `UUID NOT NULL` — Identifies the last authenticated user context signature that altered the data state.

---

## 10. ER Diagram

The following Mermaid diagram maps out the relational topology of SelfOS, demonstrating how module structures are isolated while referencing the core identity model.

```mermaid
erDiagram
    auth_users {
        UUID id PK
        VARCHAR full_name
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR role
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    auth_refresh_tokens {
        UUID id PK
        UUID user_id FK
        VARCHAR token UK
        TIMESTAMPTZ expiry_date
        BOOLEAN revoked
        TIMESTAMPTZ created_at
    }

    tsk_tasks {
        UUID id PK
        UUID user_id
        UUID project_id
        VARCHAR title
        TEXT description
        VARCHAR priority
        VARCHAR status
        TIMESTAMPTZ due_date
        VARCHAR category
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    gol_goals {
        UUID id PK
        UUID user_id
        VARCHAR goal_name
        TEXT description
        TIMESTAMPTZ start_date
        TIMESTAMPTZ target_date
        INT progress_percentage
        VARCHAR status
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    hab_habits {
        UUID id PK
        UUID user_id
        VARCHAR habit_name
        VARCHAR category
        VARCHAR target_frequency
        INT streak_count
        NUMERIC completion_rate
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    hab_habit_logs {
        UUID id PK
        UUID habit_id FK
        DATE log_date
        VARCHAR status
        TIMESTAMPTZ created_at
    }

    lrn_learning_topics {
        UUID id PK
        UUID user_id
        VARCHAR topic_name
        VARCHAR category
        INT completion_percentage
        NUMERIC hours_studied
        TEXT notes
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    not_notes {
        UUID id PK
        UUID user_id
        VARCHAR title
        VARCHAR category
        TEXT content
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    prd_projects {
        UUID id PK
        UUID user_id
        VARCHAR project_name
        TEXT description
        TIMESTAMPTZ start_date
        TIMESTAMPTZ end_date
        INT progress
        VARCHAR status
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    car_tracker {
        UUID id PK
        UUID user_id
        VARCHAR company_name
        VARCHAR position
        TIMESTAMPTZ application_date
        VARCHAR status
        TEXT notes
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    sys_notifications {
        UUID id PK
        UUID user_id
        TEXT message
        VARCHAR type
        BOOLEAN read
        TIMESTAMPTZ created_at
    }

    sys_activity_logs {
        UUID id PK
        UUID user_id FK
        VARCHAR action
        VARCHAR ip_address
        TIMESTAMPTZ timestamp
    }

    %% Concrete Database Constraints
    auth_users ||--oN auth_refresh_tokens : "has sessions"
    hab_habits ||--oN hab_habit_logs : "tracks execution history"
    auth_users ||--oN sys_activity_logs : "records event logs"

```

---

## 11. Database Security

### Encryption Strategy

* **Data in Transit:** Enforced globally using TLS 1.3 protocol definitions across all external application-to-database connections. This stops network sniffing and man-in-the-middle attacks within the cluster network.
* **Data at Rest:** Leverages AWS EBS encrypted volume configurations (or matching block-level system store configurations using standard AES-256 validation engines) to secure data on disk.

### Password Storage

User authentication parameters are never preserved inside raw cleartext formats. The architecture processes security passwords using strong **BCrypt** key derivation functions, configured with an algorithmic work factor cost rating of **$12$** rounds. The resulting cryptographic outputs are saved as structured 60-character hash entries inside the `auth_users(password_hash)` column.

### Sensitive Data Handling

Any configuration variables or credentials (such as external API tokens used by connection adapters) are injected into the container runtime dynamically using secure Kubernetes Secret abstractions. This avoids saving configuration details directly inside plain configuration text blocks or raw database cells.

---

## 12. Scaling Considerations

### Partitioning Strategy

Because the architecture uses module prefixes on tables within a single database instance, it can easily scale up as data volume increases. If a specific module faces heavy write loads, its prefixed tables (e.g., `hab_habits` and `hab_habit_logs`) can be cleanly extracted and migrated onto a dedicated database instance with minimal impact on application logic.

### Backup Strategy

* **Continuous Transaction Logging:** Real-time Write-Ahead Logging (WAL) configuration streams records directly to secure, off-site cloud storage targets.
* **Automated Daily Backups:** The system takes full, automated snapshot backups every 24 hours during low-traffic windows. Backups are kept for 30 days to meet compliance and point-in-time recovery requirements.

### Read Replica Strategy

To scale out read operations, the system can deploy identical, read-only database replicas behind a write-through master node. Read queries—such as high-volume analytics reports generated by the Dashboard module—are routed to replica nodes via a connection manager. Write operations are routed directly to the primary master instance to ensure strong consistency.
