# 実装計画: アカウント管理（Google OAuth + RLS）

## フェーズ概要

1. Auth 準備
   - Supabase で Google プロバイダ有効化、リダイレクトURL設定（ローカル/本番）
   - .env に `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定
2. データモデル拡張（NULL 許容）
   - `profiles` テーブル新設（`user_id` PK、表示名/アイコンURL など任意）
   - `training_menus` / `training_records` に `user_id UUID NULL` 追加 + インデックス
3. RLS 導入（設置のみ、まだ NOT NULL 化しない）
   - `SELECT/INSERT/UPDATE/DELETE` すべて `user_id = auth.uid()` のポリシー
   - サービスロールは `FOR ALL USING true WITH CHECK true`
4. 初回ログイン検出とバックフィル
   - 最初のログインユーザーの `auth.uid()` を取得
   - 既存の `training_menus` / `training_records` の `user_id IS NULL` をその `uid` で一括更新
   - 一度だけ実行されるようにメタテーブル等でフラグ管理
5. NOT NULL 制約へ切替
   - `ALTER TABLE ... ALTER COLUMN user_id SET NOT NULL`
6. アプリ側改修（別タスク）
   - 認証 UI（ログイン/ログアウト）
   - API/Repository を `user_id` 前提に改修（クエリは `auth.uid()` スコープ）

## インデックス/チューニング

- `training_menus(user_id, name)`
- `training_records(user_id, training_at DESC)`

## 運用

- OAuth 設定のリダイレクトURLは環境ごとに登録
- RLS 導入後は anon でのデータ取得は不可（UIでのログイン必須）
