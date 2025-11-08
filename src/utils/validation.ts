import type { ValidationResult, FieldError } from "../types/form-validation";

export const MAX_MENU_NAME = 20;

export function validateMenuName(name: string): ValidationResult {
  const errors: FieldError[] = [];
  const trimmed = (name ?? "").trim();

  if (!trimmed) {
    errors.push({ field: "name", message: "メニュー名は必須です", code: "required" });
  }
  if (trimmed.length > MAX_MENU_NAME) {
    errors.push({ field: "name", message: `メニュー名は${MAX_MENU_NAME}文字以内で入力してください`, code: "maxLength" });
  }

  return { valid: errors.length === 0, errors };
}

export function hasErrors(result: ValidationResult): boolean {
  return !result.valid && result.errors.length > 0;
}
