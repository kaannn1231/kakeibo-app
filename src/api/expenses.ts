import type { Category } from '../constants/categories';
import type { Expense, NewExpense } from '../types/expense';

const API_URL = 'http://localhost:3001/api/expenses';

type ApiExpense = Omit<Expense, 'date' | 'category'> & {
  date: string;
  category: string;
};

function toExpense(expense: ApiExpense): Expense {
  return { ...expense, date: expense.date.slice(0, 10), category: expense.category as Category };
}

async function request<T>(path = '', options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) throw new Error('支出リクエストの処理に失敗しました。');
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const expenseApi = {
  // 【取得用途】支出一覧の取得
  async list() {
    return (await request<ApiExpense[]>('/list')).map(toExpense);
  },

  // 【取得用途】特定の支出詳細（1件）の取得
  async getById(id: string) {
    return toExpense(await request<ApiExpense>(`/detail/${id}`));
  },

  // 【登録用途】新規支出の追加 (POST)
  async create(expense: NewExpense) {
    return toExpense(await request<ApiExpense>('/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    }));
  },

  // 【修正用途】既存支出の更新 (PUT)
  async update(id: string, expense: NewExpense) {
    return toExpense(await request<ApiExpense>(`/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    }));
  },

  // 【削除用途】支出の削除 (DELETE)
  remove(id: string) {
    return request<void>(`/delete/${id}`, { method: 'DELETE' });
  },
};
