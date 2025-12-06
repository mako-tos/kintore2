# 実装計画: Training Menu List

**ブランチ**: `main` | **作成日**: 2025-12-06 | **仕様書**: [spec.md](./spec.md)
**入力**: `/specs/5-training-menu-list/spec.md` からの機能仕様

## 概要

トレーニングメニューの一覧表示機能を作成する。
主な機能として、メニューのステータス変更（有効/無効）と、ドラッグ＆ドロップによる表示順の並び替えを提供する。
これにより、ユーザーは自身のトレーニングメニューを効率的に管理・整理できるようになる。

## 技術的コンテキスト

**言語/バージョン**: Node.js 22+, TypeScript
**主要依存関係**: Next.js, Pure.css, @dnd-kit/core, @dnd-kit/sortable
**ストレージ**: Supabase (PostgreSQL)
**テスト**: テストカバレッジ80%以上必須 (Jest, React Testing Library)
**対象プラットフォーム**: netlify
**プロジェクトタイプ**: Webアプリケーション
**パフォーマンス目標**: API応答時間500ms以内, FCP 500ms以内
**制約**:

- フォント: 游明朝、游ゴシック
- 言語: 日本語のみ
- シークレット管理: 環境変数で管理

## 憲法チェック

### 基本原則との整合性

- [x] 効率的なワークアウト管理の原則に準拠 (メニューの整理機能)
- [x] ユーザビリティ重視の原則に準拠 (ドラッグ＆ドロップによる直感的な操作)
- [x] データ駆動の意思決定の原則に準拠
- [x] セキュリティとプライバシーの原則に準拠 (RLSの維持)
- [x] 継続的な改善の原則に準拠

### 技術要件の遵守

- [x] 指定された技術スタックの使用（Node.js 22+, TypeScript, Next.js, Pure.css）
- [x] Supabaseの適切な利用 (sort_orderカラムの追加)
- [x] netlifyでのデプロイ対応
- [x] 環境変数によるシークレット管理

### パフォーマンス要件

- [x] API応答時間500ms以内 (インデックスの適切な使用)
- [x] FCP 500ms以内
- [x] RUMによる計測実装

### アクセシビリティ要件

- [x] 色覚特性への配慮
- [x] レイアウトの一貫性
- [x] 游明朝・游ゴシックフォントの適切な使用
- [x] キーボード操作への配慮 (@dnd-kitの活用)

### 品質基準

- [x] テストカバレッジ80%以上
- [x] コードレビュー実施計画
- [x] 静的解析ツールの設定

## プロジェクト構造

### ドキュメント（この機能）

```text
specs/5-training-menu-list/
├── plan.md              # この文書
├── spec.md              # 機能仕様書
└── tasks.md             # タスクリスト
```

### ソースコード（リポジトリルート）

```text
src/
├── components/
│   ├── TrainingMenuList.tsx       # 新規: メニュー一覧コンポーネント
│   └── TrainingMenuItem.tsx       # 新規: 個別メニュー行コンポーネント
├── pages/
│   └── api/
│       └── training-menus/
│           ├── index.ts           # 更新: GET (sort_order対応)
│           ├── [id].ts            # 更新: PATCH (status更新)
│           └── reorder.ts         # 新規: PUT/PATCH (順序更新)
├── repositories/
│   └── training-menu.ts           # 更新: sort_order対応、reorderメソッド追加
├── types/
│   └── training-menu.ts           # 更新: sort_orderプロパティ追加
└── styles/
    └── training-menu-list.css     # 新規: 一覧用スタイル (必要であれば)

supabase/
└── migrations/
    └── 20251206000000_add_sort_order_to_training_menus.sql # 新規
```
