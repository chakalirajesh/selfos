-- ============================================================================
-- SelfOS Database Schema Definition (schema.sql)
-- Target Database: PostgreSQL 16.x
-- Architecture: Modular Monolith Strategy with Strong Physical Constraint Guards
-- ============================================================================

-- Enable pgcrypto extension for gen_random_uuid() if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- AUTOMATED REUSABLE AUDIT TRIGGER CONFIGURATION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. AUTHENTICATION MODULE (`auth_`)
-- ============================================================================

CREATE TABLE auth_users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
full_name VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL,
password_hash VARCHAR(60) NOT NULL,
role VARCHAR(20) NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

```
CONSTRAINT uq_auth_users_email UNIQUE (email),
CONSTRAINT chk_auth_users_role CHECK (role IN ('ADMIN', 'USER')),
CONSTRAINT chk_auth_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')

```

);

CREATE TABLE auth_refresh_tokens (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
token VARCHAR(512) NOT NULL,
expiry_date TIMESTAMPTZ NOT NULL,
revoked BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

```
CONSTRAINT uq_auth_refresh_tokens_token UNIQUE (token),
CONSTRAINT fk_auth_refresh_tokens_user FOREIGN KEY (user_id) 
    REFERENCES auth_users(id) ON DELETE CASCADE

```

);

-- Triggers for Auth Module
CREATE TRIGGER trg_auth_users_updated_at
BEFORE UPDATE ON auth_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_auth_refresh_tokens_updated_at
BEFORE UPDATE ON auth_refresh_tokens
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. PROJECTS MODULE (`prd_`)
-- ============================================================================

CREATE TABLE prd_projects (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
project_name VARCHAR(255) NOT NULL,
description TEXT,
start_date TIMESTAMPTZ,
end_date TIMESTAMPTZ,
progress INT NOT NULL DEFAULT 0,
status VARCHAR(20) NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by UUID NOT NULL,
updated_by UUID NOT NULL,

```
CONSTRAINT fk_prd_projects_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE,
CONSTRAINT chk_prd_projects_progress CHECK (progress BETWEEN 0 AND 100),
CONSTRAINT chk_prd_projects_status CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'ON_HOLD')),
CONSTRAINT chk_prd_projects_dates CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)

```

);

CREATE TABLE prd_project_milestones (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
project_id UUID NOT NULL,
title VARCHAR(255) NOT NULL,
description TEXT,
due_date TIMESTAMPTZ NOT NULL,
status VARCHAR(20) NOT NULL,
completed_at TIMESTAMPTZ,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by UUID NOT NULL,
updated_by UUID NOT NULL,

```
CONSTRAINT fk_prd_milestones_project FOREIGN KEY (project_id)
    REFERENCES prd_projects(id) ON DELETE CASCADE,
CONSTRAINT chk_prd_milestones_status CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'MISSED')),
CONSTRAINT chk_prd_milestones_completion_sync CHECK (
    (status = 'COMPLETED' AND completed_at IS NOT NULL) OR 
    (status != 'COMPLETED' AND completed_at IS NULL)
)

```

);

-- Triggers for Projects Module
CREATE TRIGGER trg_prd_projects_updated_at
BEFORE UPDATE ON prd_projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_prd_project_milestones_updated_at
BEFORE UPDATE ON prd_project_milestones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. TASK MANAGEMENT MODULE (`tsk_`)
-- ============================================================================

CREATE TABLE tsk_tasks (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
project_id UUID,
title VARCHAR(255) NOT NULL,
description TEXT,
priority VARCHAR(20) NOT NULL,
status VARCHAR(20) NOT NULL,
due_date TIMESTAMPTZ,
category VARCHAR(50),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by UUID NOT NULL,
updated_by UUID NOT NULL,

```
CONSTRAINT fk_tsk_tasks_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE,
CONSTRAINT fk_tsk_tasks_project FOREIGN KEY (project_id)
    REFERENCES prd_projects(id) ON DELETE SET NULL,
CONSTRAINT chk_tsk_tasks_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
CONSTRAINT chk_tsk_tasks_status CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))

```

);

