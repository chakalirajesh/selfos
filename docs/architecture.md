## 1. High-Level Architecture (HLA)

SelfOS is designed as an enterprise-grade, **Modular Monolith** applying **Clean Architecture** patterns. The system relies on strict compile-time validation boundaries to ensure that domain components remain isolated, while maintaining a unified delivery runtime via a single deployment condtion>
```
  +-----------------------------------------------------------------------------------+
  |                                Presentation Layer                                 |
  |   [Controllers] -- (Request Filtering / Response DTO Mapping / `@Valid` Guard)   |
  +-----------------------------------------------------------------------------------+
                                            |
                                            | (Executes Domain Use Cases)
                                            v
  +-----------------------------------------------------------------------------------+
  |                             Domain & Use-Case Layer                               |
  |     [Use Cases / Interactors] <=====================> [Domain Model Entities]     |
  +-----------------------------------------------------------------------------------+
                                            |
                                            | (Implements Storage/Infrastructure Ports)
                                            v
  +-----------------------------------------------------------------------------------+
  |                            Infrastructure & Data Layer                            |
  |   [Spring Data JPA Repositories]   [Spring Security / JWT]   [Actuator Engine]    |
  +-----------------------------------------------------------------------------------+
                                            |
                                            | (Transactional Queries / WAL Writes)
                                            v
  +-----------------------------------------------------------------------------------+
  |                             PostgreSQL Database Instance                          |
  +-----------------------------------------------------------------------------------+
```


### Core Architecture Controls

* **Dependency Rule:** All dependency arrows point inward. The **Domain Layer** is entirely independent and possesses zero awareness of persistence infrastructure, HTTP constructs, or Spring frameworks.
* **Communication Interface:** Cross-module dependency is resolved exclusively via **Application Service Boundaries**. Modules bypass internal domain layers of neighbor packages by querying exposed interfaces, preventing structural coupling.

---

## 2. Low-Level Architecture (LLA)

The internal module architecture organizes operational tasks into specialized functional roles, implementing explicit abstractions for inbound processing pipelines and outbound persistence actions.

```
       [ Client Request / HTTP REST ]
                     |
                     v
+--------------------|----------------------------------------------------------+
| INBOUND ADAPTER    v                                                          |
|               [ RestController ]                                              |
|                      |                                                        |
|                      v (Converts Request to Payload DTO)                      |
|               [ Inbound Port / Use Case Interface ]                           |
+----------------------|--------------------------------------------------------+
                       |
                       v
+----------------------|--------------------------------------------------------+
| CORE APPLICATION     v                                                        |
|               [ Use Case Interactor / Implementation ]                        |
|                      |                                                        |
|                      +---> [ Domain Logic / State Changes ]                   |
|                      |                                                        |
|                      v (Invokes Framework Agnostic Contract)                  |
|               [ Outbound Port / Repository Interface ]                        |
+----------------------|--------------------------------------------------------+
                       |
                       v
+----------------------|--------------------------------------------------------+
| OUTBOUND ADAPTER     v                                                        |
|               [ Spring Data JPA Repository Implementation ]                    |
|                      |                                                        |
|                      v (Converts Domain Model to Database Entity Mapping)      |
|               [ Relational Postgres Entity Row / JPA ]                        |
+----------------------|--------------------------------------------------------+
                       |
                       v
            [ PostgreSQL Instance ]

```

### Decoupled Data Pipelines

1. **Inbound Path:** The controller converts HTTP payloads into system-native DTO instances. It enforces validation limits using structural validation patterns (`@NotNull`, `@Size`, `@Min`).
2. **Core Context Path:** The application use case interacts with infrastructure layer tools via pure interfaces (Inversion of Control).
3. **Outbound Path:** Data adapters convert internal domain states into database entity objects, modifying persistence records inside transactional blocks (`@Transactional`).

---

## 3. Architectural Blueprint

The platform architecture isolates external runtime dependencies from the core system configuration components.

