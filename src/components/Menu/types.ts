import type { GamePhase } from "../../constants/gamePhase";

export type MenuProps = {
  setPhase: (phase: GamePhase) => void;
};