CREATE TRIGGER trg_tsk_tasks_updated_at
BEFORE UPDATE ON tsk_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. GOAL MANAGEMENT MODULE (`gol_`)
-- ============================================================================

CREATE TABLE gol_goals (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
goal_name VARCHAR(255) NOT NULL,
description TEXT,
start_date TIMESTAMPTZ NOT NULL,
target_date TIMESTAMPTZ NOT NULL,
progress_percentage INT NOT NULL DEFAULT 0,
status VARCHAR(20) NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by UUID NOT NULL,
updated_by UUID NOT NULL,

```
CONSTRAINT fk_gol_goals_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE,
CONSTRAINT chk_gol_goals_progress CHECK (progress_percentage BETWEEN 0 AND 100),
CONSTRAINT chk_gol_goals_status CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
CONSTRAINT chk_gol_goals_dates CHECK (start_date <= target_date)

```

);

CREATE TRIGGER trg_gol_goals_updated_at
BEFORE UPDATE ON gol_goals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. HABIT TRACKER MODULE (`hab_`)
-- ============================================================================

CREATE TABLE hab_habits (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
habit_name VARCHAR(100) NOT NULL,
category VARCHAR(50),
target_frequency VARCHAR(20) NOT NULL,
streak_count INT NOT NULL DEFAULT 0,
completion_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by UUID NOT NULL,
updated_by UUID NOT NULL,

```
CONSTRAINT fk_hab_habits_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE,
CONSTRAINT chk_hab_habits_frequency CHECK (target_frequency IN ('DAILY', 'WEEKLY')),
CONSTRAINT chk_hab_habits_streak CHECK (streak_count >= 0),
CONSTRAINT chk_hab_habits_rate CHECK (completion_rate BETWEEN 0.00 AND 100.00)

```

);

CREATE TABLE hab_habit_logs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
habit_id UUID NOT NULL,
log_date DATE NOT NULL,
status VARCHAR(20) NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by UUID NOT NULL,
updated_by UUID NOT NULL,

```
CONSTRAINT uq_hab_habit_logs_date UNIQUE (habit_id, log_date),
CONSTRAINT chk_hab_habit_logs_status CHECK (status IN ('COMPLETED', 'MISSED')),
CONSTRAINT fk_hab_habit_logs_habit FOREIGN KEY (habit_id) 
    REFERENCES hab_habits(id) ON DELETE CASCADE

```

);

CREATE TRIGGER trg_hab_habits_updated_at
BEFORE UPDATE ON hab_habits
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_hab_habit_logs_updated_at
BEFORE UPDATE ON hab_habit_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. LEARNING TRACKER MODULE (`lrn_`)
-- ============================================================================

CREATE TABLE lrn_learning_topics (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
topic_name VARCHAR(255) NOT NULL,
category VARCHAR(50) NOT NULL,
completion_percentage INT NOT NULL DEFAULT 0,
hours_studied NUMERIC(6,2) NOT NULL DEFAULT 0.00,
notes TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by UUID NOT NULL,
updated_by UUID NOT NULL,

```
CONSTRAINT fk_lrn_topics_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE,
CONSTRAINT chk_lrn_topics_completion CHECK (completion_percentage BETWEEN 0 AND 100),
CONSTRAINT chk_lrn_topics_hours CHECK (hours_studied >= 0.00)

```

);

CREATE TRIGGER trg_lrn_learning_topics_updated_at
BEFORE UPDATE ON lrn_learning_topics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. DEVOPS ROADMAP MODULE (`rdm_`)
-- ============================================================================

CREATE TABLE rdm_roadmap_topics (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
topic_name VARCHAR(100) NOT NULL,
progress_percentage INT NOT NULL DEFAULT 0,
status VARCHAR(20) NOT NULL,
completion_date TIMESTAMPTZ,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

```
CONSTRAINT fk_rdm_roadmap_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE,
CONSTRAINT chk_rdm_roadmap_topic_name CHECK (topic_name IN (
    'Linux','Git','Docker','Kubernetes','Helm','Jenkins','AWS','Terraform','Argo CD','Prometheus','Grafana'
)),
CONSTRAINT chk_rdm_roadmap_progress CHECK (progress_percentage BETWEEN 0 AND 100),
CONSTRAINT chk_rdm_roadmap_status CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
CONSTRAINT chk_rdm_roadmap_completion_sync CHECK (
    (status = 'COMPLETED' AND completion_date IS NOT NULL) OR 
    (status != 'COMPLETED' AND completion_date IS NULL)
)

```

);

