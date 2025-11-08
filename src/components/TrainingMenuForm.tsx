import React, { useCallback, useEffect, useState } from 'react';
import { validateMenuName, hasErrors } from '../utils/validation';
import { apiClient, ApiError } from '../lib/api-client';
import type { FieldError, ValidationResult } from '../types/form-validation';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import LoadingSpinner from './LoadingSpinner';

interface TrainingMenuDto { id: string; name: string; }

interface Props {
  onSuccess?: (created: TrainingMenuDto) => void;
  onCancel?: () => void;
}

const TrainingMenuForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [duplicateNames, setDuplicateNames] = useState<Set<string>>(new Set());
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Load existing menu names for duplicate pre-check
  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.get<TrainingMenuDto[]>('/api/training-menus');
        setDuplicateNames(new Set(data.map(d => d.name.trim())));
      } catch (e) {
        // Non-blocking: ignore
        console.warn('Failed to preload menus', e);
      } finally {
        setInitialFetchDone(true);
      }
    })();
  }, []);

  const runValidation = useCallback((currentName: string): ValidationResult => {
    const result = validateMenuName(currentName);
    const localErrors: FieldError[] = [...result.errors];
    if (result.valid) {
      // duplicate check
      if (duplicateNames.has(currentName.trim())) {
        localErrors.push({ field: 'name', message: 'この名前は既に登録されています', code: 'duplicate' });
      }
    }
    return { valid: localErrors.length === 0, errors: localErrors };
  }, [duplicateNames]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // live validation (optional behavior)
    const v = runValidation(e.target.value);
    setErrors(v.errors);
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    const v = runValidation(name);
    setErrors(v.errors);
    if (hasErrors(v)) return;
    setSubmitLoading(true);
    try {
      const created = await apiClient.post<TrainingMenuDto>('/api/training-menus', { name });
      setSuccessMsg('メニューを登録しました');
      onSuccess?.(created);
      // update duplicate cache
      setDuplicateNames(prev => new Set([...prev, name.trim()]));
      setName('');
      setErrors([]);
    } catch (err) {
      const apiErr = err as ApiError;
      setErrors([{ field: 'form', message: apiErr.message || '登録に失敗しました', code: 'server' }]);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pure-form pure-form-stacked" style={{ maxWidth: 420 }}>
      <fieldset>
        <legend>トレーニングメニュー登録</legend>
        <label htmlFor="menuName">メニュー名</label>
        <input
          id="menuName"
          name="name"
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="スクワット"
          disabled={submitLoading}
          aria-invalid={errors.some(e => e.field === 'name')}
        />
        {submitLoading && <LoadingSpinner label="送信中" />}
        <ErrorMessage errors={errors.filter(e => e.field === 'name' || e.field === 'form')} />
        <SuccessMessage message={successMsg} />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="pure-button pure-button-primary" disabled={submitLoading || !initialFetchDone}>登録</button>
          <button type="button" className="pure-button" onClick={onCancel} disabled={submitLoading}>キャンセル</button>
        </div>
      </fieldset>
    </form>
  );
};

export default TrainingMenuForm;