```
                 +-------------------+
                 | React Frontend SPA|
                 +---------+---------+
                           | HTTP / TLS (Bearer JWT)
                           v
+-------------------------------------------------------------+
|               SelfOS Service Infrastructure                 |
|                                                             |
| +---------------------------------------------------------+ |
| | Spring Security Filter Chain                            | |
| | - JWT Validation Interceptor  - Rate Limiter Middleware | |
| +---------------------------------------------------------+ |
|                              |                              |
|                              v System Internal Route Dispatch
| +---------------------------------------------------------+ |
| | Monolithic Core Router                                  | |
| | - Request Context Mappings                              | |
| +---------------------------------------------------------+ |
|                              |                              |
|         +--------------------+--------------------+         |
|         |                    |                    |         |
|         v                    v                    v         |
|  [Auth Module]       [Tasks Module]      [Analytics Module] |
|         |                    |                    |         |
|         +--------------------+--------------------+         |
|                              |                              |
|                              v Hikari Connection Pool       |
| +---------------------------------------------------------+ |
| | Database Ingress Abstraction                            | |
| | - Spring Data JPA Core Layer  - Spring Actuator Engine  | |
| +---------------------------------------------------------+ |
+------------------------------|------------------------------+
                               |
                               v TCP Connection / Port 5432
                 +-------------------+
                 | PostgreSQL Server |
                 +-------------------+

```

### Component Details

* **Spring Security & Filter Pipeline:** Validates stateless incoming tokens (`Authorization: Bearer <JWT>`), populates the `SecurityContextHolder`, and drops unauthorized traffic before it reaches downstream modules.
* **Hikari Connection Pool Engine:** Controls persistent connections to the database layer, protecting transactional performance levels from volume spikes.

---

## 4. Modular Monolith Design

To prevent the application from degrading into a tightly coupled codebase, the platform structure segregates logic into distinct, self-contained functional scopes.

### Cross-Module Communication Contract

Direct dependency manipulation on foreign domain databases is strictly prohibited. Instead, the architecture establishes a system of **Exposed Shared Interfaces**.

```
+--------------------------+                 +--------------------------+
|       Tasks Module       |                 |     Analytics Module     |
|                          |                 |                          |
|  [InternalTasksQuery] <==|=================|=> [AnalyticsUseCase]     |
|         ^                |  Invokes Method |                          |
|         | Implements     |                 +--------------------------+
|  [TasksQueryService]     |
|         |                |
|         v                |
|  [TasksRepository]       |
+--------------------------+

```

### Module Boundary Enforcement Checklist

