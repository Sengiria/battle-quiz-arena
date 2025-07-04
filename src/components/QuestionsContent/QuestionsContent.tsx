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
      <h2 className="text-lg sm:text-xl text-shadow-lg text-[#795649] font-bold text-center drop-shadow p-2 w-full min-h-20 mt-4 break-words">
        {question.question}
      </h2>
      <div className="w-full flex flex-col items-center gap-3 p-6">
        {question.answers.map((answer, index) => {
          const isSelected = localSelection === answer || feedback?.selected === answer;
          const isEnemySelected = feedback?.enemySelected === answer;
          const isCorrectAnswer = question.correctAnswer === answer;

          let ringColor = '';
          if (!feedback) {
            if (isSelected) ringColor = isPlayerOne ? 'ring-red-400' : 'ring-blue-400';
          } else {
            if (isSelected) ringColor = isPlayerOne ? 'ring-red-400' : 'ring-blue-400';
            else if (isEnemySelected) ringColor = isPlayerOne ? 'ring-blue-400' : 'ring-red-400';
          }

          return (
            <button
              key={index}
              onClick={() => handleClick(answer)}
              className={`px-4 py-2 w-full text-sm font-serif rounded border-2 transition-all duration-300 ease-in-out
                text-[#f4e5c3] border-[#c0a080]
                shadow-[2px_2px_0px_#a67c52] 
                bg-[radial-gradient(circle,_#795649,_#5b3b2b)]
                ${!hasAnswered ? 'cursor-pointer hover:bg-[radial-gradient(circle,_#a1784d,_#5b3b2b)] hover:shadow-[0px_0_5px_5px_rgba(255,255,255,0.1)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] active:translate-y-[2px]' : 'cursor-default'}
                ${ringColor && `ring-2 ${ringColor}`}
                ${feedback && !isCorrectAnswer ? 'opacity-50' : ''}
                ${feedback && isCorrectAnswer ? 'bg-green-300 border-green-700 text-green-900' : ''}
              `}
            >
              {answer}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default QuestionsContent;
