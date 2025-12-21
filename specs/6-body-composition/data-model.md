# data-model: 体組成管理

- 機能名: 体組成管理
- 作成日: 2025-12-21
- 作成者: GitHub Copilot

## エンティティ一覧

- **BodyComposition**: ユーザーの体組成情報（体重、体脂肪率など）

---

## エンティティ定義

### BodyComposition (体組成)

| フィールド   |        型        | 必須 | 制約              | 説明                      | サンプル                               |
| :----------- | :--------------: | :--: | :---------------- | :------------------------ | :------------------------------------- |
| id           |  string (UUID)   |  ✓   | format: uuid      | 体組成ID                  | "550e8400-e29b-41d4-a716-446655440000" |
| userId       |  string (UUID)   |  ✓   | format: uuid      | ユーザID                  | "550e8400-e29b-41d4-a716-446655440010" |
| date         | string (ISO8601) |  ✓   | format: date-time | 日付                      | "2025-12-21T10:00:00Z"                 |
| weight       |      number      |  ✓   | > 0               | 体重 (kg)                 | 65.5                                   |
| bodyFatMass  |      number      |  ✓   | >= 0              | 体脂肪量 (kg)             | 12.5                                   |
| leanBodyMass |      number      |  ✓   | > 0               | 除脂肪体重 (kg)           | 53.0                                   |
| muscleMass   |      number      |  ✓   | > 0               | 筋肉量 (kg)               | 50.0                                   |
| created_at   |   TIMESTAMPTZ    |  ✓   | > 0               | 作成日時 デフォルト now() |                                        |
