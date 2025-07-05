import type { QuestionsContentProps } from './types';
import { useGameStore } from '../../store/useGameStore';
import { useEffect, useState } from 'react';

const QuestionsContent = ({ question, onSelect, feedback }: QuestionsContentProps) => {
  const isPlayerOne = useGameStore((s) => s.isPlayerOne);
  const [localSelection, setLocalSelection] = useState<string | null>(null);

  const hasAnswered = !!feedback || !!localSelection;

  const handleClick = (answer: string) => {
    if (hasAnswered) return;
    setLocalSelection(answer);
    onSelect(answer);
  };

  useEffect(() => {
    setLocalSelection(null);
  }, [question.question]);

  return (
    <>
  <h2 className="text-lg sm:text-xl text-shadow-lg text-[#795649] font-bold text-center drop-shadow p-2 w-full min-h-20 mt-4 break-words" >
    {question.question}
  </h2>
      <div className="w-full flex flex-col items-center gap-3 p-6">
        {question.answers.map((answer, index) => {
          const isCorrectAnswer = question.correctAnswer === answer;

          const playerSelection = feedback?.selected;
          const enemySelection = feedback?.enemySelected;

          const isYou = answer === (feedback ? playerSelection : localSelection);
          const isEnemy = feedback && answer === enemySelection;

          let ringColor = '';
          if (isYou) {
            ringColor = isPlayerOne ? 'ring-2 ring-blue-400' : 'ring-2 ring-red-400';
          } else if (isEnemy) {
            ringColor = isPlayerOne ? 'ring-2 ring-red-400' : 'ring-2 ring-blue-400';
          }

          return (
            <div key={index} className="relative w-full flex items-center justify-center">
              {/* Left label (You) */}
              {isYou && (
                <span
                  className={`absolute  -left-[35px] top-1/2 -translate-y-1/2 text-xs font-bold ${isPlayerOne ? 'text-blue-400' : 'text-red-400'
                    }`}
                >
                  You
                </span>
              )}

              {/* Right label (Enemy) */}
              {isEnemy && (
                <span
                  className={`absolute -right-14 top-1/2 -translate-y-1/2 text-xs font-semibold ${isPlayerOne ? 'text-red-400' : 'text-blue-400'
                    }`}
                >
                  Enemy
                </span>
              )}

              <button
                onClick={() => handleClick(answer)}
                className={`px-4 py-2 w-full text-sm font-serif rounded border-2 transition-all duration-300 ease-in-out
        text-[#f4e5c3] border-[#c0a080]
        shadow-[2px_2px_0px_#a67c52] 
        bg-[radial-gradient(circle,_#795649,_#5b3b2b)]
        ${!hasAnswered
                    ? 'cursor-pointer hover:bg-[radial-gradient(circle,_#a1784d,_#5b3b2b)] hover:shadow-[0px_0_5px_5px_rgba(255,255,255,0.1)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] active:translate-y-[2px]'
                    : 'cursor-default'
                  }
        ${ringColor}
        ${feedback && !isCorrectAnswer ? 'opacity-50' : ''}
        ${feedback && isCorrectAnswer ? 'bg-green-300 border-green-700 text-green-900' : ''}
      `}
              >
                {answer}
              </button>
            </div>
          );
        })}

      </div>
    </>
  );
};

export default QuestionsContent;
