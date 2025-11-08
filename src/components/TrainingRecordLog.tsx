import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client';
import ErrorMessage from './ErrorMessage';

interface MenuLogEntry {
  menuId: string;
  menuName: string;
  count: number;
}

interface ApiRecord {
  id: string;
  training_menu_id: string;
  training_at: string;
  count: number;
  training_menus?: { name: string };
}

interface Props {
  date: string; // YYYY-MM-DD
  refreshSignal?: number; // increment to force reload
  localNewEntry?: { menuId: string; menuName: string; count: number } | null;
}

// Aggregates records by menuId
function aggregate(records: ApiRecord[]): MenuLogEntry[] {
  const map = new Map<string, MenuLogEntry>();
  for (const r of records) {
    const name = r.training_menus?.name || r.training_menu_id;
    if (map.has(r.training_menu_id)) {
      map.get(r.training_menu_id)!.count += r.count;
    } else {
      map.set(r.training_menu_id, { menuId: r.training_menu_id, menuName: name, count: r.count });
    }
  }
  return Array.from(map.values());
}

export const TrainingRecordLog: React.FC<Props> = ({ date, refreshSignal, localNewEntry }) => {
  const [entries, setEntries] = useState<MenuLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.get<{ records: ApiRecord[]; total: number }>(`/api/training-records?fromDate=${date}&toDate=${date}&limit=500`);
        setEntries(aggregate(result.records));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e?.message || '記録の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    })();
  }, [date, refreshSignal]);

  // Merge local new entry (auto-save optimistic update)
  useEffect(() => {
    if (!localNewEntry) return;
    setEntries(prev => {
      const existing = prev.find(p => p.menuId === localNewEntry.menuId);
      if (existing) {
        return prev.map(p => p.menuId === localNewEntry.menuId ? { ...p, count: p.count + localNewEntry.count } : p);
      }
      return [...prev, localNewEntry];
    });
  }, [localNewEntry]);

  return (
    <section style={{ marginTop: '1.5rem' }}>
      <h2>本日の記録</h2>
      {loading && <p>読み込み中...</p>}
      {error && <ErrorMessage errors={[{ field: 'log', message: error }]} />}
      {!loading && entries.length === 0 && !error && <p>まだ記録がありません。</p>}
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {entries.map(e => (
          <li key={e.menuId} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '4px 0' }}>
            <span>{e.menuName}</span>
            <strong>{e.count} 回</strong>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrainingRecordLog;