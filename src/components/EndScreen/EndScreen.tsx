import React from 'react'
import type { EndGameProps } from './types'
import { PHASE_TIE, PHASE_WIN } from '../../constants/gamePhase';

const GameEndScreen: React.FC<EndGameProps> = ({ type, onRestart }) => {
  const isVictory = type === PHASE_WIN
  const isTie = type === PHASE_TIE;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-1000"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div className="text-center text-white space-y-6">
        <h1 className={`text-4xl sm:text-6xl font-bold font-serif drop-shadow-md ${isVictory ? 'text-[#fbe9d0]' : isTie ? 'text-yellow-300' : 'text-red-500'
          }`}>
          {isVictory ? '🎉 Victory!' : isTie ? '⚖️ Tie!' : '💀 Defeat...'}
        </h1>
        <p className="text-lg sm:text-2xl font-light">
          {isVictory
            ? 'You conquered the realm with your wisdom.'
            : isTie
              ? 'The battle ended in a draw — no victors, no survivors.'
              : 'Your army has fallen in battle.'}
        </p>
        <button
          onClick={onRestart}
          className="
          rounded border-2 transition-all duration-300 ease-in-out
                cursor-pointer
                text-[#f4e5c3] border-[#c0a080]
                shadow-[2px_2px_0px_#a67c52] 
                bg-[radial-gradient(circle,_#795649,_#5b3b2b)]
                hover:bg-[radial-gradient(circle,_#a1784d,_#5b3b2b)]
                hover:shadow-[0px_0_5px_5px_rgba(255,255,255,0.1)]
                active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] 
                active:translate-y-[2px]
          px-4 py-2 text-lg font-semibold "
        >
          {isTie ? 'Rematch' : isVictory ? 'Play Again' : 'Try Again'}
        </button>
      </div>
    </div>
  )
}

export default GameEndScreen
