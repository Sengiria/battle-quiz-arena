import { useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { createRoom, joinRoom } from "../../firebase/room";
import { PHASE_WAITING } from "../../constants/gamePhase";
import { generateRoomCode } from "../../utils/generateRoomCode";
import type { MenuProps } from "./types";
import { useGameStore } from "../../store/useGameStore";

const Menu = ({setPhase}: MenuProps) => {
  const setRoomCode = useGameStore((s) => s.setRoomCode);
  const setPlayerId = useGameStore((s) => s.setPlayerId);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const playerId = crypto.randomUUID();

  const handleCreate = async () => {
    if (!playerNameInput) return setError("Enter a name");
    const roomCode = generateRoomCode();
    const result = await createRoom(playerId, playerNameInput, roomCode);
    if (result.success) {
      setPhase(PHASE_WAITING)
      setRoomCode(roomCode)
      setPlayerId(playerId)
      setPlayerName(playerNameInput)
    }
    else {
      setError(result.error || "Failed to create a room");
    }
  };

  const handleJoin = async () => {
    if (!playerNameInput || !joinCode) return setError("Enter a name and room code");
    const result = await joinRoom(joinCode.toUpperCase(), playerId, playerNameInput);
    if (result.success) {
      setRoomCode(joinCode)
      setPlayerId(playerId)
      setPlayerName(playerNameInput)

    } else {
      setError(result.error || "Failed to join");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <Input
        label="Your Name"
        placeholder="Enter your name"
        value={playerNameInput}
        onChange={(e) => setPlayerNameInput(e.target.value)}
        error={!playerNameInput ? error : undefined}
      />
      <Input
        label="Room Code (optional)"
        placeholder="Enter room code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        error={!joinCode ? error : undefined}
      />
      <div className="flex gap-2 mt-2 w-full">
        <Button onClick={handleCreate}>
          Create Room
        </Button>
        <Button onClick={handleJoin}>
          Join Room
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Menu;
