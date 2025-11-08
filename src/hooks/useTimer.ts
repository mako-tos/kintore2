import { useEffect, useRef, useState } from 'react';

/**
 * 高精度な経過時間（ミリ秒）を提供するタイマーフック。
 * requestAnimationFrame を利用して描画タイミングごとに経過時間を更新します。
 * start → stop → start の再開にも対応し、途中停止時の残り時間を保持します。
 */

export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0); // 経過時間（ミリ秒）
  const [isRunning, setIsRunning] = useState(false); // 動作中フラグ
  const startAtRef = useRef<number | null>(null); // 計測開始時刻（pause → resume に対応）
  const rafRef = useRef<number | null>(null); // requestAnimationFrame のID管理

  useEffect(() => {
    if (!isRunning) return; // 停止中は何もしない
    // 再開時: 既存の elapsedMs を差し引いて正しい開始基準時刻を保持
    startAtRef.current = performance.now() - elapsedMs;

    const tick = () => {
      if (startAtRef.current != null) {
        // 現在時刻との差分で経過時間を再計算
        setElapsedMs(performance.now() - startAtRef.current);
        rafRef.current = requestAnimationFrame(tick); // 次フレームで継続
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      // クリーンアップで RAF を停止
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  /**
   * 計測を開始（再開）する。
   * 既に動作中なら何もしない。
   */
  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
  };

  /**
   * 計測を一時停止する。再開時に時間は継続される。
   */
  const stop = () => {
    if (!isRunning) return;
    setIsRunning(false);
  };

  /**
   * 計測時間を完全にリセットする。停止状態に戻る。
   */
  const reset = () => {
    setIsRunning(false);
    setElapsedMs(0);
    startAtRef.current = null;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
  };

  return { elapsedMs, isRunning, start, stop, reset };
}

/**
 * ミリ秒を mm:ss 形式に整形するユーティリティ。
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
