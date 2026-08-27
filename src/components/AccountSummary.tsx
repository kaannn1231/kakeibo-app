import { Star } from 'lucide-react';
import { getCurrentFormattedTime } from '../utils/formatDate';

type AccountSummaryProps = {
  totalExpense: number; // 今月の総支出額
  balance: number;      // 現在の口座残高
  currentView: 'list' | 'calendar'; // 現在の表示画面（一覧 or カレンダー）
  onToggleView: () => void;         // 画面切り替えハンドラー
};

/**
 * 口座残高・今月の総支出・画面切り替えボタンを表示するヘッダーコンポーネント
 */
export function AccountSummary({
  totalExpense,
  balance,
  currentView,
  onToggleView,
}: AccountSummaryProps) {
  const lastUpdated = getCurrentFormattedTime();

  return (
    <div className="bg-[#2554eb] text-white px-5 pt-8 pb-8">
      {/* 1. ナビゲーションバー (가운데 정렬) */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 오른쪽 버튼과 똑같은 크기의 투명 빈 상자 (균형 맞추기용) */}
        <div className="w-9"></div>

        {/* ⭐ 가운데: 제목이 남은 공간을 다 먹고 정중앙 정렬! ⭐ */}
        <h1 className="text-xl font-bold text-center flex-1">
          {currentView === 'list' ? '取引一覧' : 'カレンダー'}
        </h1>

        {/* 오른쪽: 화면 전환 버튼 */}
        <button
          type="button"
          onClick={onToggleView}
          className="w-9 h-9 bg-blue-700 hover:bg-blue-600 rounded-xl text-sm flex items-center justify-center transition-colors cursor-pointer"
          title={currentView === 'list' ? 'カレンダーを見る' : '一覧を見る'}
        >
          {currentView === 'list' ? '📅' : '📋'}
        </button>
      </div>

      {/* 2. 今月の総支出バナー */}
      <div className="bg-white/95 text-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-sm mt-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0 text-xs font-bold">
            📉
          </div>
          <span className="text-xs text-slate-600 font-semibold">
            今月の総支出
          </span>
        </div>
        <span className="text-sm font-extrabold text-rose-600">
          ¥{totalExpense.toLocaleString()}
        </span>
      </div>

      {/* 3. 口座名・残高表示 */}
      <div className="text-center mt-6">
        <div className="flex items-center justify-center font-medium text-blue-100 text-xs">
          <span>メイン口座</span>
          <Star className="flex mb-0.5 w-3.5 h-3.5 fill-amber-300 text-amber-400 ml-1" />
        </div>

        <p className="text-xs mt-0.5 text-blue-100 opacity-90">
          三井住友 110-2106-20615
        </p>

        <div className="text-4xl font-extrabold mt-2 tracking-tight">
          ¥{balance.toLocaleString()}
        </div>

        <p className="text-blue-200 text-[11px] mt-1.5 opacity-80">
          最終更新: {lastUpdated}
        </p>
      </div>
    </div>
  );
}