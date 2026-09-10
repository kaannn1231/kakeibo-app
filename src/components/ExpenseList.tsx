import type { Expense } from '../types/expense';
import { ExpenseItem } from './ExpenseItem';

type ExpenseListProps = {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
};

/**
 * 支出データ一覧を表示するコンポーネント
 */
export function ExpenseList({ expenses, onEditExpense, onDeleteExpense }: ExpenseListProps) {
  // 支出データが0件の場合
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">
        登録された支出がありません。
      </div>
    );
  }

  // 支出データが存在する場合
  return (
    <div className="flex flex-col gap-2.5 p-4">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="font-bold text-slate-700 text-sm">最近の履歴</span>
        <span className="text-xs text-slate-400 font-medium">合計 {expenses.length}件</span>
      </div>

      {expenses.map((item) => (
        <ExpenseItem
          key={item.id}
          expense={item}
          onEditExpense={onEditExpense}
          onDeleteExpense={onDeleteExpense}
        />
      ))}
    </div>
  );
}