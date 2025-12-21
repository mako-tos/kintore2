-- 体組成管理: body_compositions テーブル作成

CREATE TABLE body_compositions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    weight NUMERIC NOT NULL CHECK (weight > 0),
    body_fat_mass NUMERIC NOT NULL CHECK (body_fat_mass >= 0),
    lean_body_mass NUMERIC NOT NULL CHECK (lean_body_mass > 0),
    muscle_mass NUMERIC NOT NULL CHECK (muscle_mass > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- RLS 有効化
ALTER TABLE body_compositions ENABLE ROW LEVEL SECURITY;

-- ポリシー設定
CREATE POLICY "Users can view own body compositions" ON body_compositions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body compositions" ON body_compositions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body compositions" ON body_compositions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own body compositions" ON body_compositions
    FOR DELETE
    USING (auth.uid() = user_id);
