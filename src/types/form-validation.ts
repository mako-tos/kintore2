export interface FieldError {
  field: string;
  message: string;
  code?: string; // optional machine-readable code e.g. 'required' | 'maxLength' | 'duplicate'
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

export type FieldErrorMap = Record<string, string[]>; // field -> list of messages

export const buildFieldErrorMap = (errors: FieldError[]): FieldErrorMap => {
  return errors.reduce<FieldErrorMap>((acc, e) => {
    if (!acc[e.field]) acc[e.field] = [];
    acc[e.field].push(e.message);
    return acc;
  }, {});
};
