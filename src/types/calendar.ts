import { TrainingRecord } from "./training-record";

/**
 * カレンダーの1日を表す型
 */
export interface CalendarDay {
  /** 日付（Date オブジェクト） */
  date: Date;
  /** 表示中の月に属する日付かどうか */
  isCurrentMonth: boolean;
  /** 今日かどうか */
  isToday: boolean;
  /** 過去の日付かどうか */
  isPast: boolean;
  /** トレーニング記録があるかどうか */
  hasRecords: boolean;
}

/**
 * 日付ごとの記録を集約した型
 * キー: YYYY-MM-DD 形式の文字列
 * 値: その日の記録配列
 */
export type RecordsByDate = Record<string, TrainingRecord[]>;

/**
 * 年月を表す型
 */
export interface MonthYear {
  year: number;
  month: number; // 1-12
}
