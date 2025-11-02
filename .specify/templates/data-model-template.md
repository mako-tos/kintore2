# data-model.md テンプレート

このファイルは各機能仕様ディレクトリに配置されるデータモデル定義のテンプレートです。
`specs/[###-feature]/data-model.md` としてコピーして使用してください。

## 概要

- 機能名: [機能名]
- 作成日: [DATE]
- 作成者: [AUTHOR]

## エンティティ一覧

- **EntityName**: 簡単な説明

---

## エンティティ定義例

### User

| フィールド | 型 | 必須 | 制約 | 説明 | サンプル |
|---|---:|:---:|---|---|---|
| id | UUID | ✓ | - | ユーザー識別子 | "550e8400-e29b-41d4-a716-446655440000" |
| name | string | ✓ | maxLength: 100 | 表示名 | "太郎" |
| email | string | ✓ | format: email, unique | 連絡用メールアドレス | "taro@example.com" |
| created_at | string (ISO8601) | ✓ | - | 作成日時 | "2025-11-02T12:34:56Z" |

---

## JSON Schema 例（オプション）

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "created_at": { "type": "string", "format": "date-time" }
  },
  "required": ["id","name","email","created_at"]
}
```

---

## スキーマ変更手順（必須）

1. 変更理由と影響範囲を `plan.md` に明記する
2. マイグレーションスクリプトを作成し、testsで検証する
3. バックアップ/復元手順を確認する
4. PRに `data-model.md` の変更と migration task を含める

---

## 自動化の推奨

- OpenAPI/JSON Schema/TypeScript型などの機械判読可能な出力を可能な限り用意する
- 変更は契約テスト（contract tests）と連携して検証する
