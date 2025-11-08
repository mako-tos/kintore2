import { useMemo, useState } from 'react';
import { useTimer } from './useTimer';

/**
 * 記録登録フォーム用の状態管理フック。
 *
 * 提供する主な状態:
 * - menuId: 現在選択中のメニューID（未選択は空文字）
 * - count: 回数（スタートで1加算、スタート中はボタン無効 → ストップ後に再度スタート可能）
 * - trainingAt: 当日（YYYY-MM-DD）固定
 * - elapsedMs, isRunning: タイマーの経過時間と動作状態（useTimer 由来）
 *
 * 主なアクション:
 * - handleStart: メニュー選択済みかつ停止中なら、回数+1してタイマー開始
 * - handleStop: 動作中ならタイマー停止
 * - handleMenuChange: メニュー切替。count>0 の場合は onAutoSave を呼び出し、成功時のみ切替・リセット
 *
 * onAutoSave の契約:
 * - (trainingMenuId, count, trainingAt, elapsedMs) を引数に呼び出し
 * - 成功時 true、失敗時 false を返す（false の場合はメニュー切替を中断し、現在の状態を保持）
 */
export interface RecordFormState {
  menuId: string;
  count: number;
}

export interface UseTrainingRecordFormOptions {
  initialMenuId?: string;
  // return true if saved, false if failed
  onAutoSave?: (payload: { trainingMenuId: string; count: number; trainingAt: string; elapsedMs: number }) => Promise<boolean> | boolean;
}

export function useTrainingRecordForm(opts: UseTrainingRecordFormOptions = {}) {
  const [menuId, setMenuId] = useState(opts.initialMenuId ?? '');
  const [count, setCount] = useState(0);
  const { elapsedMs, isRunning, start, stop, reset } = useTimer();

  // YYYY-MM-DD for today
  const trainingAt = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Actions
  const handleStart = () => {
    if (!menuId) return; // メニュー未選択時は何もしない
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
      const ok = (await opts.onAutoSave?.({ trainingMenuId: menuId, count, trainingAt, elapsedMs })) ?? true;
      if (!ok) {
        // 自動保存に失敗した場合は、状態を維持して切替を取りやめ
        return;
      }
    }
    // 保存成功（または保存不要）の場合、新メニューへ切替し、回数とタイマーをリセット
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
