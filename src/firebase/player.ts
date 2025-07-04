import { db } from "./init";
import { doc, onSnapshot } from "firebase/firestore";
import { DB_ROOMS } from "../constants/room";
import { type Player } from "../constants/player";
import { PHASE_CATEGORY, PHASE_PLAY, PHASE_WAITING, type GamePhase } from "../constants/gamePhase";
import { setQuestionsForRoom, updatePhase } from "./room";
import { useGameStore } from "../store/useGameStore";
import { type Category } from "../constants/categories";
import { getRandomQuestions } from "../utils/getRandomQuestions";
import { resolveRound } from "./round";

export const listenToPlayerData = (
  roomCode: string,
  playerId: string,
  setPhase: (phase: GamePhase) => void,
) => {
  const roomRef = doc(db, DB_ROOMS, roomCode);
  const gameStore = useGameStore.getState();

  return onSnapshot(roomRef, (docSnap) => {
    const data = docSnap.data();

    if (!data?.players) return;
    const playerValues: Player[] = Object.values(data.players);

    const me = data.players[playerId] as Player;
    const enemy = playerValues.find((p: any) => p.id !== playerId) as Player;

    if (me && me.hp !== gameStore.playerHp) {
      gameStore.setPlayerHp(me.hp);
    }

    if (enemy && enemy.hp !== gameStore.enemyHp) {
      gameStore.setEnemyHp(enemy.hp);
    }

    const playerCount = playerValues.length;
    if (playerCount === 2 && data.status === PHASE_WAITING) {
      updatePhase(roomCode, PHASE_CATEGORY);
    }
    const allReady = playerValues.length === 2 && playerValues.every(p => p.excludedCategory);
    if (playerCount === 2 && allReady && data.status === PHASE_CATEGORY) {
      const excluded = playerValues.map((p: any) => p.excludedCategory);
      gameStore.setExcludedCategories(excluded)
    }

    const isFirstPlayer = Object.keys(data.players).sort()[0] === playerId;

    if (playerCount === 2 && allReady && isFirstPlayer && !data.questions) {
      const allExcluded = playerValues
        .map((p) => p.excludedCategory)
        .filter((cat): cat is Category => cat !== null);

      const questions = getRandomQuestions(40, allExcluded);
      !data.questions && setQuestionsForRoom(roomCode, questions);
      updatePhase(roomCode, PHASE_PLAY);
    }

    if (Array.isArray(data.questions)) {
      gameStore.setQuestions(data.questions);
    }

    if (typeof data.round === 'number') {
      gameStore.setRound(data.round);
    }

    if (data.status !== gameStore.phase) {
      setPhase(data.status);
    }

    if (me?.name && gameStore.playerName !== me.name) {
      gameStore.setPlayerName(me.name);
    }
    if (enemy?.name && gameStore.enemyName !== enemy.name) {
      gameStore.setEnemyName(enemy.name);
    }

    if (playerCount === 2 && data.status === PHASE_PLAY) {
      const allAnswered = playerValues.every(p => p.selectedOption);
      if (allAnswered) {
        gameStore.setFeedback({
          selected: data.players[playerId].selectedOption,
          enemySelected: playerValues.find(p => p.id !== playerId)?.selectedOption ?? null,
        });

        if (isFirstPlayer) {
          setTimeout(() => resolveRound(roomCode), 2000);
        }
      }
    }
  });
};  