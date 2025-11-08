import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../lib/api-client';

interface TrainingMenu { id: string; name: string; }

export default function HomePage() {
  const [menus, setMenus] = useState<TrainingMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.get<TrainingMenu[]>('/api/training-menus');
        setMenus(data);
      } catch (e: any) {
        setError(e?.message || 'メニュー取得に失敗しました');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>キントレ</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <Link href="/training-menus/new" className="pure-button pure-button-primary" style={{ marginRight: '0.5rem' }}>メニュー追加</Link>
        <Link href="/training-records/new" className="pure-button">記録入力</Link>
        <Link href="/health" className="pure-button">Health</Link>
      </nav>
      <section>
        <h2>登録済みメニュー</h2>
        {loading && <p>読み込み中...</p>}
        {error && <p style={{ color: '#b00020' }}>{error}</p>}
        {!loading && menus.length === 0 && <p>まだメニューがありません。</p>}
        <ul>
          {menus.map(m => (
            <li key={m.id}>{m.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}