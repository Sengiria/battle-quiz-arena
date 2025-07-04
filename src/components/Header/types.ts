import type { Category } from "../../constants/categories";

export type HeaderProps = {
  current: number;
  total: number;
  playerHp: number;
  enemyHp: number;
  maxHealth?: number;
  excludedCategories: Category[];
  playerName: string | null;
  enemyName: string | null;
  isCastlePlayer: boolean;
};
