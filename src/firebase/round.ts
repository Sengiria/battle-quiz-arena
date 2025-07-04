import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./init";
import { DB_ROOMS } from "../constants/room";
import { DB_PLAYERS, type Player } from "../constants/player";

export const answerQuestion = async (answer: string, roomCode: string, playerId: string) => {
    try {
        await updateDoc(doc(db, DB_ROOMS, roomCode), {
            [`${DB_PLAYERS}.${playerId}.selectedOption`]: answer,
        });

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export const resolveRound = async (roomCode: string) => {
    const roomRef = doc(db, DB_ROOMS, roomCode);
    const docSnap = await getDoc(roomRef);
    const data = docSnap.data();

    if (!data || !data.questions || !data.players) return;

    const question = data.questions[data.round];
    if (!question) return;

    const players: Record<string, Player> = data.players;

    const p1Entry = Object.values(players).find((p) => p.color === 'blue');
    const p2Entry = Object.values(players).find((p) => p.color === 'red');

    if (!p1Entry || !p2Entry) return;

    const p1 = p1Entry;
    const p2 = p2Entry;

    const p1Correct = p1.selectedOption === question.correctAnswer;
    const p2Correct = p2.selectedOption === question.correctAnswer;

    let p1NewHp = p1.hp;
    let p2NewHp = p2.hp;

    if (p1Correct && !p2Correct) {
        p2NewHp -= 1;
    } else if (!p1Correct && p2Correct) {
        p1NewHp -= 1;
    } else if (!p1Correct && !p2Correct) {
        p1NewHp -= 1;
        p2NewHp -= 1;
    }

    const updates: any = {
        [`${DB_PLAYERS}.${p1.id}.hp`]: p1NewHp,
        [`${DB_PLAYERS}.${p1.id}.selectedOption`]: null,
        [`${DB_PLAYERS}.${p2.id}.hp`]: p2NewHp,
        [`${DB_PLAYERS}.${p2.id}.selectedOption`]: null,
    };

    updates.round = data.round + 1;
    await updateDoc(roomRef, updates);

};
