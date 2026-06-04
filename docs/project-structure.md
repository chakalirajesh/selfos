# Project Structure Specification (project-structure.md)

This document details the standardized multi-module directory tree, architecture mappings, and dependency configuration profiles for **SelfOS**. The blueprint implements a high-cohesion, low-coupling **Modular Monolith** using **Clean Architecture** patterns and **Domain-Driven Design (DDD)** concepts inside a modern **Spring Boot 3** ecosystem.

---

## 1. Root Folder Structure

The root directory maintains clear separation between infrastructure-as-code configuration clusters, system documentation blueprints, frontend user interfaces, and the core Spring Boot application service layer.

```text
selfos/
├── .github/
│   └── workflows/              # GitHub Actions declarative pipeline files
├── backend/
│   ├── src/                    # Spring Boot java source code root
│   ├── .gitignore              # Backend-specific version control exclusions
│   ├── mvnw                    # Maven wrapper script for Unix
│   ├── mvnw.cmd                # Maven wrapper script for Windows
│   └── pom.xml                 # Master Maven dependency blueprint
├── frontend/
│   ├── public/                 # Static asset delivery directory
│   ├── src/                    # Single-Page Application (SPA) source components
│   ├── package.json            # Node runtime dependencies configuration
│   └── README.md               # Frontend developer setup guide
├── database/
│   ├── migrations/             # Database tracking lifecycle scripts (Flyway/Liquibase)
│   └── schema.sql              # Physical schema script baseline definition
├── docs/
│   ├── architecture.md         # Multi-module decoupling matrix blueprint
│   ├── database-design.md      # Relational storage specification index
│   ├── api-design.md           # REST OpenAPI structural payload registry
│   └── development-roadmap.md  # Milestones and release phase definitions
├── docker/
│   ├── app.Dockerfile          # Production multi-stage JVM compilation file
│   └── docker-compose.yml      # Multi-container operational development profile
├── kubernetes/
│   ├── base/                   # Static vanilla orchestration manifests
│   └── overlays/               # Environment target transformation parameters
├── helm/
│   └── selfos-chart/           # Dynamic release templating ecosystem directory
├── jenkins/
│   └── Jenkinsfile             # Imperative build pipeline automation file
└── monitoring/
    ├── prometheus.yml          # Scraper timing settings metric configurations
    └── grafana/
        └── dashboards/         # Telemetry presentation layout JSON blocks

```

---

## 2. Backend Folder Structure

The Spring Boot backend architecture centralizes global infrastructure blocks under the core package context, routing all transactional domain activity through bounded module zones.

```text
backend/src/main/java/com/selfos/
├── core/
│   ├── config/                 # Platform infrastructure wiring components
│   ├── security/               # Ingress filters and authentication mechanics
│   ├── exception/              # Global system error resolution interceptors
│   ├── common/                 # Base generic interfaces and tracking abstractions
│   └── util/                   # Pure stateless helper calculations
└── modules/
    ├── auth/                   # Identity registration and lifecycle container
    ├── tasks/                  # Task pipelines execution context
    ├── goals/                  # Strategic objectives tracking data mapping
    ├── habits/                 # Habit tracker behavioral performance monitoring
    ├── learning/               # Skill acquisition metrics compilation
    ├── roadmap/                # Technical DevOps roadmap tree nodes
    ├── notes/                  # Personal documentation markdown store
    ├── projects/               # High-level container project mappings
    ├── career/                 # Recruitment tracking pipeline context
    ├── notifications/          # Multiplexed real-time transactional alert engine
    └── analytics/              # Read-only performance score calculator

```

---

## 3. Module Structure

Every business domain block housed within the `modules/` package context functions as an isolated unit, encapsulating its unique operational models and entrypoints to support independent lifecycle development.

```text
com/selfos/modules/[module_name]/
├── controller/
│   └── [Module]Controller.java      # Handles inbound REST requests and responses
├── service/
│   ├── [Module]Service.java         # Defines functional interface behavior
│   └── impl/
│       └── [Module]ServiceImpl.java # Implements transactional business rules
├── repository/
│   └── [Module]Repository.java      # Interacts with Spring Data JPA database pools
├── entity/
│   └── [Module]Entity.java          # Maps internal relational storage database rows
├── dto/
│   ├── [Module]Request.java         # Validates incoming endpoint data structures
│   └── [Module]Response.java        # Structures outgoing network data payloads
└── mapper/
    └── [Module]Mapper.java          # Handles translation logic between entities and DTOs

```

---

## 4. Clean Architecture Mapping

