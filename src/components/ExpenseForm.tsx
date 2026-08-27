import { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import type { Category } from '../constants/categories';
import type { NewExpense } from '../types/expense';

type ExpenseFormProps = {
  onAddExpense: (expense: NewExpense) => void;
};

/**
 * 新規支出を入力・登録するフォームコンポーネント
 */
export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  // 入力フォームの状態管理
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // 当日日付
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('現金');

  // 送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 画面リロードを防止

    const numericAmount = Number(amount);
    if (!description.trim() || numericAmount <= 0) {
      alert('内容と金額（1円以上）を正しく入力してください。');
      return;
    }

    // 親コンポーネントへ新規データを伝達
    onAddExpense({
      date,
      amount: numericAmount,
      category,
      description: description.trim(),
      paymentMethod,
    });

    // 入力欄の初期化
    setDescription('');
    setAmount('');
  };

  return (
    <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto">
      <h3 className="text-sm font-bold text-slate-700 mb-3">
        ➕ 支出を追加
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* 1行目: 日付 & カテゴリー */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">カテゴリー</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2行目: 支出内容 & 金額 */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">内容・店名</label>
            <input
              type="text"
              placeholder="例: ランチ"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">金額 (円)</label>
            <input
              type="number"
              min="1"
              placeholder="例: 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* 3行目: 支払い方法選択ボタン */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">支払い方法</label>
          <div className="flex gap-1.5">
            {['現金', 'カード', '電子マネー'].map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                  paymentMethod === method
                    ? 'bg-blue-600 border-blue-600 text-white font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* 追加ボタン */}
        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow transition-colors cursor-pointer mt-1"
        >
          追加する
        </button>
      </form>
    </div>
  );
}