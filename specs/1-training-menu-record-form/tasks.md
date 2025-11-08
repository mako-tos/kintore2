# 実装タスク: トレーニングメニュー登録画面とトレーニング記録登録画面

**機能**: 1-training-menu-record-form
**作成日**: 2025-11-07
**仕様書**: [spec.md](./spec.md)
**計画**: [plan.md](./plan.md)

## 概要

このドキュメントはユーザーストーリーごとに実行可能なタスクを整理しています。各フェーズは独立してテスト可能な単位です。

**総タスク数**: 29
**ユーザーストーリー**: 2（US1: メニュー登録, US2: 記録登録）
**並列実行可能タスク**: 8

## 実装戦略

- **MVP範囲**: ユーザーストーリー1（メニュー登録）で最小価値を提供
- **段階的リリース**: 各ユーザーストーリーは独立してテスト可能
- **技術スタック**: Next.js, TypeScript, React, Pure.css, Supabase

---

## フェーズ1: セットアップ・インフラ

**目的**: プロジェクト構造と共通部品の初期化

### タスク
- [ ] T001 Supabaseテーブルの存在確認（training_menus, training_records specs/1-server-basic/data-model.md参照）
- [ ] T002 [P] バリデーションエラー用型定義作成 src/types/form-validation.ts
- [ ] T003 [P] バリデーション共通ユーティリティ作成 src/utils/validation.ts（名前20文字制限・必須項目）
- [ ] T004 [P] Pure.css対応のエラー表示コンポーネント作成 src/components/ErrorMessage.tsx

---

## フェーズ2: 基盤部品

**目的**: 全ユーザーストーリーで必要な共通部品の作成

### タスク
- [ ] T005 APIクライアントラッパー作成 src/lib/api-client.ts（エラー処理）
- [ ] T006 [P] ローディング表示コンポーネント作成 src/components/LoadingSpinner.tsx
- [ ] T007 [P] 成功通知コンポーネント作成 src/components/SuccessMessage.tsx

---

## フェーズ3: ユーザーストーリー1 - メニュー登録

**目的**: ユーザーが新しいトレーニングメニューを登録できる

**独立テスト基準**:
- メニュー名入力→登録ボタン→一覧追加
- 空欄でエラー表示
- 重複名でエラー表示
- キャンセルで一覧に戻る

### タスク
- [ ] T008 [US1] メニュー登録フォームコンポーネント作成 src/components/TrainingMenuForm.tsx（名前入力・登録/キャンセルボタン）
- [ ] T009 [US1] クライアントバリデーション実装 src/components/TrainingMenuForm.tsx（必須・20文字制限）
- [ ] T010 [US1] 重複チェックロジック実装 src/components/TrainingMenuForm.tsx（API利用）
- [ ] T011 [US1] メニュー登録ページ作成 src/pages/training-menus/new.tsx
- [ ] T011A [US1] メニュー一覧ページ作成 index.tsx (登録成功後の遷移先)
- [ ] T012 [US1] フォーム送信ハンドラ実装 src/components/TrainingMenuForm.tsx（POST /api/training-menus）
- [ ] T013 [US1] 登録成功時の一覧リダイレクト src/components/TrainingMenuForm.tsx
- [ ] T014 [US1] エラー表示連携 src/components/TrainingMenuForm.tsx（ErrorMessage利用）
- [ ] T014A [US1] メニュー登録フォームユニットテスト src/components/tests/TrainingMenuForm.test.tsx

**完了チェックリスト**:
- [ ] 必須項目が全て表示される
- [ ] バリデーションが送信時に発火
- [ ] 重複名は拒否される
- [ ] 成功時は一覧に遷移
- [ ] エラーは明確に表示

---

## フェーズ4: ユーザーストーリー2 - 記録登録

**目的**: ユーザーがタイマー付きで日々のトレーニング記録を登録できる

**独立テスト基準**:
- メニュー選択→スタート→タイマー起動・回数1
- スタート複数回→回数増加
- ストップ→タイマー停止
- メニュー変更→自動保存・ログ更新
- 当日記録ログに反映

