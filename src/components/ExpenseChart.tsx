import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Expense } from '../types/expense';

type ExpenseChartProps = {
  expenses: Expense[];
};

/**
 * カテゴリーごとのカラーパレット定義
 */
const CATEGORY_COLORS: Record<string, string> = {
  食費: 'orange',
  日用品: 'cyan',
  交通費: 'blue',
  水道光熱費: 'yellow',
  通信費: 'purple',
  交際費: 'pink',
  娯楽費: 'green',
  教育費: 'navy',
  医療費: 'red',
  美容費: 'magenta',
};

const DEFAULT_COLOR = '#94a3b8';

type CategoryStat = {
  name: string;
  value: number;
  percentage: number;
  color: string;
};

/**
 * 【グラフ・分析機能】カテゴリー別支出をドーナツグラフおよびランキングで表示するコンポーネント
 */
export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // カテゴリーごとの合計金額・比率を計算し、降順ソート
  const { chartData, totalAmount } = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);

    const totalsByCategory = expenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    const stats: CategoryStat[] = Object.entries(totalsByCategory)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
        color: CATEGORY_COLORS[name] || DEFAULT_COLOR,
      }))
      .sort((a, b) => b.value - a.value);

    return { chartData: stats, totalAmount: total };
  }, [expenses]);

  // データが0件の場合の空表示
  if (expenses.length === 0 || totalAmount === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl mb-3 text-slate-400">
          📊
        </div>
        <p className="text-slate-600 font-bold text-sm mb-1">
          支出データがありません
        </p>
        <p className="text-slate-400 text-xs">
          支出を登録すると、カテゴリー別の分析グラフが表示されます。
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 flex flex-col gap-4">
      {/* 1. ドーナツチャートカード */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">カテゴリー別支出割合</span>
          <span className="text-[11px] text-slate-400">全 {chartData.length} カテゴリー</span>
        </div>

        {/* チャート本体 (中央に合計額を表示) */}
        <div className="relative w-full h-56 flex items-center justify-center">
          {/* ドーナツ中央の総支出ラベル（ツールチップの下に隠れるよう背面に配置） */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
            <span className="text-[10px] font-semibold text-slate-400">今月の総支出</span>
            <span className="text-base font-extrabold text-slate-800">
              ¥{totalAmount.toLocaleString()}
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%" className="relative z-10">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`¥${Number(value).toLocaleString()}`, '金額']}
                labelStyle={{ color: '#000000', fontWeight: 'bold' }}
                itemStyle={{ color: '#000000', fontWeight: '600' }}
                wrapperStyle={{ zIndex: 1000 }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. カテゴリー別ランキングリスト */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">カテゴリー別詳細・ランキング</span>
          <span className="text-[11px] text-slate-400">支出の多い順</span>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                {/* 順位 & カテゴリー名 */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${index === 0
                      ? 'bg-amber-100 text-amber-600'
                      : index === 1
                        ? 'bg-slate-200 text-slate-600'
                        : index === 2
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                  >
                    {index + 1}
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>

                {/* 金額 & 割合 */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">
                    ¥{item.value.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 w-9 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
