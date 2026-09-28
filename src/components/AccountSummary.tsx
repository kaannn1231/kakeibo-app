import { Star } from 'lucide-react';
import { getCurrentFormattedTime } from '../utils/formatDate';

type AccountSummaryProps = {
  totalExpense: number; // 今月の総支出額
  balance: number;      // 現在の口座残高
  currentView: 'list' | 'calendar' | 'chart'; // 現在の表示画面（一覧 or カレンダー or グラフ）
  onSelectView: (view: 'list' | 'calendar' | 'chart') => void; // 画面切り替えハンドラー
};

/**
 * 口座残高・今月の総支出・画面切り替えタブを表示するヘッダーコンポーネント
 */
export function AccountSummary({
  totalExpense,
  balance,
  currentView,
  onSelectView,
}: AccountSummaryProps) {
  const lastUpdated = getCurrentFormattedTime();

  return (
    <div className="bg-[#2554eb] text-white px-5 pt-7 pb-8">
      {/* 1. ナビゲーションバー & 3分割セグメントコントロール */}
      <div className="flex items-center justify-between gap-2">
        {/* 左側: 現在の画面タイトル */}
        <h1 className="text-lg font-bold tracking-tight">
          {currentView === 'list'
            ? '取引一覧'
            : currentView === 'calendar'
            ? 'カレンダー'
            : '支出分析'}
        </h1>

        {/* 右側: 画面切り替えタブ ([一覧] / [日別] / [統計]) */}
        <div className="flex bg-blue-700/60 p-1 rounded-xl gap-0.5">
          <button
            type="button"
            onClick={() => onSelectView('list')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentView === 'list'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-blue-100 hover:text-white'
            }`}
            title="取引一覧"
          >
            📋 一覧
          </button>
          <button
            type="button"
            onClick={() => onSelectView('calendar')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentView === 'calendar'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-blue-100 hover:text-white'
            }`}
            title="カレンダー表示"
          >
            📅 日別
          </button>
          <button
            type="button"
            onClick={() => onSelectView('chart')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentView === 'chart'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-blue-100 hover:text-white'
            }`}
            title="統計グラフ"
          >
            📊 統計
          </button>
        </div>
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