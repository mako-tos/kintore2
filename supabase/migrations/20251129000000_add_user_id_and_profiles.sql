-- アカウント管理: profiles テーブル追加、user_id カラム追加、RLS 設定
-- フェーズ1: NULL 許容で user_id を追加

-- profiles テーブル作成（auth.users と 1:1）
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- profiles の updated_at 自動更新トリガー
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- profiles の RLS 有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- profiles のポリシー: 自分のプロフィールのみ読み書き可能
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- サービスロールはフルアクセス
CREATE POLICY "Service role full access on profiles" ON profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- training_menus に user_id 追加（NULL 許容）
ALTER TABLE training_menus 
ADD COLUMN user_id UUID NULL REFERENCES auth.users(id) ON DELETE CASCADE;

-- training_records に user_id 追加（NULL 許容）
ALTER TABLE training_records 
ADD COLUMN user_id UUID NULL REFERENCES auth.users(id) ON DELETE CASCADE;

-- インデックス追加
CREATE INDEX idx_training_menus_user_id ON training_menus(user_id);
CREATE INDEX idx_training_records_user_id ON training_records(user_id);
CREATE INDEX idx_training_records_user_training_at ON training_records(user_id, training_at DESC);

-- 既存の anon read ポリシーを削除（ユーザー別データに移行するため）
DROP POLICY IF EXISTS "Allow anonymous read access" ON training_menus;
DROP POLICY IF EXISTS "Allow anonymous read access" ON training_records;

-- 新しい RLS ポリシー: ユーザー別データアクセス

-- training_menus: SELECT
CREATE POLICY "Users can view own menus" ON training_menus
    FOR SELECT
    USING (user_id = auth.uid());

-- training_menus: INSERT
CREATE POLICY "Users can insert own menus" ON training_menus
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- training_menus: UPDATE
CREATE POLICY "Users can update own menus" ON training_menus
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- training_menus: DELETE
CREATE POLICY "Users can delete own menus" ON training_menus
    FOR DELETE
    USING (user_id = auth.uid());

-- training_records: SELECT
CREATE POLICY "Users can view own records" ON training_records
    FOR SELECT
    USING (user_id = auth.uid());

-- training_records: INSERT
CREATE POLICY "Users can insert own records" ON training_records
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- training_records: UPDATE
CREATE POLICY "Users can update own records" ON training_records
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- training_records: DELETE
CREATE POLICY "Users can delete own records" ON training_records
    FOR DELETE
    USING (user_id = auth.uid());

-- 既存のサービスロールポリシーは維持される（"Enable full access for service role"）
