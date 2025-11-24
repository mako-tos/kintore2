import React from "react";
import { CalendarDay as CalendarDayType } from "@/types/calendar";

interface CalendarDayProps {
  day: CalendarDayType;
  onClick: (date: Date) => void;
}

/**
 * カレンダーの日付セルコンポーネント
 * 日付番号、⭐マーク、ハイライト表示を担当
 */
export const CalendarDay: React.FC<CalendarDayProps> = ({ day, onClick }) => {
  const handleClick = () => {
    // 当月かつ記録がある場合のみクリック可能
    if (day.isCurrentMonth && day.hasRecords) {
      onClick(day.date);
    }
  };

  const classNames = ["calendar-day"];

  if (!day.isCurrentMonth) {
    classNames.push("calendar-day-other-month");
  }

  if (day.isToday) {
    classNames.push("calendar-day-today");
  }

  if (day.hasRecords && day.isCurrentMonth) {
    classNames.push("calendar-day-has-records");
  }

  // 土曜日・日曜日の判定
  const dayOfWeek = day.date.getDay();
  if (dayOfWeek === 0) {
    classNames.push("calendar-day-sunday");
  } else if (dayOfWeek === 6) {
    classNames.push("calendar-day-saturday");
  }

  return (
    <td className={classNames.join(" ")} onClick={handleClick}>
      <div className="calendar-day-content">
        <span className="calendar-day-number">{day.date.getDate()}</span>
        {day.hasRecords && day.isCurrentMonth && (
          <span className="calendar-day-star">⭐</span>
        )}
      </div>
    </td>
  );
};

export default CalendarDay;
