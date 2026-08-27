import type { Expense } from '../types/expense';

/**
 * 初期の想定予算額（円）
 */
export const INITIAL_BUDGET = 800000;

/**
 * 画面テスト用の初期モック支出データ一覧
 */
export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    date: '2026-08-17',
    description: 'セブンイレブン お弁当',
    amount: 680,
    category: '食費',
    paymentMethod: '現金',
  },
  {
    id: '2',
    date: '2026-08-17',
    description: '地下鉄 定期券チャージ',
    amount: 3000,
    category: '交通費',
    paymentMethod: '現金',
  },
  {
    id: '3',
    date: '2026-08-18',
    description: 'マツモトキヨシ 洗剤',
    amount: 1540,
    category: '日用品',
    paymentMethod: 'カード',
  },
];