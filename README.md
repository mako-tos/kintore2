# このプロジェクトについて

このプロジェクトは `GitHub spec kit` の学習用プロジェクトです
`GitHub spec kit`で作成してデプロイまでもっていくことを目的にしています

## 注意

MVP 作成目的なので認証など必要なものを作成してません
そのまま参考にしないでください

## supabase について

DB に supbase を使用してます

### やること

- テーブル作成
  supbase にログイン後、`SQL Editor`を開き
  `.\supabase\migrations\**.sql`
  を張り付けて`Ctrl + Enter`で実行してください

- API Key 取得
  `Setting > API Keys > Legacy API Keys`を開き

  - `anon`
    `anon`の API KEY をコピーして `.env.development` に
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${コピーしたAPI KEY}`
    行を追加

  - `service_role`
    `service_role`の API KEY を`reveal`後にコピーして `.env.development` に
    `SUPABASE_SERVICE_ROLE_KEY=${コピーしたAPI KEY}`
    行を追加

- SUPABASE_URL 取得
  `Setting > DATA API`を開き `Project URL`をコピーして `.env.development` に
  `NEXT_PUBLIC_SUPABASE_URL=${コピーしたURL}`
  行を追加
