import { useState } from 'react';
import { AccountSummary } from './components/AccountSummary';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import { Calendar } from './components/Calendar';
import { MOCK_EXPENSES, INITIAL_BUDGET } from './data/mockExpenses';
import { getDayFromDate } from './utils/date';
import type { Expense, NewExpense } from './types/expense';

function App() {
  // 1. 支出リストの状態管理（初期値: モックデータ）
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);

  // 2. 現在の画面表示（'list': 一覧画面, 'calendar': カレンダー画面）
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');

  // 3. カレンダーで選択されている日付（初期値: 当日）
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // 対象年月（2026年8月）
  const currentYear = 2026;
  const currentMonth = 8;

  // 4. 今月の総支出額を算出
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  // 5. 残高の計算（初期予算 - 総支出額）
  const balance = INITIAL_BUDGET - totalExpense;

  // 6. 日別の支出合計額を計算（カレンダー表示用: { 17: 3680, 18: 1540 }）
  const dailyTotals = expenses.reduce<Record<number, number>>((totals, item) => {
    const day = getDayFromDate(item.date);
    totals[day] = (totals[day] || 0) + item.amount;
    return totals;
  }, {});

  // 7. カレンダーで選択した日付の支出のみを抽出（フィルタリング）
  const selectedExpenses = expenses.filter(
    (item) => getDayFromDate(item.date) === selectedDay
  );

  // 8. 新規支出の追加処理
  const handleAddExpense = (newExpenseData: NewExpense) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: Date.now().toString(), // 一意のIDを自動生成
    };
    setExpenses([newExpense, ...expenses]);
    // 追加した支出の日付を選択状態に更新
    setSelectedDay(getDayFromDate(newExpense.date));
  };

  // 9. 支出の削除処理
  const handleDeleteExpense = (idToDelete: string) => {
    setExpenses(expenses.filter((item) => item.id !== idToDelete));
  };

  // 10. 画面表示の切り替え（一覧 ⇔ カレンダー）
  const handleToggleView = () => {
    setCurrentView(currentView === 'list' ? 'calendar' : 'list');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-0 sm:py-6">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] shadow-2xl flex flex-col rounded-none sm:rounded-3xl overflow-hidden">
        {/* 上部ヘッダー（残高・総支出・画面切り替えボタン） */}
        <AccountSummary
          totalExpense={totalExpense}
          balance={balance}
          currentView={currentView}
          onToggleView={handleToggleView}
        />

        {/* 画面の条件付きレンダリング */}
        {currentView === 'list' ? (
          <>
            {/* 【取引一覧画面】 */}
            <div className="flex-1 overflow-y-auto">
              <ExpenseList
                expenses={expenses}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </>
        ) : (
          /* 【カレンダー画面】 */
          <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
            {/* カレンダーコンポーネント */}
            <Calendar
              year={currentYear}
              month={currentMonth}
              selectedDay={selectedDay}
              dailyTotals={dailyTotals}
              onSelectDay={setSelectedDay}
            />

            {/* 選択した日付の支出一覧 */}
            <div className="flex-1 px-2 pb-4">
              <div className="px-3 py-1 text-xs font-bold text-slate-500">
                📅 {currentMonth}月 {selectedDay}日 の支出 ({selectedExpenses.length}件)
              </div>
              <ExpenseList
                expenses={selectedExpenses}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;