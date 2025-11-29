# データモデル: アカウント管理

## 新規テーブル: profiles

- 目的: `auth.users` と 1:1 のアプリ用プロフィール
- 定義（概略）
  - `user_id UUID PRIMARY KEY REFERENCES auth.users(id)`
  - `display_name TEXT NULL`
  - `avatar_url TEXT NULL`
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

## 既存テーブル拡張（初期は NULL 可）

- `training_menus`
  - `user_id UUID NULL REFERENCES auth.users(id)`
- `training_records`
  - `user_id UUID NULL REFERENCES auth.users(id)`
  - 既存の `set` カラムは現状維持

## RLS ポリシー（推奨3点）

- 対象: `training_menus`, `training_records`
- ルール:
  - SELECT: `USING (user_id = auth.uid())`
  - INSERT: `WITH CHECK (user_id = auth.uid())`
  - UPDATE/DELETE: `USING (user_id = auth.uid())`
- サービスロール: `FOR ALL USING (true) WITH CHECK (true)`

## マイグレーション手順（概要）

1. カラム追加（NULL 可）
   - `ALTER TABLE training_menus ADD COLUMN user_id UUID NULL REFERENCES auth.users(id);`
   - `ALTER TABLE training_records ADD COLUMN user_id UUID NULL REFERENCES auth.users(id);`
2. RLS ポリシー作成（上記3点 + service_role）
3. 初回ログイン後バックフィル
   - `UPDATE training_menus SET user_id = :first_uid WHERE user_id IS NULL;`
   - `UPDATE training_records SET user_id = :first_uid WHERE user_id IS NULL;`
4. NOT NULL 化
   - `ALTER TABLE training_menus ALTER COLUMN user_id SET NOT NULL;`
   - `ALTER TABLE training_records ALTER COLUMN user_id SET NOT NULL;`

## インデックス

- `CREATE INDEX idx_training_menus_user ON training_menus(user_id);`
- `CREATE INDEX idx_training_records_user_at ON training_records(user_id, training_at DESC);`
