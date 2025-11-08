import React, { useEffect, useState } from 'react';
import { useTrainingRecordForm } from '../hooks/useTrainingRecordForm';
import { formatDuration } from '../hooks/useTimer';
import { apiClient, ApiError } from '../lib/api-client';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

interface TrainingMenuDto { id: string; name: string; }

interface Props {
  onAutoSaved?: (entry: { menuId: string; menuName: string; count: number }) => void;
}

export const TrainingRecordForm: React.FC<Props> = ({ onAutoSaved }) => {
  const [menus, setMenus] = useState<TrainingMenuDto[]>([]);
  const [menusLoading, setMenusLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<{ field: string; message: string }[]>([]);
  const [autoSaveLoading, setAutoSaveLoading] = useState(false);
  const [autoSaveError, setAutoSaveError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshSignal, setRefreshSignal] = useState(0);

  const {
    menuId,
    count,
    trainingAt,
    elapsedMs,
    isRunning,
    handleStart,
    handleStop,
    handleMenuChange,
  } = useTrainingRecordForm({
    onAutoSave: async ({ trainingMenuId, count, trainingAt }) => {
      setAutoSaveLoading(true);
      setAutoSaveError(null);
      try {
        const body = { trainingMenuId, trainingAt, count };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await apiClient.post<{ records: any[]; total: number }>('/api/training-records', body);
        const saved = result.records[0];
        onAutoSaved?.({ menuId: saved.training_menu_id, menuName: saved.training_menus?.name || '不明', count: saved.count });
        // trigger log refresh if server aggregation needed
        setRefreshSignal(x => x + 1);
        return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const apiErr = e as ApiError;
        if (apiErr.status === 404) {
          setAutoSaveError('選択したメニューが存在しません (404)');
        } else {
          setAutoSaveError(apiErr.message || '自動保存に失敗しました');
        }
        return false;
      } finally {
        setAutoSaveLoading(false);
      }
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.get<TrainingMenuDto[]>('/api/training-menus');
        setMenus(data);
      } catch (e) {
        setFormErrors([{ field: 'menus', message: 'メニュー一覧取得に失敗しました' }]);
      } finally {
        setMenusLoading(false);
      }
    })();
  }, []);

  // Validate selection before start
  const canStart = !!menuId && !isRunning;
  const canStop = isRunning;

  const onMenuSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    await handleMenuChange(next);
  };

  return (
    <form className="pure-form pure-form-stacked" style={{ maxWidth: 480 }} onSubmit={e => e.preventDefault()}>
      <fieldset>
        <legend>記録入力 ({trainingAt})</legend>
        <label htmlFor="menuSelect">メニュー</label>
        <select
          id="menuSelect"
          value={menuId}
          onChange={onMenuSelect}
          disabled={isRunning || menusLoading}
        >
          <option value="">-- 選択してください --</option>
          {menus.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        {menusLoading && <LoadingSpinner label="メニュー取得中" />}
        <ErrorMessage errors={formErrors.filter(e => e.field === 'menus')} />

        <label style={{ marginTop: '0.75rem' }}>タイマー</label>
        <div style={{ fontSize: '1.5rem', fontVariantNumeric: 'tabular-nums' }}>{formatDuration(elapsedMs)}</div>

        <label style={{ marginTop: '0.75rem' }}>回数</label>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{count}</div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="pure-button pure-button-primary" disabled={!canStart} onClick={handleStart}>スタート</button>
          <button type="button" className="pure-button" disabled={!canStop} onClick={handleStop}>ストップ</button>
        </div>

        {autoSaveLoading && <LoadingSpinner label="自動保存中" />}
        {autoSaveError && <ErrorMessage errors={[{ field: 'autosave', message: autoSaveError }]} />}
      </fieldset>
    </form>
  );
};

export default TrainingRecordForm;