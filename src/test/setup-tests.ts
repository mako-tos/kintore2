/* eslint @typescript-eslint/no-explicit-any: off */
import '@testing-library/jest-dom';

// Optional: generic fetch polyfill if needed (node 18+ has fetch)
// If more global mocks are required (e.g., matchMedia), add them here.

// Silence console errors for known noisy React act warnings in tests (optional)
const originalError = console.error;
console.error = (...args: any[]) => {
  if (/Warning.*not wrapped in act/.test(args[0])) return;
  originalError(...args);
};
