-- データモデル変更: count (回) → set (セット)
-- training_records テーブルの count カラムを set に変更

ALTER TABLE training_records 
RENAME COLUMN count TO set;

-- 制約は自動的に引き継がれる (CHECK (set >= 1))
