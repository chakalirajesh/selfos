CREATE TABLE gol_goals (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date TIMESTAMP WITH TIME ZONE,
    progress INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL
);

CREATE INDEX idx_gol_goals_user_id ON gol_goals(user_id);
CREATE INDEX idx_gol_goals_user_goal_id ON gol_goals(id, user_id);