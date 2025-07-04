import type { Category } from "./categories";

export const DB_PLAYERS = "players";
export const PLAYER_BLUE = "blue";
export const PLAYER_RED = "red";

export interface Player {
  id: string;
  name: string;
  hp: number;
  isReady: boolean;
  excludedCategory: Category | null;
  selectedOption: string | null;
  isCorrect: boolean | null;
  joinedAt: number;
  color: typeof PLAYER_BLUE | typeof PLAYER_RED,
}