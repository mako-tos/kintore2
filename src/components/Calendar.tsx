import React, { useMemo, useState } from "react";
import { TrainingRecord } from "@/types/training-record";
import { RecordsByDate } from "@/types/calendar";
import {
  generateCalendarGrid,
  formatDateKey,
  formatMonthYear,
} from "@/utils/calendar";
import CalendarDay from "./CalendarDay";
import RecordPopup from "./RecordPopup";

interface CalendarProps {
  year: number;
  month: number;
  records: TrainingRecord[];
  onMonthChange: (year: number, month: number) => void;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/**
 * メインカレンダーコンポーネント
 * 月間カレンダーの表示、記録データの管理、ポップアップ制御を担当
 */
export const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  records,
  onMonthChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 記録を日付ごとにグループ化
  const recordsByDate: RecordsByDate = useMemo(() => {
    const grouped: RecordsByDate = {};
    records.forEach((record) => {
      const dateKey = record.training_at.slice(0, 10); // YYYY-MM-DD
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(record);
    });
    return grouped;
  }, [records]);

  // 記録がある日付のSetを作成
  const recordDates = useMemo(() => {
    return new Set(Object.keys(recordsByDate));
  }, [recordsByDate]);

  // カレンダーグリッドを生成
  const weeks = useMemo(() => {
    return generateCalendarGrid(year, month, recordDates);
  }, [year, month, recordDates]);

  // 前月へ移動
  const handlePrevMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  // 次月へ移動
  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  // 次月ボタンの有効/無効判定（現在月を超えて進めない）
  const isNextMonthDisabled = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    return year === currentYear && month === currentMonth;
  }, [year, month]);

  // 日付セルクリック時の処理
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  // ポップアップを閉じる
  const handleClosePopup = () => {
    setSelectedDate(null);
  };

  // 選択日の記録を取得
  const selectedRecords = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = formatDateKey(selectedDate);
    return recordsByDate[dateKey] || [];
  }, [selectedDate, recordsByDate]);

  return (
    <div className="calendar-container">
      {/* ヘッダー: 年月表示 + 前月/次月ボタン */}
      <div className="calendar-header">
        <button
          className="pure-button calendar-nav-button"
          onClick={handlePrevMonth}
          aria-label="前月"
        >
          ◀ 前月
        </button>
        <h2 className="calendar-title">{formatMonthYear(year, month)}</h2>
        <button
          className="pure-button calendar-nav-button"
          onClick={handleNextMonth}
          disabled={isNextMonthDisabled}
          aria-label="次月"
        >
          次月 ▶
        </button>
      </div>

      {/* カレンダーグリッド */}
      <table className="calendar-table pure-table">
        <thead>
          <tr>
            {WEEKDAYS.map((day, index) => (
              <th key={index} className="calendar-weekday">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <CalendarDay
                  key={dayIndex}
                  day={day}
                  onClick={handleDayClick}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ポップアップ */}
      {selectedDate && selectedRecords.length > 0 && (
        <RecordPopup
          date={selectedDate}
          records={selectedRecords}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Calendar;
