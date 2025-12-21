# tasks: 体組成情報登録機能

- 機能名: 体組成情報登録
- 作成日: 2025-12-21
- 作成者: GitHub Copilot

## Phase 1: データベース構築

- [ ] マイグレーションファイルの作成 (`supabase/migrations/YYYYMMDDHHMMSS_create_body_compositions.sql`)
    - `body_compositions` テーブル定義
    - RLS ポリシー設定
- [ ] 型定義の更新
    - `npm run generate-types` 実行
    - `src/types/body-composition.ts` 作成

## Phase 2: バックエンド API 実装

- [ ] API ルート作成 (`src/pages/api/body-compositions/index.ts`)
    - POST メソッド実装
    - バリデーション実装
    - DB 保存処理実装

## Phase 3: フロントエンド実装 (ロジック)

- [ ] MHT 解析ユーティリティ作成 (`src/utils/mht-parser.ts`)
    - HTML 抽出ロジック
    - データ抽出ロジック (計測日, 体重, 体脂肪量, 除脂肪体重, 筋肉量)
- [ ] ユニットテスト作成 (`src/utils/__tests__/mht-parser.test.ts`)
    - サンプルファイルを用いたテストケース実装

## Phase 4: フロントエンド実装 (UI)

- [ ] 登録ページ作成 (`src/pages/body-composition/new.tsx`)
    - レイアウト適用
- [ ] ファイルアップロード機能実装
    - ファイル選択 UI
    - `FileReader` 読み込み処理
    - 解析処理呼び出し
- [ ] 登録フォーム実装
    - フォーム UI 作成
    - 初期値セット処理
    - API 送信処理

## Phase 5: 結合テスト・確認

- [ ] 動作確認
    - ファイルアップロードと解析結果の確認
    - データ登録と DB 保存確認
