/**
 * 支出カテゴリーの一覧定義
 */
export const CATEGORIES = [
  '食費',
  '日用品',
  '交通費',
  '水道光熱費',
  '通信費',
  '交際費',
  '娯楽費',
  '教育費',
  '医療費',
  '衣服・美容',
  '美容費',
] as const;

/**
 * カテゴリー型（定義済みの一覧から1つのみ許可）
 */
export type Category = (typeof CATEGORIES)[number];
