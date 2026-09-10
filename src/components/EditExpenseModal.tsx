import { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import type { Category } from '../constants/categories';
import type { Expense, NewExpense } from '../types/expense';
import { X } from 'lucide-react';

type EditExpenseModalProps = {
  expense: Expense;
  onClose: () => void;
  onSave: (id: string, updatedData: NewExpense) => Promise<void>;
};

/**
 * [수정 기능] 선택된 지출 항목을 수정하기 위한 모달 팝업 컴포넌트
 */
export function EditExpenseModal({ expense, onClose, onSave }: EditExpenseModalProps) {
  const [date, setDate] = useState(expense.date);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState<Category>(expense.category);
  const [description, setDescription] = useState(expense.description);
  const [paymentMethod, setPaymentMethod] = useState(expense.paymentMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!description.trim() || numericAmount <= 0) {
      alert('내용과 금액(1원 이상)을 올바르게 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(expense.id, {
        date,
        amount: numericAmount,
        category,
        description: description.trim(),
        paymentMethod,
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert('지출 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            ✏️ 支出の修正 (지출 수정)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 모달 본문 폼 */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          {/* 1행: 날짜 & 카테고리 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">카테고리</label>
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

          {/* 2행: 내용 & 금액 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">내용・가게명</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">금액 (円)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* 3행: 결제 수단 */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">결제 방법</label>
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

          {/* 모달 하단 버튼 */}
          <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-xs transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
