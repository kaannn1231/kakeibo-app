import express from 'express';
import cors from 'cors';
import { expenseRouter } from './routes/expenseRoutes.js';
import { healthRouter } from './routes/healthRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア設定（全リクエスト共通）
app.use(cors()); // 異なるドメイン（Vite開発サーバー等）からのAPIリクエストを許可
app.use(express.json()); // JSON形式のリクエストボディをパース

// 【APIを用途毎に分ける - ルーター登録】
// 1. サーバー稼働状態確認用API: /api/health
app.use('/api/health', healthRouter);
// 2. 家計簿支出管理API: /api/expenses
app.use('/api/expenses', expenseRouter);

app.listen(PORT, () => {
  console.log(`🚀 API Server running at: http://localhost:${PORT}`);
});
