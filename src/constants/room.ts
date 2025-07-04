import type { Player } from "./player";

export interface Room {
  status: 'waiting' | 'ready' | 'in-game' | 'finished';
  createdAt: number;
  round: number;
  players: Record<string, Player>;
}

export const DB_ROOMS = "rooms";