/* eslint @typescript-eslint/ban-ts-comment: off */
import React from 'react';
import { render, act } from '@testing-library/react';
import { useTimer, formatDuration } from '../useTimer';

const TimerHarness: React.FC<{ expose: (api: ReturnType<typeof useTimer>) => void }> = ({ expose }) => {
  const api = useTimer();
  React.useEffect(() => { expose(api); }, [api, expose]);
  return null;
};

describe('useTimer', () => {
  let rafCb: FrameRequestCallback | null = null;
  let now = 0;
  beforeEach(() => {
    now = 0;
    // @ts-ignore
    global.performance = { now: () => now };
    // @ts-ignore
    global.requestAnimationFrame = (cb: FrameRequestCallback) => { rafCb = cb; return 1; };
    // @ts-ignore
    global.cancelAnimationFrame = () => {};
  });

  test('start/advance/stop/reset', () => {
    let api: ReturnType<typeof useTimer> | null = null;
    render(<TimerHarness expose={a => (api = a)} />);
    expect(api).not.toBeNull();
    expect(api!.isRunning).toBe(false);
    expect(api!.elapsedMs).toBe(0);

  act(() => api!.start());
  expect(api!.isRunning).toBe(true);

  // Simulate a series of RAF ticks and ensure elapsed increases
  act(() => { now = 0; rafCb && rafCb(now); });
  const after0 = api!.elapsedMs;
  act(() => { now = 500; rafCb && rafCb(now); });
  const after500 = api!.elapsedMs;
  act(() => { now = 1000; rafCb && rafCb(now); });
  const after1000 = api!.elapsedMs;
  act(() => { now = 1500; rafCb && rafCb(now); });
  const after1500 = api!.elapsedMs;
  expect(after500).toBeGreaterThanOrEqual(after0);
  expect(after1000).toBeGreaterThanOrEqual(after500);
  expect(after1500).toBeGreaterThanOrEqual(after1000);

    act(() => api!.stop());
    expect(api!.isRunning).toBe(false);

    act(() => api!.reset());
    expect(api!.elapsedMs).toBe(0);
  });

  test('formatDuration', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(59000)).toBe('00:59');
    expect(formatDuration(61000)).toBe('01:01');
  });
});
