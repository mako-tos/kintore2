import { useEffect, useRef, useState } from 'react';

export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    startAtRef.current = performance.now() - elapsedMs;

    const tick = () => {
      if (startAtRef.current != null) {
        setElapsedMs(performance.now() - startAtRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
  };

  const stop = () => {
    if (!isRunning) return;
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedMs(0);
    startAtRef.current = null;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
  };

  return { elapsedMs, isRunning, start, stop, reset };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
