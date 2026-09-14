import type { Request, Response } from 'express';
import { expenseModel, type ExpenseInput } from '../models/expenseModel.js';

function parseExpenseInput(body: unknown): ExpenseInput | null {
  if (!body || typeof body !== 'object') return null;

  const { date, amount, category, description, paymentMethod } = body as Record<string, unknown>;
  const parsedDate = new Date(String(date));
  const parsedAmount = Number(amount);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    !Number.isInteger(parsedAmount) ||
    parsedAmount <= 0 ||
    typeof category !== 'string' || !category.trim() ||
    typeof description !== 'string' || !description.trim() ||
    typeof paymentMethod !== 'string' || !paymentMethod.trim()
  ) {
    return null;
  }

  return {
    date: parsedDate,
    amount: parsedAmount,
    category: category.trim(),
    description: description.trim(),
    paymentMethod: paymentMethod.trim(),
  };
}

function isRecordMissing(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025';
}

/**
 * [Controller - コントローラー層]
 * クライアントからのHTTPリクエスト（Request）を受け取り、バリデーション（入力値検証）を行い、
 * 適切なModelを呼び出した後、結果をHTTPレスポンス（Response）として返却します。
 */
export const expenseController = {
  /**
   * GET /api/expenses - 支出一覧の取得
   */
  async list(_req: Request, res: Response) {
    try {
      const expenses = await expenseModel.findAll();
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '支出一覧の取得に失敗しました。' });
    }
  },

  /**
   * GET /api/expenses/:id - 特定の支出詳細（1件）の取得
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const expense = await expenseModel.findById(id);

      if (!expense) {
        res.status(404).json({ message: '該当する支出が見つかりませんでした。' });
        return;
      }

      res.json(expense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '支出情報の取得に失敗しました。' });
    }
  },

  /**
   * POST /api/expenses - 新規支出の登録
   */
  async create(req: Request, res: Response) {
    const input = parseExpenseInput(req.body);
    if (!input) {
      res.status(400).json({ message: '日付、金額、カテゴリー、内容、支払い方法を正しく入力してください。' });
      return;
    }

    try {
      const created = await expenseModel.create(input);
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '支出の保存に失敗しました。' });
    }
  },

  /**
   * 【修正機能】PUT /api/expenses/:id - 特定の支出の更新
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const input = parseExpenseInput(req.body);

    if (!input) {
      res.status(400).json({ message: '日付、金額、カテゴリー、内容、支払い方法を正しく入力してください。' });
      return;
    }

    try {
      const updated = await expenseModel.update(id, input);
      res.json(updated);
    } catch (error) {
      console.error(error);
      const status = isRecordMissing(error) ? 404 : 500;
      res.status(status).json({
        message: status === 404 ? '更新対象の支出が見つかりませんでした。' : '支出の更新に失敗しました。',
      });
    }
  },

  /**
   * DELETE /api/expenses/:id - 特定の支出の削除
   */
  async remove(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await expenseModel.remove(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      const status = isRecordMissing(error) ? 404 : 500;
      res.status(status).json({
        message: status === 404 ? '削除対象の支出が見つかりませんでした。' : '支出の削除に失敗しました。',
      });
    }
  },
};