CREATE TRIGGER trg_rdm_roadmap_topics_updated_at
BEFORE UPDATE ON rdm_roadmap_topics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. NOTES MODULE (`not_`)
-- ============================================================================

CREATE TABLE not_notes (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
title VARCHAR(255) NOT NULL,
category VARCHAR(50) NOT NULL,
content TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by UUID NOT NULL,
updated_by UUID NOT NULL,

```
CONSTRAINT fk_not_notes_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE

```

);

CREATE TRIGGER trg_not_notes_updated_at
BEFORE UPDATE ON not_notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. CAREER TRACKER MODULE (`car_`)
-- ============================================================================

CREATE TABLE car_tracker (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
company_name VARCHAR(150) NOT NULL,
position VARCHAR(150) NOT NULL,
application_date TIMESTAMPTZ NOT NULL,
status VARCHAR(20) NOT NULL,
notes TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

```
CONSTRAINT fk_car_tracker_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE,
CONSTRAINT chk_car_tracker_status CHECK (status IN ('APPLIED', 'INTERVIEW', 'REJECTED', 'OFFERED', 'HIRED'))

```

);

CREATE TRIGGER trg_car_tracker_updated_at
BEFORE UPDATE ON car_tracker
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. SYSTEM INFRASTRUCTURE SYSTEM MODULE (`sys_`)
-- ============================================================================

CREATE TABLE sys_notifications (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL,
message TEXT NOT NULL,
type VARCHAR(20) NOT NULL,
read BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

```
CONSTRAINT fk_sys_notifications_user FOREIGN KEY (user_id)
    REFERENCES auth_users(id) ON DELETE CASCADE,
CONSTRAINT chk_sys_notifications_type CHECK (type IN ('EMAIL', 'IN_APP'))

```

);

CREATE TABLE sys_activity_logs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID,
action VARCHAR(255) NOT NULL,
ip_address VARCHAR(45),
timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

```
CONSTRAINT fk_sys_activity_logs_user FOREIGN KEY (user_id) 
    REFERENCES auth_users(id) ON DELETE SET NULL

```

);

-- ============================================================================
-- PERFORMANCE & OPERATIONAL INDEXING STRATEGY
-- ============================================================================

-- B-Tree Structural Single-Column Indexes (High Target Selectivity lookup arrays)
CREATE INDEX idx_auth_users_email ON auth_users (email);
CREATE INDEX idx_auth_tokens_hash ON auth_refresh_tokens (token);

-- Composite Functional Dashboard Indexes (Optimizes filter/sort query aggregation execution paths)
CREATE INDEX idx_tsk_user_status ON tsk_tasks (user_id, status);
CREATE INDEX idx_gol_user_status ON gol_goals (user_id, status);
CREATE INDEX idx_hab_logs_composite ON hab_habit_logs (habit_id, log_date);
CREATE INDEX idx_not_user_cat ON not_notes (user_id, category);
CREATE INDEX idx_prd_user_status ON prd_projects (user_id, status);
CREATE INDEX idx_car_user_status ON car_tracker (user_id, status);
CREATE INDEX idx_prd_milestones_proj_status ON prd_project_milestones (project_id, status);

-- Partial Performance Optimization Indexes (Reduces memory size and isolates active targets)
CREATE INDEX idx_tsk_partial_due_date ON tsk_tasks (due_date)
WHERE status != 'COMPLETED' AND status != 'CANCELLED';

CREATE INDEX idx_sys_notif_unread ON sys_notifications (user_id)
WHERE read = FALSE;

-- Full-Text Search (FTS) Indexing Strategy for Notes Module
-- Combines title and content vectors into a single Gin index for rapid keyword matching
CREATE INDEX idx_not_notes_fts ON not_notes USING gin (
(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')))
);
