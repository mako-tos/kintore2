# タスク一覧: アカウント管理（Google OAuth + RLS）

- Auth 設定
  - [ ] Supabase: Google プロバイダ有効化、リダイレクトURL設定
  - [ ] .env 設定（`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`）

- DB/スキーマ
  - [ ] `profiles` テーブル作成
  - [ ] `training_menus.user_id`（NULL 可）追加 + インデックス
  - [ ] `training_records.user_id`（NULL 可）追加 + インデックス
  - [ ] RLS ポリシー作成（SELECT/INSERT/UPDATE/DELETE = `user_id = auth.uid()`、service_role フルアクセス）

- 初回ログインバックフィル
  - [ ] 最初のログインユーザーの `uid` を検出
  - [ ] `user_id IS NULL` の既存データを一括更新
  - [ ] 一度のみ実行するガード（メタテーブル or フラグ）
  - [ ] `user_id` を NOT NULL 化

- アプリ側（別PR）
  - [ ] ログイン/ログアウト UI
  - [ ] Repository/API: ログインユーザーの `uid` に基づくフィルタ/挿入に統一
  - [ ] 既存画面（カレンダー、一覧、登録）の認可ガード

- 検証/運用
  - [ ] ローカル/ステージングでRLS動作検証
  - [ ] 本番 OAuth リダイレクト確認
