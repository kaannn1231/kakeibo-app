import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL이 .env 파일에 없습니다.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      message: 'Kakeibo API Server is running!',
      database: 'connected',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Database connection failed.',
    });
  }
});

app.get('/api/expenses', async (_req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: '지출 목록을 불러오지 못했습니다.',
    });
  }
});
app.post('/api/expenses', async (req, res) => {
  const { date, amount, category, description, paymentMethod } = req.body;

  const parsedAmount = Number(amount);
  const parsedDate = new Date(date);

  const isInvalid =
    Number.isNaN(parsedDate.getTime()) ||
    !Number.isInteger(parsedAmount) ||
    parsedAmount <= 0 ||
    typeof category !== 'string' ||
    !category.trim() ||
    typeof description !== 'string' ||
    !description.trim() ||
    typeof paymentMethod !== 'string' ||
    !paymentMethod.trim();

  if (isInvalid) {
    res.status(400).json({
      message: '날짜, 금액, 카테고리, 내용, 결제수단을 올바르게 입력해 주세요.',
    });
    return;
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        date: parsedDate,
        amount: parsedAmount,
        category: category.trim(),
        description: description.trim(),
        paymentMethod: paymentMethod.trim(),
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: '지출을 저장하지 못했습니다.',
    });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.expense.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: '삭제할 지출을 찾지 못했습니다.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running at: http://localhost:${PORT}`);
});