/* eslint @typescript-eslint/no-explicit-any: off */
/* eslint @typescript-eslint/ban-ts-comment: off */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrainingMenuForm from '../../components/TrainingMenuForm';

// Simple fetch mock
const menus = [{ id: '1', name: 'スクワット' }];

beforeEach(() => {
  // @ts-ignore
  global.fetch = jest.fn((url: string, opts?: any) => {
    if (url.includes('/api/training-menus') && (!opts || opts.method === 'GET')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(menus) });
    }
    if (url.includes('/api/training-menus') && opts?.method === 'POST') {
      const body = JSON.parse(opts.body);
      if (body.name === 'スクワット') {
        return Promise.resolve({ ok: false, status: 409, json: () => Promise.resolve({ message: 'Duplicate' }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: '2', name: body.name }) });
    }
    return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({ message: 'Not Found' }) });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('TrainingMenuForm', () => {
  test('renders input and buttons', () => {
    render(<TrainingMenuForm />);
    expect(screen.getByLabelText('メニュー名')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument();
  });

  test('validation error on empty submit', async () => {
    render(<TrainingMenuForm />);
    const submit = screen.getByRole('button', { name: '登録' });
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);
    await waitFor(() => {
      expect(screen.getByText('メニュー名は必須です')).toBeInTheDocument();
    });
  });

  test('duplicate name shows error', async () => {
    render(<TrainingMenuForm />);
    const input = screen.getByLabelText('メニュー名');
    const submit = screen.getByRole('button', { name: '登録' });
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.change(input, { target: { value: 'スクワット' } });
    fireEvent.click(submit);
    await waitFor(() => {
      expect(screen.getByText('この名前は既に登録されています')).toBeInTheDocument();
    });
  });

  test('successful submit resets form', async () => {
    render(<TrainingMenuForm />);
    const input = screen.getByLabelText('メニュー名');
    const submit = screen.getByRole('button', { name: '登録' });
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.change(input, { target: { value: '腹筋' } });
    fireEvent.click(submit);
    await waitFor(() => {
      expect(screen.getByText('メニューを登録しました')).toBeInTheDocument();
    });
    expect((input as HTMLInputElement).value).toBe('');
  });
});
