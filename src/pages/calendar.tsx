import React, { useEffect, useState } from "react";
import { TrainingRecord } from "@/types/training-record";
import { apiClient } from "@/lib/api-client";
import Calendar from "@/components/Calendar";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

/**
 * カレンダー表示ページ
 * トレーニング記録を月次カレンダー形式で表示
 */
export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 記録データを取得
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);

      try {
        // 月の開始日と終了日を計算
        const fromDate = new Date(year, month - 1, 1);
        const toDate = new Date(year, month, 0); // 月末日

        const fromDateStr = fromDate.toISOString().slice(0, 10);
        const toDateStr = toDate.toISOString().slice(0, 10);

        // API からデータ取得
        const result = await apiClient.get<{
          records: TrainingRecord[];
          total: number;
        }>(
          `/api/training-records?fromDate=${fromDateStr}&toDate=${toDateStr}&limit=500`
        );

        setRecords(result.records);
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = e as any;
        setError(err.message || "データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [year, month]);

  // 月変更ハンドラ
  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="calendar-page">
      <h1 className="page-title">カレンダー</h1>

      {loading && <LoadingSpinner label="読み込み中..." />}

      {error && (
        <ErrorMessage errors={[{ field: "calendar", message: error }]} />
      )}

      {!loading && !error && (
        <Calendar
          year={year}
          month={month}
          records={records}
          onMonthChange={handleMonthChange}
        />
      )}
    </div>
  );
}
