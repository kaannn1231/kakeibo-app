import { Router } from 'express';
import { expenseController } from '../controllers/expenseController.js';

/**
 * [Router - ルーター層: APIを用途毎に分ける]
 * 
 * URLパス自体に用途（/list, /create, /update, /delete）を明示し、
 * クライアントがどのような目的でリクエストを送信しているかを一目で把握できるように設計しています。
 * （標準RESTパスである '/' や '/:id' も柔軟に対応）
 * 
 * ベースパス: /api/expenses
 */
export const expenseRouter = Router();

// 1. 【取得用途】支出一覧の取得
expenseRouter.get('/list', expenseController.list);
expenseRouter.get('/', expenseController.list);

// 2. 【取得用途】特定の支出詳細（1件）の取得
expenseRouter.get('/detail/:id', expenseController.getById);
expenseRouter.get('/:id', expenseController.getById);

// 3. 【登録用途】新規支出の登録 (POST)
expenseRouter.post('/create', expenseController.create);
expenseRouter.post('/', expenseController.create);

// 4. 【修正用途】支出情報の更新 (PUT) - 修正機能
expenseRouter.put('/update/:id', expenseController.update);
expenseRouter.put('/:id', expenseController.update);

// 5. 【削除用途】支出の削除 (DELETE)
expenseRouter.delete('/delete/:id', expenseController.remove);
expenseRouter.delete('/:id', expenseController.remove);


