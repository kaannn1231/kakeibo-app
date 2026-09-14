import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

/**
 * Prismaクライアントおよびデータベース接続設定
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URLが.envファイルに設定されていません。');
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

