import { useEffect, useState } from 'react';
import { AccountSummary } from './components/AccountSummary';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import { Calendar } from './components/Calendar';
import { INITIAL_BUDGET } from './data/mockExpenses';
import { getDayFromDate } from './utils/date';
import type { Category } from './constants/categories';
import type { Expense, NewExpense } from './types/expense';

const API_URL = 'http://localhost:3001/api/expenses';

type ApiExpense = Omit<Expense, 'date' | 'category'> & {
  date: string;
  category: string;
};

function toExpense(expense: ApiExpense): Expense {
  return {
    ...expense,
    date: expense.date.slice(0, 10),
    category: expense.category as Category,
  };
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const currentYear = 2026;
  const currentMonth = 8;

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('지출 목록을 불러오지 못했습니다.');
        }

        const data: ApiExpense[] = await response.json();
        setExpenses(data.map(toExpense));
      } catch (error) {
        console.error(error);
        alert('서버에서 지출 목록을 불러오지 못했습니다.');
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpenseData),
      });

      if (!response.ok) {
        throw new Error('지출을 저장하지 못했습니다.');
      }

      const savedExpense: ApiExpense = await response.json();
      const expense = toExpense(savedExpense);

      setExpenses((currentExpenses) => [expense, ...currentExpenses]);
      setSelectedDay(getDayFromDate(expense.date));
    } catch (error) {
      console.error(error);
      alert('지출 저장에 실패했습니다. 서버가 켜져 있는지 확인해 주세요.');
    }
  };

  const handleDeleteExpense = async (idToDelete: string) => {
    try {
      const response = await fetch(`${API_URL}/${idToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('지출을 삭제하지 못했습니다.');
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter((item) => item.id !== idToDelete)
      );
    } catch (error) {
      console.error(error);
      alert('지출 삭제에 실패했습니다.');
    }
  };

  const handleToggleView = () => {
    setCurrentView(currentView === 'list' ? 'calendar' : 'list');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-0 sm:py-6">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] shadow-2xl flex flex-col rounded-none sm:rounded-3xl overflow-hidden">
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