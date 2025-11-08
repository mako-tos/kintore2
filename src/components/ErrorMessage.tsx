import React from 'react';
import type { FieldError } from '../types/form-validation';

interface ErrorMessageProps {
  errors: FieldError[] | null | undefined;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, className }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={className ?? 'pure-alert error'}
      style={{ color: '#b00020', marginTop: '0.5rem' }}
    >
      <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
        {errors.map((e, idx) => (
          <li key={idx}>{e.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorMessage;
