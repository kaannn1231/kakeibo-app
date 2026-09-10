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
 * [Controller - 컨트롤러 계층]
 * 클라이언트의 HTTP 요청(Request)을 받아 유효성을 검사하고,
 * 적절한 Model을 호출한 후, 그 결과를 HTTP 응답(Response)으로 클라이언트에게 돌려줍니다.
 */
export const expenseController = {
  /**
   * GET /api/expenses - 전체 지출 목록 조회
   */
  async list(_req: Request, res: Response) {
    try {
      const expenses = await expenseModel.findAll();
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '지출 목록을 불러오지 못했습니다.' });
    }
  },

  /**
   * GET /api/expenses/:id - 특정 지출 단건 상세 조회
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const expense = await expenseModel.findById(id);

      if (!expense) {
        res.status(404).json({ message: '해당 지출 내역을 찾지 못했습니다.' });
        return;
      }

      res.json(expense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '지출 정보를 불러오지 못했습니다.' });
    }
  },

  /**
   * POST /api/expenses - 신규 지출 등록
   */
  async create(req: Request, res: Response) {
    const input = parseExpenseInput(req.body);
    if (!input) {
      res.status(400).json({ message: '날짜, 금액, 카테고리, 내용, 결제수단을 올바르게 입력해 주세요.' });
      return;
    }

    try {
      const created = await expenseModel.create(input);
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '지출을 저장하지 못했습니다.' });
    }
  },

  /**
   * [수정 기능] PUT /api/expenses/:id - 특정 지출 내역 수정
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const input = parseExpenseInput(req.body);

    if (!input) {
      res.status(400).json({ message: '날짜, 금액, 카테고리, 내용, 결제수단을 올바르게 입력해 주세요.' });
      return;
    }

    try {
      const updated = await expenseModel.update(id, input);
      res.json(updated);
    } catch (error) {
      console.error(error);
      const status = isRecordMissing(error) ? 404 : 500;
      res.status(status).json({
        message: status === 404 ? '수정할 지출을 찾지 못했습니다.' : '지출을 수정하지 못했습니다.',
      });
    }
  },

  /**
   * DELETE /api/expenses/:id - 특정 지출 삭제
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
        message: status === 404 ? '삭제할 지출을 찾지 못했습니다.' : '지출을 삭제하지 못했습니다.',
      });
    }
  },
};

