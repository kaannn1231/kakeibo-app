import { prisma } from '../config/prisma.js';

export type ExpenseInput = {
  date: Date;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
};

/**
 * [Model - 모델 계층]
 * 데이터베이스(DB)와의 직접적인 상호작용(CRUD)을 전담합니다.
 * 비즈니스 데이터의 구조와 영속성(저장/수정/삭제/조회)을 관리합니다.
 */
export const expenseModel = {
  /**
   * 모든 지출 내역 조회 (날짜 내림차순, 최신 등록순)
   */
  findAll() {
    return prisma.expense.findMany({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
  },

  /**
   * 특정 ID의 지출 내역 단건 조회
   */
  findById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
    });
  },

  /**
   * 신규 지출 생성
   */
  create(data: ExpenseInput) {
    return prisma.expense.create({ data });
  },

  /**
   * [수정 기능] 특정 ID의 지출 내역 수정
   */
  update(id: string, data: ExpenseInput) {
    return prisma.expense.update({
      where: { id },
      data,
    });
  },

  /**
   * 특정 ID의 지출 삭제
   */
  remove(id: string) {
    return prisma.expense.delete({
      where: { id },
    });
  },
};