SelfOS maps its core features across four logical software layers. This strict data flow separation safeguards the business domain from external framework or infrastructure shifts.

### Controller Layer (Interface Adapters)

* **Role:** Exposes RESTful HTTP endpoints, enforces API validation constraints, and maps protocol statuses.
* **Flow:** Directs incoming network request payloads into localized request DTO models, triggers the targeted service interface method, and presents output data via response DTOs.

### Service Layer (Application Business Logic)

* **Role:** Coordinates transactional use-case execution, enforces business invariant rules, and manages operations across multiple data repositories.
* **Flow:** Completely isolated from direct web protocol parameters (`HttpServletRequest`). It processes input DTO data using pure Java rules and returns mapped data structures to the presentation boundary.

### Repository Layer (Infrastructure Data Access)

* **Role:** Abstracts persistent object storage interactions by extending Spring Data JPA repository architectures.
* **Flow:** Translates domain query expressions into optimized SQL statement blocks executed directly against the PostgreSQL 16 cluster instance.

### Entity Layer (Enterprise Core Domain)

* **Role:** Defines the structural domain data layout and database relationships.
* **Flow:** Mirrors individual table definitions using Hibernate JPA configurations. These objects track operational properties and mutate states inside transactional contexts under strict database constraints.

### DTO Layer (Data Transfer Objects)

* **Role:** Defines immutable data transfer contracts across system boundaries.
* **Flow:** Uses Jakarta Validation tags (`@NotNull`, `@Size`, `@Email`) to clean and validate ingress data payloads before they reach the core service layers.

---

## 5. pom.xml Dependencies

The platform's dependency configuration balances production security, data validation, and documentation automation frameworks.

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.5.5.Final</version>
        <scope>provided</scope>
    </dependency>

    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.5.0</version>
    </dependency>
</dependencies>

```

---

## 6. application.yml Structure

This configuration coordinates platform properties, defining connection pooling limits, JWT token validity windows, and security observability filters.

```yaml
server:
  port: 8080
  servlet:
    context-path: /api/v1

spring:
  application:
    name: selfos-backend
  
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:selfos_db}
    username: ${DB_USER:selfos_admin}
    password: ${DB_PASS:production_secure_credential_token}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      max-lifetime: 1800000
      connection-timeout: 20000

  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: false
        jdbc:
          batch_size: 25
          order_inserts: true
          order_updates: true

application:
  security:
    jwt:
      secret-key: ${JWT_SECRET_SIGNING_KEY_TOKEN_BLOCK_PROD_STRING}
      access-token-expiration: 900000 # 15 Minutes (rendered in milliseconds)
      refresh-token-expiration: 604800000 # 7 Days (rendered in milliseconds)

logging:
  level:
    root: INFO
    com.selfos: INFO
    org.springframework.security: WARN

management:
  endpoints:
    web:
      exposure:
        include: health, info, prometheus
  endpoint:
    health:
      show-details: when_authorized

```

---

## 7. Security Package Structure

The core security sub-package wires up token verification filters within the Spring Security request chain, isolating and checking inbound authentication contexts.

```text
com/selfos/core/security/
├── SecurityConfig.java               # Configures the master HttpSecurity filter chain
├── JwtAuthenticationFilter.java      # Intercepts requests to validate Bearer tokens
├── JwtService.java                   # Manages cryptographic token generation and claims
├── CustomUserDetailsService.java    # Loads user identities from the database registry
└── AuthenticationEntryPointImpl.java # Gracefully handles unauthenticated exception failures

```

---

## 8. Exception Package Structure

This segment intercept structural framework errors and business rule violations across the runtime stack, wrapping them into uniform error objects before they leave the API boundary.

```text
com/selfos/core/exception/
├── GlobalExceptionHandler.java       # Intercepts system exceptions using @ControllerAdvice
├── ErrorResponse.java                # Standardizes error response payloads
├── ResourceNotFoundException.java   # Thrown when expected entity IDs do not exist
├── ValidationException.java         # Captures structural processing failures
└── BusinessException.java             # Flags runtime core business invariant violations

```

---

## 9. Configuration Package Structure

This module coordinates system properties, wiring up documentation engines, asynchronous worker pools, audit tracking systems, and network access profiles.

```text
com/selfos/core/config/
├── OpenApiConfig.java                # Inject security bearer schemes into Swagger UI
├── AuditConfig.java                  # Enables database entity tracking via AuditorAware
├── CorsConfig.java                   # Establishes origin routing access maps
└── AsyncConfig.java                  # Configures dedicated multi-threaded executor pools

```
