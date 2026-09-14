import { useEffect, useState } from 'react';
import { AccountSummary } from './components/AccountSummary';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import { EditExpenseModal } from './components/EditExpenseModal';
import { Calendar } from './components/Calendar';
import { INITIAL_BUDGET } from './data/mockExpenses';
import { getDayFromDate } from './utils/date';
import type { Expense, NewExpense } from './types/expense';
import { expenseApi } from './api/expenses';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  // 【修正機能】現在編集中の支出データ（nullの場合はモーダル非表示）
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const currentYear = 2026;
  const currentMonth = 8;

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setExpenses(await expenseApi.list());
      } catch (error) {
        console.error(error);
        alert('サーバーから支出一覧を取得できませんでした。');
      }
    };

    loadExpenses();
  }, []);

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = INITIAL_BUDGET - totalExpense;

  const dailyTotals = expenses.reduce<Record<number, number>>((totals, item) => {
    const day = getDayFromDate(item.date);
    totals[day] = (totals[day] || 0) + item.amount;
    return totals;
  }, {});

  const selectedExpenses = expenses.filter(
    (item) => getDayFromDate(item.date) === selectedDay
  );

  const handleAddExpense = async (newExpenseData: NewExpense) => {
    try {
      const expense = await expenseApi.create(newExpenseData);

      setExpenses((currentExpenses) => [expense, ...currentExpenses]);
      setSelectedDay(getDayFromDate(expense.date));
    } catch (error) {
      console.error(error);
      alert('支出の保存に失敗しました。サーバーが起動しているか確認してください。');
    }
  };

  // 【修正機能】既存支出データの更新処理
  const handleUpdateExpense = async (idToUpdate: string, updatedData: NewExpense) => {
    try {
      const updated = await expenseApi.update(idToUpdate, updatedData);

      setExpenses((currentExpenses) =>
        currentExpenses.map((item) => (item.id === idToUpdate ? updated : item))
      );
    } catch (error) {
      console.error(error);
      alert('支出の更新に失敗しました。');
      throw error;
    }
  };

  const handleDeleteExpense = async (idToDelete: string) => {
    try {
      await expenseApi.remove(idToDelete);

      setExpenses((currentExpenses) =>
        currentExpenses.filter((item) => item.id !== idToDelete)
      );
    } catch (error) {
      console.error(error);
      alert('支出の削除に失敗しました。');
    }
  };

  const handleToggleView = () => {
    setCurrentView(currentView === 'list' ? 'calendar' : 'list');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-0 sm:py-6">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] shadow-2xl flex flex-col rounded-none sm:rounded-3xl overflow-hidden relative">
        <AccountSummary
          totalExpense={totalExpense}
          balance={balance}
          currentView={currentView}
          onToggleView={handleToggleView}
        />

        {currentView === 'list' ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <ExpenseList
                expenses={expenses}
                onEditExpense={(item) => setEditingExpense(item)}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
            <Calendar
              year={currentYear}
              month={currentMonth}
              selectedDay={selectedDay}
              dailyTotals={dailyTotals}
              onSelectDay={setSelectedDay}
            />

            <div className="flex-1 px-2 pb-4">
              <div className="px-3 py-1 text-xs font-bold text-slate-500">
                📅 {currentMonth}月 {selectedDay}日 の支出 ({selectedExpenses.length}件)
              </div>
              <ExpenseList
                expenses={selectedExpenses}
                onEditExpense={(item) => setEditingExpense(item)}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </div>
        )}

        {/* 【修正機能】編集モーダル */}
        {editingExpense && (
          <EditExpenseModal
            expense={editingExpense}
            onClose={() => setEditingExpense(null)}
            onSave={handleUpdateExpense}
          />
        )}
      </div>
    </div>
  );
}

export default App;

