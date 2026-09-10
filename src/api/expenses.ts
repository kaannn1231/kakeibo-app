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
  if (!response.ok) throw new Error('지출 요청을 처리하지 못했습니다.');
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const expenseApi = {
  // [조회 용도] 전체 지출 목록 조회
  async list() {
    return (await request<ApiExpense[]>('/list')).map(toExpense);
  },

  // [조회 용도] 특정 지출 상세 단건 조회
  async getById(id: string) {
    return toExpense(await request<ApiExpense>(`/detail/${id}`));
  },

  // [등록 용도] 신규 지출 추가 (POST)
  async create(expense: NewExpense) {
    return toExpense(await request<ApiExpense>('/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    }));
  },

  // [수정 용도] 기존 지출 수정 (PUT)
  async update(id: string, expense: NewExpense) {
    return toExpense(await request<ApiExpense>(`/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    }));
  },

  // [삭제 용도] 지출 삭제 (DELETE)
  remove(id: string) {
    return request<void>(`/delete/${id}`, { method: 'DELETE' });
  },
};
