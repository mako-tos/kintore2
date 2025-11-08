/* eslint @typescript-eslint/no-explicit-any: off */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useTrainingRecordForm } from '../useTrainingRecordForm';

const Harness: React.FC<{ onRef: (api: any) => void }> = ({ onRef }) => {
  const api = useTrainingRecordForm({ onAutoSave: async () => true });
  React.useEffect(() => { onRef(api); }, [api]);
  return (
    <div>
      <button onClick={() => api.setMenuId('m1')}>setM1</button>
      <button onClick={() => api.handleStart()}>start</button>
      <button onClick={() => api.handleStop()}>stop</button>
      <button onClick={() => api.handleMenuChange('m2')}>switchM2</button>
      <div aria-label="count">{api.count}</div>
      <div aria-label="isRunning">{String(api.isRunning)}</div>
      <div aria-label="menuId">{api.menuId}</div>
    </div>
  );
};

describe('useTrainingRecordForm', () => {
  test('start increments count and toggles running', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let api: any;
    render(<Harness onRef={a => (api = a)} />);
    act(() => fireEvent.click(screen.getByText('setM1')));
    expect(screen.getByLabelText('menuId').textContent).toBe('m1');
    expect(screen.getByLabelText('count').textContent).toBe('0');
    expect(screen.getByLabelText('isRunning').textContent).toBe('false');
    act(() => fireEvent.click(screen.getByText('start')));
    expect(screen.getByLabelText('count').textContent).toBe('1');
    expect(screen.getByLabelText('isRunning').textContent).toBe('true');
  });

  test('menu change triggers autosave; failure prevents switch', async () => {
    const HarnessFail: React.FC = () => {
      const api = useTrainingRecordForm({ onAutoSave: async () => false });
      return (
        <div>
          <button onClick={() => api.setMenuId('m1')}>setM1</button>
          <button onClick={() => api.handleStart()}>start</button>
          <button onClick={() => api.handleMenuChange('m2')}>switchM2</button>
          <div aria-label="menuId">{api.menuId}</div>
          <div aria-label="count">{api.count}</div>
        </div>
      );
    };
    render(<HarnessFail />);
    act(() => fireEvent.click(screen.getByText('setM1')));
    act(() => fireEvent.click(screen.getByText('start')));
    expect(screen.getByLabelText('count').textContent).toBe('1');
    await act(async () => { fireEvent.click(screen.getByText('switchM2')); });
    // switch should be prevented
    expect(screen.getByLabelText('menuId').textContent).toBe('m1');
    expect(screen.getByLabelText('count').textContent).toBe('1');
  });
});
