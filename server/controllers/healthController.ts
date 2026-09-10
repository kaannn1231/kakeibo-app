import type { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export async function getHealth(_req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'Kakeibo API Server is running!', database: 'connected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Database connection failed.' });
  }
}
