import { create } from 'zustand';
import { PHASE_MENU, type GamePhase } from '../constants/gamePhase';
import type { Category } from '../constants/categories';
import type { Feedback, Question } from '../constants/questions';

type GameStore = {
  roomCode: string | null;
  playerId: string | null;
  playerName: string | null;
  enemyName: string | null;
  phase: GamePhase;
  playerHp: number;
  enemyHp: number;
  excludedCategories: Category[];
  questions: Question[];
  isPlayerOne: boolean;
  round: number;
  feedback: Feedback | null;
  setRoomCode: (code: string | null) => void;
  setPlayerId: (id: string | null) => void;
  setPlayerName: (name: string | null) => void;
  setEnemyName: (name: string | null) => void;
  setPhase: (phase: GamePhase) => void;
  resetGame: () => void;
  setPlayerHp: (hp: number) => void;
  setEnemyHp: (hp: number) => void;
  setExcludedCategories: (excludedCategories: Category[]) => void;
  setQuestions: (questions: Question[]) => void;
  setIsPlayerOne: (isPlayerOne: boolean) => void;
  setRound: (round: number) => void;
  setFeedback: (feedback: Feedback | null) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  roomCode: null,
  playerId: null,
  playerName: null,
  enemyName: null,
  phase: PHASE_MENU,
  playerHp: 7,
  enemyHp: 7,
  excludedCategories: [],
  questions: [],
  isPlayerOne: false,
  round: 0,
  feedback: null,
  setRoomCode: (roomCode) => set({ roomCode }),
  setPlayerId: (playerId) => set({ playerId }),
  setPlayerName: (playerName) => set({ playerName }),
  setEnemyName: (enemyName) => set({ enemyName }),
  setPhase: (phase) => set({ phase }),
  setPlayerHp: (hp: number) => set({ playerHp: hp }),
  setEnemyHp: (hp: number) => set({ enemyHp: hp }),
  setExcludedCategories: (excludedCategories: Category[]) => set({excludedCategories}),
  setQuestions: (questions: Question[]) => set({questions}),
  setIsPlayerOne: (isPlayerOne: boolean) => set({isPlayerOne}),
  setRound: (round: number) => set({round}),
  setFeedback: (feedback: Feedback | null) => set({feedback}),
  resetGame: () =>
    set({
      roomCode: null,
      playerId: null,
      playerName: null,
      enemyName: null,
      phase: PHASE_MENU,
      playerHp: 7,
      enemyHp: 7,
      excludedCategories: [],
      questions: [],
      isPlayerOne: false,
      feedback: null,
      round: 0
    }),
}));
