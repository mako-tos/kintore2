# このプロジェクトについて

このプロジェクトは `GitHub spec kit` の学習用プロジェクトです
`GitHub spec kit`で作成してデプロイまでもっていくことを目的にしています

## 注意

MVP 作成目的なので認証など必要なものを作成してません
そのまま参考にしないでください

## netlify について

Netlify の production ビルドでは NODE_ENV=production となり、`npm install --production`が実行されるため devDependencies がインストールされません。TypeScript のビルドや型チェック（`npm run prebuild` の `generate-types` など）で型定義が必要なため、これらを dependencies に含める必要があります。

`npm run build:netlify`コマンドで netlify のビルドでこけないかのチェックをします

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

### Google OAuth Client ID / Secret の取得

1. [Google Cloud Console](https://console.cloud.google.com/) へ移動
2. プロジェクトの作成
3. https://console.cloud.google.com/auth/overview?project=<user_google_project_id> へ移動し作成
   Scopes は `email`, `profile`, `openid`
4. APIs & Services → Credentials → Create Credentials → OAuth client ID へ移動
5. 以下の設定をする

```
Application type: Web application
Name: 任意 (例: Supabase OAuth)
Authorized JavaScript origins:
`http://localhost:3000` (ローカル)
`https://<your-prod-domain>` (本番)
`<NEXT_PUBLIC_SUPABASE_URL>`
Authorized redirect URIs:
<NEXT_PUBLIC_SUPABASE_URL>/auth/v1/callback (ローカル)
<NEXT_PUBLIC_SUPABASE_URL>/auth/v1/callback (本番)
```

6. Client IDと Client Secretが表示されるのでコピー
7. 6でコピーしたClient IDと Client SecretをSupabaseにコピーする

- Authentication > Sign In / Providersを開く
- Auth ProvidersからGoogleをクリック
- Client IDと Client Secretを張り付ける

8. SupabaseのURL設定を更新する

- Authentication > URL Configuration を開く
- Site URLを`http://localhost:3000`更新

9. OAuth Appsを設定する

- Authentication > OAuth Appsを開く
- New OAuth Appボタンを押し作成する
