# data-model: サーバ基本機能

- 機能名: サーバ基本機能
- 作成日: 2025-11-02
- 作成者: automation

## エンティティ一覧

- **ServiceStatus**: サービス稼働状態を表す軽量エンティティ
- **Config**: 環境ごとの設定情報（非機密な項目）

---

## エンティティ定義

### ServiceStatus

| フィールド | 型 | 必須 | 制約 | 説明 | サンプル |
|---|---:|:---:|---|---|---|
| status | string | ✓ | enum: ["ok","degraded","down"] | サービス状態 | "ok" |
| uptime | number | ✓ | >=0 | サーバ起動からの経過秒数 | 12345 |
| version | string | ✓ | semver | デプロイされたアプリケーションのバージョン | "1.0.0" |

---

### TrainingMenu (トレーニングメニュー)
| フィールド | 型 | 必須 | 制約 | 説明 | サンプル |
|---|---:|:---:|---|---|---|
| id | string (UUID) | ✓ | format: uuid | トレーニングメニュー識別子 | "550e8400-e29b-41d4-a716-446655440000" |
| name | string | ✓ | maxLength: 20 | トレーニングメニュー名 | "スクワット" |
| status | number | ✓ | enum: [0,1] | 0:有効, 1:無効 | 0 |
| createdAt | string (ISO8601) | ✓ | format: date-time | 作成日時 | "2025-11-02T12:34:56Z" |
| updatedAt | string (ISO8601) | ✓ | format: date-time | 更新日時 | "2025-11-02T12:34:56Z" |

---

### TrainingRecord (トレーニング記録)
| フィールド | 型 | 必須 | 制約 | 説明 | サンプル |
|---|---:|:---:|---|---|---|
| id | string (UUID) | ✓ | format: uuid | トレーニングレコード識別子 | "550e8400-e29b-41d4-a716-446655440002" |
| trainingMenuId | string (UUID) | ✓ | format: uuid | トレーニングメニュー識別子 | "550e8400-e29b-41d4-a716-446655440000" |
| trainingAt | string (ISO8601) | ✓ | format: date-time | トレーニング実施日時 | "2025-11-02T10:00:00Z" |
| count | number | ✓ | minimum: 1 | 実施回数 | 12 |
| createdAt | string (ISO8601) | ✓ | format: date-time | 作成日時 | "2025-11-02T12:34:56Z" |

---

### Config

| フィールド | 型 | 必須 | 制約 | 説明 | サンプル |
|---|---:|:---:|---|---|---|
| NODE_ENV | string | ✓ | enum: ["development","staging","production"] | 実行環境 | "development" |
| DB_URL | string | 条件付き | format: uri | データストア接続文字列（存在しない場合は機能が限定される） | "postgres://..." |
| LOG_LEVEL | string | ✓ | enum: ["debug","info","warn","error"] | ログ出力レベル | "info" |

---

## JSON Schema

### ServiceStatus
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ServiceStatus",
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["ok","degraded","down"] },
    "uptime": { "type": "number", "minimum": 0 },
    "version": { "type": "string" }
  },
  "required": ["status","uptime","version"]
}
```

### TrainingMenu
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "TrainingMenu",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "maxLength": 20 },
    "status": { "type": "number", "enum": [0,1] },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id","name","status","createdAt", "updatedAt"]
}
```

### TrainingRecord
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "TrainingRecord",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "trainingMenuId": { "type": "string", "format": "uuid" },
    "trainingAt": { "type": "string", "format": "date-time" },
    "count": { "type": "number", "minimum": 1 },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id","trainingMenuId","trainingAt","count","createdAt"]
}
```

---

## マイグレーション手順（該当する場合）

1. `plan.md` に変更理由と影響範囲を明記する
2. マイグレーションスクリプトを作成し、ローカル/ステージングで検証する
3. バックアップを取得してから本番反映する

---

## 自動生成/契約テスト

- 可能であれば上記 JSON Schema を使って契約テストや型生成（TypeScript型）を自動生成する
