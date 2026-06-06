CREATE TABLE hbt_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    habit_name VARCHAR(255) NOT NULL,
    description TEXT,
    target_frequency INTEGER NOT NULL,
    streak_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL
);

CREATE INDEX idx_hbt_habits_user_id ON hbt_habits(user_id);
CREATE INDEX idx_hbt_habits_user_habit_id ON hbt_habits(id, user_id);