### タスク
- [ ] T015 [US2] 記録フォーム状態管理フック作成 src/hooks/useTrainingRecordForm.ts（menuId, count, timer, isRunning）
- [ ] T016 [US2] タイマー処理フック作成 src/hooks/useTimer.ts（開始・停止・リセット・経過時間）
- [ ] T017 [US2] 記録フォームUI作成 src/components/TrainingRecordForm.tsx（メニュー選択・タイマー・回数・スタート/ストップボタン）
- [ ] T017A [US2] 当日日付の固定表示追加 src/components/TrainingRecordForm.tsx
- [ ] T018 [US2] スタートボタン処理実装 src/components/TrainingRecordForm.tsx（回数増加・メニュー非活性・ストップ活性）
- [ ] T019 [US2] ストップボタン処理実装 src/components/TrainingRecordForm.tsx（タイマー停止・メニュー/スタート活性・ストップ非活性）
- [ ] T020 [US2] メニュー変更時の自動保存処理 src/components/TrainingRecordForm.tsx（count>0なら保存・状態リセット）
- [ ] T021 [US2] 当日記録ログコンポーネント作成 src/components/TrainingRecordLog.tsx
- [ ] T021A 当日記録の初期取得処理追加 src/components/TrainingRecordLog.tsx
- [ ] T022 [US2] 記録登録ページ作成 src/pages/training-records/new.tsx
- [ ] T023 [US2] API自動保存処理実装 src/components/TrainingRecordForm.tsx（POST /api/training-records）
- [ ] T024 [US2] 保存失敗時のエラー処理実装 src/components/TrainingRecordForm.tsx
- [ ] T024A [US2] 記録フォームタイマー挙動テスト src/components/tests/TrainingRecordForm.timer.test.tsx
- [ ] T024B [US2] 存在しないメニューIDエラー処理 (404受領時UI表示) src/components/TrainingRecordForm.tsx

**完了チェックリスト**:
- [ ] タイマーが正しく開始/停止
- [ ] スタートごとに回数増加
- [ ] メニュー変更で自動保存
- [ ] ログに当日記録が表示
- [ ] 同一メニューが当日記録にある場合は回数を加算する
- [ ] エラーは適切に処理

---

## フェーズ5: 仕上げ・横断的対応

**目的**: UI最終調整・パフォーマンス・エラー処理

### タスク
- [ ] T025 [P] Pure.cssによるフォームデザイン調整
- [ ] T026 [P] API呼び出し最適化（3秒以内のパフォーマンス目標）
- [ ] T026A メニュー登録の往復遅延計測スクリプト追加 scripts/perf/menu-registration.ts
- [ ] T026B パフォーマンス測定スクリプト（記録自動保存遅延） scripts/perf/record-autosave.ts
- [ ] T027 API呼び出し時のローディング表示追加（両フォーム）
- [ ] T028 [P] 外部サービスへのエラーログ送信実装（plan.md参照）
- [ ] T029 PC/スマホ両対応のクロスブラウザテスト
- [ ] T029A E2E: メニュー登録～記録保存シナリオ tests/e2e/record-flow.spec.ts
- [ ] T029B UXヒューリスティック評価シート作成 docs/ux/menu-record-heuristics.md

---

## 依存関係・実行順

### ストーリー依存関係
- **US1**（メニュー登録）: 独立 - フェーズ2完了後すぐ着手可能
- **US2**（記録登録）: US1完了後着手（メニュー一覧API必要）

### 並列実行例

**フェーズ1**（T001完了後並列）:
```
T001 → [T002, T003, T004]
```

**フェーズ2**（全並列）:
```
[T006, T007]（T005は依存なし）
```

**フェーズ3**（US1）:
```
T008 → T009 → T010 → T011 → [T012, T013, T014]
```

**フェーズ4**（US2）:
```
[T015, T016] → T017 → [T018, T019, T020] → T021 → T022 → [T023, T024]
```

**フェーズ5**:
```
[T025, T026, T028] → T027 → T029
```

---

## テスト戦略

### ユニットテスト（plan.md参照）
- バリデーションユーティリティ（T003）
- タイマーフック（T016）
- フォーム状態管理（T015）

### 統合テスト（plan.md参照）
- Supabase API連携（T012, T023）
- フォーム送信フロー（T008-T014, T017-T024）

### E2Eテスト（plan.md参照）
- US1（メニュー登録）のユーザージャーニー
- US2（タイマー付き記録登録）のユーザージャーニー

### パフォーマンステスト
- 3秒以内の登録目標検証（T026）

---

## MVP提案

**推奨MVP**: フェーズ1〜3（ユーザーストーリー1のみ）
- メニュー登録機能を最速で提供
- 14タスク
- 独立リリース可能
- US2は次フェーズで追加

**メリット**:
- 価値提供の高速化
- リスク低減
- US1のユーザーフィードバックを先に得られる
- 段階的な進捗が明確

---

## 備考

- すべてのタスクはファイルパス付きでLLM実行可能
- 各ユーザーストーリーは独立してテスト可能
- 依存関係明示
- 並列実行可能タスクを明示
- テストはspec.mdで明示されていないが、plan.mdの記載に従い参考として記載

