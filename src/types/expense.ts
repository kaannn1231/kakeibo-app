import type { Category } from '../constants/categories';

/**
 * 支出データ1件分の型定義
 */
export type Expense = {
  id: string;          // 一意の識別ID
  date: string;        // 日付（YYYY-MM-DD）
  amount: number;      // 金額（数値）
  category: Category;  // カテゴリー
  description: string; // 支出内容・店舗名
  paymentMethod: string; // 支払い方法（現金、カードなど）
};

/**
 * 新規登録用の型定義（ID自動生成前）
 */
export type NewExpense = Omit<Expense, 'id'>;