import { CalendarDay } from "@/types/calendar";

/**
 * 指定年月の日数を取得
 * @param year 年（例: 2025）
 * @param month 月（1-12）
 * @returns その月の日数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 指定年月の1日の曜日を取得
 * @param year 年（例: 2025）
 * @param month 月（1-12）
 * @returns 曜日（0=日曜日, 6=土曜日）
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/**
 * カレンダーグリッド（週×日）を生成
 * 前月・次月の埋め日を含む完全なグリッドを返す
 * @param year 年（例: 2025）
 * @param month 月（1-12）
 * @param recordDates 記録がある日付のSet（YYYY-MM-DD形式）
 * @returns カレンダーの日付配列（週×7日）
 */
export function generateCalendarGrid(
  year: number,
  month: number,
  recordDates: Set<string> = new Set()
): CalendarDay[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);

  // 前月の日数
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  // 前月の埋め日
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth - 1, day);
    const dateKey = formatDateKey(date);
    currentWeek.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isPast: date < today,
      hasRecords: recordDates.has(dateKey),
    });
  }

  // 当月の日付
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateKey = formatDateKey(date);
    const isToday = date.getTime() === today.getTime();

    currentWeek.push({
      date,
      isCurrentMonth: true,
      isToday,
      isPast: date < today,
      hasRecords: recordDates.has(dateKey),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // 次月の埋め日
  if (currentWeek.length > 0) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    let day = 1;

    while (currentWeek.length < 7) {
      const date = new Date(nextYear, nextMonth - 1, day);
      const dateKey = formatDateKey(date);
      currentWeek.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isPast: date < today,
        hasRecords: recordDates.has(dateKey),
      });
      day++;
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Date オブジェクトを YYYY-MM-DD 形式の文字列に変換
 * @param date 日付
 * @returns YYYY-MM-DD 形式の文字列
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 日付を YYYY年MM月DD日 形式でフォーマット
 * @param date 日付
 * @returns YYYY年MM月DD日 形式の文字列
 */
export function formatDateDisplay(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 年月を YYYY年MM月 形式でフォーマット
 * @param year 年
 * @param month 月（1-12）
 * @returns YYYY年MM月 形式の文字列
 */
export function formatMonthYear(year: number, month: number): string {
  return `${year}年${month}月`;
}
