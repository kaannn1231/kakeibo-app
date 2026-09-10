import { Router } from 'express';
import { expenseController } from '../controllers/expenseController.js';

/**
 * [Router - 라우터 계층: API를 용도별로 분리 (APIを用途毎に分ける)]
 * 
 * URL 주소 자체에 용도(/list, /create, /update, /delete)를 명시하여
 * 클라이언트가 어떤 목적으로 요청을 보내는지 한눈에 파악할 수 있도록 구성했습니다.
 * (기본 REST 경로인 '/', '/:id'도 함께 지원하도록 유연하게 매핑)
 * 
 * 베이스 경로: /api/expenses
 */
export const expenseRouter = Router();

// 1. [조회 용도] 전체 지출 목록 조회
expenseRouter.get('/list', expenseController.list);
expenseRouter.get('/', expenseController.list);

// 2. [조회 용도] 특정 지출 단건 상세 조회
expenseRouter.get('/detail/:id', expenseController.getById);
expenseRouter.get('/:id', expenseController.getById);

// 3. [등록 용도] 신규 지출 등록 (POST)
expenseRouter.post('/create', expenseController.create);
expenseRouter.post('/', expenseController.create);

// 4. [수정 용도] 지출 정보 수정 (PUT) - 修正機能
expenseRouter.put('/update/:id', expenseController.update);
expenseRouter.put('/:id', expenseController.update);

// 5. [삭제 용도] 지출 삭제 (DELETE)
expenseRouter.delete('/delete/:id', expenseController.remove);
expenseRouter.delete('/:id', expenseController.remove);


