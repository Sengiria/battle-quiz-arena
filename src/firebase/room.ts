import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { DB_ROOMS, type Room } from "../constants/room";
import { db } from "./init";
import { PHASE_WAITING } from "../constants/gamePhase";
import { DB_PLAYERS, PLAYER_BLUE, PLAYER_RED } from "../constants/player";
import type { Question } from "../constants/questions";
import { useGameStore } from "../store/useGameStore";

export const createRoom = async (id: string, name: string, roomCode: string) => {
  try {
    const roomRef = doc(db, DB_ROOMS, roomCode);
    const roomData: Room = {
      status: PHASE_WAITING,
      createdAt: Date.now(),
      round: 0,
      [DB_PLAYERS]: {
        [id]: {
          id,
          name,
          hp: 7,
          isReady: false,
          excludedCategory: null,
          selectedOption: null,
          isCorrect: null,
          joinedAt: Date.now(),
          color: PLAYER_BLUE,
        },
      },
    };

    await setDoc(roomRef, roomData);
    useGameStore.getState().setIsPlayerOne(true);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
};

export const joinRoom = async (
  code: string,
  id: string,
  name: string,
) => {
  try {
    const roomRef = doc(db, DB_ROOMS, code);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      return { success: false, error: "Room does not exist" };
    }

    if (!name) return { success: false, error: "Player name is required" };

    const data = roomSnap.data();
    const existingPlayers = data?.players || {};
    const existingPlayerIds = Object.keys(existingPlayers);
    const isExisting = existingPlayerIds.includes(id);

    if (!isExisting && existingPlayerIds.length >= 2) {
      return { success: false, error: "Room is full" };
    }

    const newPlayer = isExisting
      ? {
        ...existingPlayers[id],
        excludedCategory: null,
      }
      : {
        id,
        name,
        hp: 7,
        isReady: false,
        excludedCategory: null,
        selectedOption: null,
        isCorrect: null,
        joinedAt: Date.now(),
        color: PLAYER_RED,
      };

    await updateDoc(roomRef, {
      [`${DB_PLAYERS}.${id}`]: newPlayer,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
};

export const updatePhase = async (roomCode: string, newPhase: string) => {
  try {
    const roomRef = doc(db, DB_ROOMS, roomCode);
    await updateDoc(roomRef, { status: newPhase })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" }
  }
}

export const setQuestionsForRoom = async (roomCode: string, questions: Question[]) => {
  const roomRef = doc(db, DB_ROOMS, roomCode);
  await updateDoc(roomRef, {
    questions
  });
};