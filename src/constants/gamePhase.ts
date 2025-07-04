export const PHASE_MENU = 'menu'
export const PHASE_WAITING = "waiting";
export const PHASE_CATEGORY = 'excludingCategories'
export const PHASE_GAME_OVER = 'gameOver'
export const PHASE_PLAY = 'playing'
export const PHASE_DAMAGE = 'damage'
export const PHASE_WIN = 'win'
export const PHASE_TIE = 'tie'

export type GamePhase = typeof PHASE_MENU | typeof PHASE_WAITING | typeof PHASE_CATEGORY | typeof PHASE_PLAY | typeof PHASE_GAME_OVER | typeof PHASE_WIN | typeof PHASE_TIE | typeof PHASE_DAMAGE; 