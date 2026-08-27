import { getDaysInMonth, getFirstWeekDay } from '../utils/date';

const WEEK_DAYS = ['日', '月', '火', '水', '木', '金', '土'];

type CalendarProps = {
  year: number;
  month: number;
  selectedDay: number;
  dailyTotals: Record<number, number>; // 日別支出合計（例: { 17: 3680 }）
  onSelectDay: (day: number) => void;
};

/**
 * 月間カレンダーおよび日別支出額を表示するコンポーネント
 */
export function Calendar({
  year,
  month,
  selectedDay,
  dailyTotals,
  onSelectDay,
}: CalendarProps) {
  // 1日開始前の空白マス配列
  const emptyDays = Array.from({ length: getFirstWeekDay(year, month) });

  // 1日から月末までの日数配列
  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 m-4">
      {/* カレンダーヘッダー */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-bold text-slate-800">
          {year}年 {month}月
        </h2>
        <span className="text-xs text-slate-400 font-medium">日付を選んで支出を確認</span>
      </div>

      {/* 7列グリッド */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* 曜日ヘッダー（日〜土） */}
        {WEEK_DAYS.map((w, idx) => (
          <div
            key={w}
            className={`py-1 text-xs font-semibold ${
              idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-blue-500' : 'text-slate-400'
            }`}
          >
            {w}
          </div>
        ))}

        {/* 1日前の空白マス */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-14" />
        ))}

        {/* 日付ボタン一覧 */}
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const total = dailyTotals[day]; // 当日の支出合計

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`h-14 rounded-xl flex flex-col items-center justify-between py-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              {/* 日にち */}
              <span className="text-xs">{day}</span>

              {/* 日別支出額表示 */}
              <span
                className={`text-[9px] font-semibold truncate px-0.5 ${
                  isSelected
                    ? 'text-blue-100'
                    : total
                    ? 'text-rose-500'
                    : 'text-transparent'
                }`}
              >
                {total ? `-${total.toLocaleString()}` : '-'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}