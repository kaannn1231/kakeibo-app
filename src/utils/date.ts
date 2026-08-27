/**
 * 指定した年月の総日数を取得する。（例: 8月 ➔ 31日）
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 指定した年月の1日が何曜日かを0（日曜）〜6（土曜）の数値で取得する。
 */
export function getFirstWeekDay(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/**
 * YYYY-MM-DD形式の日付文字列から「日」の数値を取り出す。（例: "2026-08-17" ➔ 17）
 */
export function getDayFromDate(dateStr: string): number {
  return Number(dateStr.split('-')[2]);
}