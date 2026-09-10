import express from 'express';
import cors from 'cors';
import { expenseRouter } from './routes/expenseRoutes.js';
import { healthRouter } from './routes/healthRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정 (모든 요청에서 공통 적용)
app.use(cors()); // 다른 도메인(Vite 개발서버 등)에서의 API 요청 허용
app.use(express.json()); // JSON 형식의 Request Body 파싱

// [API 용도별 분리 - 라우터 등록]
// 1. 서버 상태 점검용 API: /api/health
app.use('/api/health', healthRouter);
// 2. 가계부 지출 관리 API: /api/expenses
app.use('/api/expenses', expenseRouter);

app.listen(PORT, () => {
  console.log(`🚀 API Server running at: http://localhost:${PORT}`);
});
