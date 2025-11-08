import { useEffect, useMemo, useState } from 'react';
import { useTimer } from './useTimer';

export interface RecordFormState {
  menuId: string;
  count: number;
}

export interface UseTrainingRecordFormOptions {
  initialMenuId?: string;
  onAutoSave?: (payload: { trainingMenuId: string; count: number; trainingAt: string; elapsedMs: number }) => Promise<void> | void;
}

export function useTrainingRecordForm(opts: UseTrainingRecordFormOptions = {}) {
  const [menuId, setMenuId] = useState(opts.initialMenuId ?? '');
  const [count, setCount] = useState(0);
  const { elapsedMs, isRunning, start, stop, reset } = useTimer();

  // YYYY-MM-DD for today
  const trainingAt = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Actions
  const handleStart = () => {
    if (!menuId) return; // require selection
    if (!isRunning) {
      setCount(c => c + 1);
      start();
    }
  };

  const handleStop = () => {
    if (isRunning) stop();
  };

  const handleMenuChange = async (nextId: string) => {
    if (nextId === menuId) return;
    // auto save if count > 0
    if (count > 0 && menuId) {
      await opts.onAutoSave?.({ trainingMenuId: menuId, count, trainingAt, elapsedMs });
    }
    // reset state for new menu
    setMenuId(nextId);
    setCount(0);
    reset();
  };

  return {
    // state
    menuId,
    count,
    trainingAt,
    elapsedMs,
    isRunning,
    // actions
    setMenuId,
    handleStart,
    handleStop,
    handleMenuChange,
  };
}
