-- 初回ログインユーザーによるバックフィル処理
-- この処理は API 経由で一度だけ実行される想定

-- バックフィル済みフラグ用テーブル
CREATE TABLE IF NOT EXISTS backfill_status (
    key TEXT PRIMARY KEY,
    completed BOOLEAN DEFAULT false,
    first_user_id UUID,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 初回バックフィル実行用の関数
CREATE OR REPLACE FUNCTION backfill_user_data(target_user_id UUID)
RETURNS TABLE(updated_menus INTEGER, updated_records INTEGER) AS $$
DECLARE
    v_updated_menus INTEGER;
    v_updated_records INTEGER;
    v_already_done BOOLEAN;
BEGIN
    -- 既に実行済みかチェック
    SELECT completed INTO v_already_done 
    FROM backfill_status 
    WHERE key = 'initial_user_migration';
    
    IF v_already_done THEN
        RAISE EXCEPTION 'Backfill already completed';
    END IF;
    
    -- user_id が NULL のレコードを更新
    UPDATE training_menus 
    SET user_id = target_user_id 
    WHERE user_id IS NULL;
    
    GET DIAGNOSTICS v_updated_menus = ROW_COUNT;
    
    UPDATE training_records 
    SET user_id = target_user_id 
    WHERE user_id IS NULL;
    
    GET DIAGNOSTICS v_updated_records = ROW_COUNT;
    
    -- 完了フラグを記録
    INSERT INTO backfill_status (key, completed, first_user_id, completed_at)
    VALUES ('initial_user_migration', true, target_user_id, CURRENT_TIMESTAMP)
    ON CONFLICT (key) 
    DO UPDATE SET 
        completed = true, 
        first_user_id = target_user_id, 
        completed_at = CURRENT_TIMESTAMP;
    
    RETURN QUERY SELECT v_updated_menus, v_updated_records;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- バックフィル状態確認用関数
CREATE OR REPLACE FUNCTION check_backfill_status()
RETURNS TABLE(completed BOOLEAN, first_user_id UUID, completed_at TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
    RETURN QUERY 
    SELECT bs.completed, bs.first_user_id, bs.completed_at 
    FROM backfill_status bs 
    WHERE key = 'initial_user_migration';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
