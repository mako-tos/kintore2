import { render, act } from '@testing-library/react';
import React from 'react';
import { useTimer, formatDuration } from '../useTimer';

// Helper component to drive the hook
const TimerHarness: React.FC<{ onRef: (api: any) => void }> = ({ onRef }) => {
  const api = useTimer();
  React.useEffect(() => {
    onRef(api);
  }, [api]);
  return null;
};

describe('useTimer', () => {
  let rafCb: FrameRequestCallback | null = null;
  let now = 0;

  beforeEach(() => {
    now = 0;
    // mock performance.now
    // @ts-ignore
    global.performance = { now: () => now } as any;
    // mock RAF to call immediately and allow manual advancing
    // @ts-ignore
    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      rafCb = cb;
      return 1 as any;
    };
    // @ts-ignore
    global.cancelAnimationFrame = () => {};
  });

  test('start, advance time, stop, reset', () => {
    let api: any;
    render(React.createElement(TimerHarness, { onRef: (a: any) => (api = a) }));

    expect(api.isRunning).toBe(false);
    expect(api.elapsedMs).toBe(0);

    act(() => api.start());
    expect(api.isRunning).toBe(true);

    // advance 1ms
    act(() => {
      rafCb && rafCb(0 as any);
    });
    expect(api.elapsedMs).toBeGreaterThan(0);

    act(() => api.stop());
    expect(api.isRunning).toBe(false);

    act(() => api.reset());
    expect(api.elapsedMs).toBe(0);
  });

  test('formatDuration mm:ss', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(59000)).toBe('00:59');
    expect(formatDuration(61000)).toBe('01:01');
  });
});
