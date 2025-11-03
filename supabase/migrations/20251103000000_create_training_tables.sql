CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- トレーニングメニューテーブル
CREATE TABLE training_menus (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    status SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- トレーニング記録テーブル
CREATE TABLE training_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    training_menu_id UUID NOT NULL REFERENCES training_menus(id),
    training_at TIMESTAMP WITH TIME ZONE NOT NULL,
    count INTEGER NOT NULL CHECK (count >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- インデックス
CREATE INDEX idx_training_menus_status ON training_menus(status);
CREATE INDEX idx_training_records_menu_id ON training_records(training_menu_id);
CREATE INDEX idx_training_records_training_at ON training_records(training_at DESC);

-- トリガー関数: 更新時のタイムスタンプ自動更新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー: トレーニングメニューの更新時
CREATE TRIGGER update_training_menus_updated_at
    BEFORE UPDATE ON training_menus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS)の設定
ALTER TABLE training_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;

-- 認証なしでも読み取り可能なポリシーを設定
CREATE POLICY "Allow anonymous read access" ON training_menus
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous read access" ON training_records
    FOR SELECT
    TO anon
    USING (true);

-- サービスロールのみがCRUD可能なポリシーを設定
CREATE POLICY "Enable full access for service role" ON training_menus
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable full access for service role" ON training_records
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);