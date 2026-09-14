import { prisma } from '../config/prisma.js';

export type ExpenseInput = {
  date: Date;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
};

/**
 * [Model - モデル層]
 * データベース（DB）との直接的なやり取り（CRUD操作）を担当します。
 * ビジネスデータの構造と永続化（保存・更新・削除・取得）を管理します。
 */
export const expenseModel = {
  /**
   * すべての支出一覧を取得（日付降順、作成日時降順）
   */
  findAll() {
    return prisma.expense.findMany({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
  },

  /**
   * 特定のIDに対応する支出データを1件取得
   */
  findById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
    });
  },

  /**
   * 新規支出データの作成
   */
  create(data: ExpenseInput) {
    return prisma.expense.create({ data });
  },

  /**
   * 【修正機能】特定のIDに対応する支出データの更新
   */
  update(id: string, data: ExpenseInput) {
    return prisma.expense.update({
      where: { id },
      data,
    });
  },

  /**
   * 特定のIDに対応する支出データの削除
   */
  remove(id: string) {
    return prisma.expense.delete({
      where: { id },
    });
  },
};

