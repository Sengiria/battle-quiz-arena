import type { GamePhase } from "../../constants/gamePhase"

export type EndGameProps = {
  type: GamePhase;
  onRestart: () => void;
}