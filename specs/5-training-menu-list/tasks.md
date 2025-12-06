# タスクリスト: Training Menu List

## Phase 1: データベース & バックエンド

- [ ] **DBマイグレーション作成** <!-- id: 1 -->
  - `training_menus` テーブルに `sort_order` (INTEGER, NOT NULL, DEFAULT 0) を追加するマイグレーションファイルを作成する。
  - 既存データに対して適切な初期値を設定するロジックを含める。
- [ ] **型定義の更新** <!-- id: 2 -->
  - `src/types/training-menu.ts` の `TrainingMenu` インターフェースに `sort_order` を追加する。
  - `src/types/training-menu.d.ts` も必要に応じて更新する。
- [ ] **リポジトリ層の更新** <!-- id: 3 -->
  - `src/repositories/training-menu.ts` を更新する。
  - `findAll` (または相当するメソッド) で `sort_order` の昇順で取得するように変更する。
  - `updateStatus` メソッドを実装する。
  - `updateOrder` メソッド (一括更新) を実装する。
- [ ] **APIエンドポイントの実装** <!-- id: 4 -->
  - `src/pages/api/training-menus/index.ts`: 一覧取得APIがソート順を反映しているか確認・修正。
  - `src/pages/api/training-menus/[id].ts`: ステータス更新処理を実装 (PATCH)。
  - `src/pages/api/training-menus/reorder.ts`: 順序更新処理を実装 (PUT/PATCH)。

## Phase 2: フロントエンド実装

- [ ] **ライブラリのインストール** <!-- id: 5 -->
  - `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` を実行する。
- [ ] **コンポーネント作成: TrainingMenuItem** <!-- id: 6 -->
  - `src/components/TrainingMenuItem.tsx` を作成する。
  - ドラッグハンドル、メニュー名、ステータス切替スイッチを表示する。
  - `@dnd-kit/sortable` の `useSortable` フックを使用する。
- [ ] **コンポーネント作成: TrainingMenuList** <!-- id: 7 -->
  - `src/components/TrainingMenuList.tsx` を作成する。
  - `DndContext`, `SortableContext` を設定する。
  - ドラッグ終了時のイベントハンドラ (`onDragEnd`) を実装し、楽観的UI更新とAPI呼び出しを行う。
- [ ] **ページへの組み込み** <!-- id: 8 -->
  - `src/pages/training-menus/index.tsx` (または適切なページ) に `TrainingMenuList` を配置する。
  - SSR/CSRでのデータ取得処理を実装する。

## Phase 3: テスト & 仕上げ

- [ ] **単体テスト作成** <!-- id: 9 -->
  - `src/components/__tests__/TrainingMenuList.test.tsx`: リスト表示、並び替えインタラクションのテスト。
  - `src/repositories/__tests__/training-menu.test.ts`: DB操作のテスト (mockSupabase使用)。
- [ ] **統合テスト/動作確認** <!-- id: 10 -->
  - 実際のブラウザでドラッグ＆ドロップがスムーズに動作することを確認。
  - ステータス変更が即座に反映されることを確認。
  - リロード後に順序が維持されていることを確認。
- [ ] **ドキュメント更新** <!-- id: 11 -->
  - API仕様書 (`specs/1-server-basic/schemas/training-menu.json` 等) を更新する。