* **Zero Cross-Module DB Joins:** Databases elements are partitioned using clear module-specific table prefixes (`auth_`, `tsk_`, `gol_`). Joining entities directly across domains via ORM annotations (e.g., `@ManyToOne` referencing another module's entity) is structural violations.
* **Data Context Splitting:** When the Analytics module processes productivity data, it calls the `InternalTasksQuery` interface to fetch data in a primitive, read-only format rather than directly instantiating entity classes from the Tasks domain.

---

## 5. Clean Architecture Design

Every feature module uses an internal layered architecture that isolates business rules from underlying software development frameworks.

```
+-----------------------------------------------------------------------------+
| [Outer Layer] INFRASTRUCTURE / PRESENTATION                                 |
| - Rest Controllers    - JPA Mapping Rows   - Spring Specific Configs        |
|                                                                             |
|       +--------------------------------------------------------------+      |
|       | [Middle Layer] APPLICATION USE CASES                         |      |
|       | - Interaction Boundaries  - Request Validation Mappings       |      |
|       |                                                              |      |
|       |       +-----------------------------------------------+      |      |
|       |       | [Inner Core] PURE DOMAIN LAYER                |      |      |
|       |       | - Enterprise Business Rules - Domain Objects  |      |      |
|       |       +-----------------------------------------------+      |      |
|       +--------------------------------------------------------------+      |
+-----------------------------------------------------------------------------+

```

### Core Separation Details

1. **Pure Domain Core (Inner Layer):** Contains raw data structures and localized validation patterns. It has no library dependencies and does not include framework annotations (`@Entity`, `@Service`, `@Autowired`).
2. **Application Use Cases (Middle Layer):** Standardizes application interactions by defining execution parameters. It maps business operational actions into domain-specific functional methods.
3. **Infrastructure & Interfaces (Outer Layer):** Houses database connection configurations, serialization behaviors, and frameworks adapters.

---

## 6. Module Boundaries

The logical boundaries of the application map cleanly to the 9 core functional scopes requested in the product requirements specification:

| Module Identifier | Database Prefix | System Domain Boundary Responsibilities |
| --- | --- | --- |
| **Authentication** | `auth_` | Handles identity validations, cryptographic hashing, profile metadata records, and JWT lifecycle states. |
| **Tasks** | `tsk_` | Tracks granular productivity items, managing priority categories and workflow states. |
| **Goals** | `gol_` | Manages target objects and tracks high-level execution timelines. |
| **Habits** | `hab_` | Monitors behavioral consistency using high-frequency log trackers and streak counters. |
| **Learning** | `lrn_` | Manages technical upskilling progress indices and study hour allocations. |
| **Roadmap** | `rdm_` | Controls progression indices for technical domain nodes (e.g., Linux, Git, Docker, AWS). |
| **Notes** | `not_` | Manages personal documentation and reference knowledge assets. |
| **Projects** | `prd_` | Organizes complex project initiatives into structured milestone trackers. |
| **Career** | `car_` | Tracks professional milestones, job applications, resumes, and interview records. |
| **Analytics** | N/A | Aggregates read-only summary data vectors across modules to construct performance metrics. |

---

## 7. Complete Folder Structure

Below is the clean architecture project structure for the SelfOS application.

```
com.selfos/
├── SelfOsApplication.java               # Unified Monolithic Boot Entrypoint
│
├── config/                              # Cross-Cutting Infrastructure Configuration
│   ├── SecurityConfiguration.java       # Spring Security & Filters Configuration
│   └── DatabaseConfiguration.java       # Connection Pooling & Dialect Parameters
│
├── exception/                           # Application-wide Exception Hierarchy
│   ├── GlobalExceptionTranslator.java   # REST Controller Advice for Error Mappings
│   └── BusinessException.java           # Base Architecture Exception Core
│
├── util/                                # Framework Agnostic Shared Helpers
│   └── CryptoUtils.java                 
│
└── modules/                             # Structured Domain Packages
    ├── auth/                            # Authentication Domain Module
    │   ├── controller/                  # Presentation Layer Adapters (Inbound)
    │   │   ├── AuthController.java
    │   │   └── ProfileController.java
    │   ├── dto/                         # Input/Output Request Representation Entities
    │   │   ├── LoginRequest.java
    │   │   └── TokenResponse.java
    │   ├── service/                     # Application Use Case Components
    │   │   ├── LoginUserInteractor.java
    │   │   └── RegisterUserInteractor.java
    │   ├── repository/                  # Infrastructure Data Persistence (Outbound)
    │   │   ├── UserJpaRepository.java
    │   │   └── UserPersistenceAdapter.java
    │   ├── entity/                      # Relational Postgres Schema Definitions
    │   │   └── UserDatabaseEntity.java
    │   └── security/                    # Token Extraction and Cryptography Engines
    │       ├── JwtTokenProvider.java
    │       └── BCryptPasswordEncoder.java
    │
    ├── tasks/                           # Tasks Module (Matches Clean Pattern)
    │   ├── controller/                  # Tasks REST Controllers
    │   ├── dto/                         # Task Payload Contracts
    │   ├── service/                     # Task Operational Execution Use Cases
    │   ├── repository/                  # Task DB Adapters
    │   └── entity/                      # Task Table Schema Rows
    │
    ├── goals/                           # Goals Domain Boundary
    ├── habits/                          # Habit Tracking Module Ecosystem
    ├── learning/                        # Upskilling Analytics Tracker
    ├── roadmap/                         # DevOps Target Tracker Core
    ├── notes/                           # Information Management System
    ├── projects/                        # Initiative Allocation Subsystem
    ├── career/                          # Professional Vector Tracker
    │
    └── analytics/                       # Reporting Module Context Boundary
        ├── controller/
        │   └── AnalyticsDashboardController.java
        ├── dto/
        │   └── PerformanceSummaryDto.java
        └── service/
            └── AggregationDashboardInteractor.java # Queries other modules via Internal APIs

```
