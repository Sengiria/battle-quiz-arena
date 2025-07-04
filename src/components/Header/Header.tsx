import HealthBar from '../HealthBar/HealthBar';
import type { HeaderProps } from './types';
const base = import.meta.env.BASE_URL;

const Header = ({
  current,
  total,
  playerHp = 7,
  enemyHp = 7,
  maxHealth = 7,
  excludedCategories,
  playerName,
  enemyName,
  isCastlePlayer,
}: HeaderProps) => {
  const castleIcon = `${base}assets/castle_icon.png`;
  const swordIcon = `${base}assets/swords_icon.png`;

  const PlayerDisplay = ({
    name,
    isCastle,
    hp,
  }: { name: string | null; isCastle: boolean; hp: number }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 text-xs font-semibold">
        <img
          src={isCastle ? castleIcon : swordIcon}
          alt="role icon"
          className="w-4 h-4 object-contain aspect-square"
        />
        <span className="truncate max-w-[80px]">{name || ''}</span>
      </div>
      <HealthBar current={hp} max={maxHealth} />
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-2 px-3 py-2 bg-[#f4e5c3] border-b border-[#c0a080] shadow text-[#4b3a2f] font-serif text-sm sm:text-base">

      {/* Top row: both players side by side on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        <PlayerDisplay
          name={isCastlePlayer ? playerName : enemyName}
          isCastle={true}
          hp={isCastlePlayer ? playerHp : enemyHp}
        />
        <PlayerDisplay
          name={isCastlePlayer ? enemyName : playerName}
          isCastle={false}
          hp={isCastlePlayer ? enemyHp : playerHp}
        />
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayerDisplay
            name={isCastlePlayer ? playerName : enemyName}
            isCastle={true}
            hp={isCastlePlayer ? playerHp : enemyHp}
          />
        </div>
        <div className="flex flex-col items-center text-center flex-1 px-2">
          <div className="font-bold text-base sm:text-lg">🗡️ Battle Quiz</div>
          {total > 0 && (
            <div className="text-xs sm:text-sm">Question {current + 1} / {total}</div>
          )}
          <div className="text-xs sm:text-sm break-words max-w-full">
            Excluded: {excludedCategories.map((cat, i) => (
              <span key={cat} className="mx-0.5">
                {cat}{i < excludedCategories.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PlayerDisplay
            name={isCastlePlayer ? enemyName : playerName}
            isCastle={false}
            hp={isCastlePlayer ? enemyHp : playerHp}
          />
        </div>
      </div>

      {/* Middle info for mobile */}
      <div className="flex flex-col sm:hidden items-center text-center">
        <div className="font-bold text-base">🗡️ Battle Quiz</div>
        {total > 0 && (
          <div className="text-xs">Question {current + 1} / {total}</div>
        )}
        <div className="text-xs break-words max-w-full">
          Excluded: {excludedCategories.map((cat, i) => (
            <span key={cat} className="mx-0.5">
              {cat}{i < excludedCategories.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
