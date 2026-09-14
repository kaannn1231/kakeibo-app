import { Trash2, Pencil } from 'lucide-react';
import type { Expense } from '../types/expense';

type ExpenseItemProps = {
  expense: Expense;
  onEditExpense: (expense: Expense) => void; // 修正処理関数
  onDeleteExpense: (id: string) => void; // 削除処理関数
};

/**
 * 支出データ1件分をカード形式で表示するコンポーネント
 */
export function ExpenseItem({ expense, onEditExpense, onDeleteExpense }: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
      {/* 左側: 支出内容、日付、支払い方法 */}
      <div className="flex flex-col">
        <span className="font-semibold text-slate-800 text-sm">
          {expense.description}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400">
            {expense.date}
          </span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
            {expense.paymentMethod}
          </span>
        </div>
      </div>

      {/* 右側: 金額、カテゴリー、操作ボタン（編集・削除） */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="font-bold text-rose-500 text-base">
            -¥{expense.amount.toLocaleString()}
          </span>
          <span className="text-[11px] text-blue-600 font-medium mt-0.5">
            {expense.category}
          </span>
        </div>

        {/* 操作ボタン領域（編集・削除） */}
        <div className="flex items-center gap-1">
          {/* 【編集ボタン】 */}
          <button
            type="button"
            onClick={() => onEditExpense(expense)}
            className="text-slate-300 hover:text-blue-500 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            title="編集"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* 【削除ボタン】 */}
          <button
            type="button"
            onClick={() => onDeleteExpense(expense.id)}
            className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="削除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}