import { doc, updateDoc } from "firebase/firestore";
import { EXCLUDED_CATEGORY, type Category } from "../constants/categories";
import { DB_ROOMS } from "../constants/room";
import { db } from "./init";
import { DB_PLAYERS } from "../constants/player";

export const excludeCategory = async (category: Category, roomCode: string, playerId: string) => {
    try {
        const roomRef = doc(db, DB_ROOMS, roomCode)
        await updateDoc(roomRef, {
            [`${DB_PLAYERS}.${playerId}.${EXCLUDED_CATEGORY}`]: category
        })
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message || "Unknown Error" }
    }
}