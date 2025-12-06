-- training_menusテーブルにsort_orderカラムを追加
ALTER TABLE training_menus ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

-- 既存のレコードに対して、user_idごとにcreated_at順でsort_orderを割り振る
WITH ranked_menus AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) - 1 as new_order
  FROM training_menus
)
UPDATE training_menus
SET sort_order = ranked_menus.new_order
FROM ranked_menus
WHERE training_menus.id = ranked_menus.id;
