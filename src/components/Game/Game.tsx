import { useEffect, useState } from 'react'
import CardWrapper from '../../components/CardWrapper/CardWrapper'
import CategorySelector from '../../components/CategorySelector/CategorySelector'
import QuestionContent from '../../components/QuestionsContent/QuestionsContent'
import { PHASE_CATEGORY, PHASE_GAME_OVER, PHASE_MENU, PHASE_PLAY, PHASE_TIE, PHASE_WAITING, PHASE_WIN } from '../../constants/gamePhase'
import { ALL_CATEGORIES, type Category } from '../../constants/categories'
import Header from '../../components/Header/Header'
import Castle from '../../components/Castle/Castle'
import Army from '../../components/Army/Army'
import Intro from '../../components/Intro/Intro'
import GameEndScreen from '../../components/EndScreen/EndScreen'
import { getStageFromHp } from '../../utils/getStage'
import { CARD_MOUNT_DELAY } from '../../constants/gameConfig'
import { useIntro } from '../../hooks/useIntro'
import { useGameStore } from '../../store/useGameStore'
import Menu from '../Menu/Menu'
import { listenToPlayerData } from '../../firebase/player'
import Button from '../Button/Button'
import { excludeCategory } from '../../firebase/category'
import { answerQuestion } from '../../firebase/round'
const base = import.meta.env.BASE_URL;

const Game = ({ isTest = false }: { isTest?: boolean }) => {
  const playerId = useGameStore((s) => s.playerId);
  const playerName = useGameStore((s) => s.playerName);
  const enemyName = useGameStore((s) => s.enemyName);
  const roomCode = useGameStore((s) => s.roomCode);
  const phase = useGameStore((s) => s.phase);
  const playerHp = useGameStore((s) => s.playerHp);
  const enemyHp = useGameStore((s) => s.enemyHp);
  const round = useGameStore((s) => s.round);
  const excludedCategories = useGameStore((s) => s.excludedCategories);
  const questions = useGameStore((s) => s.questions);
  const feedback = useGameStore((s) => s.feedback);
  const setPhase = useGameStore((s) => s.setPhase);
  const resetGame = useGameStore((s) => s.resetGame);
  const setFeedback = useGameStore((s) => s.setFeedback);
    const isPlayerOne = useGameStore((s) => s.isPlayerOne);

  const [excludedCategory, setExcludedCategory] = useState<Category | null>(null)
  const [disabledExcludeCategoryBtn, setDisabledExcludeCategoryBtn] = useState<boolean>(false)
  const { showIntro, introVisible } = useIntro(isTest);
  const [showCardWrapper, setShowCardWrapper] = useState(false);
  const isCastle = isPlayerOne;
  const [prevRound, setPrevRound] = useState(round);
  const [showCastleBoom, setShowCastleBoom] = useState(false);
  const [showArmyBoom, setShowArmyBoom] = useState(false);

  useEffect(() => {
    setPrevRound(round);
  }, []);

  useEffect(() => {
    if (round === prevRound) return;

    setShowCardWrapper(false);

    const lastFeedback = useGameStore.getState().feedback;

    const { selected, enemySelected } = lastFeedback ?? {};
    const correctAnswer = questions[prevRound]?.correctAnswer;

    const playerCorrect = selected === correctAnswer;
    const enemyCorrect = enemySelected === correctAnswer;

    if (playerCorrect && !enemyCorrect) {
      setShowArmyBoom(true);
    } else if (!playerCorrect && enemyCorrect) {
      setShowCastleBoom(true);
    } else if (!playerCorrect && !enemyCorrect) {
      setShowArmyBoom(true);
      setShowCastleBoom(true);
    }

    const timeout = setTimeout(() => {
      setShowArmyBoom(false);
      setShowCastleBoom(false);
      setShowCardWrapper(true);
      setPrevRound(round);
      setFeedback(null);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [round]);

  useEffect(() => {
    if (phase !== PHASE_PLAY || playerHp == null || enemyHp == null) return;

    if (playerHp <= 0 && enemyHp <= 0) {
      setPhase(PHASE_TIE);
    } else if (playerHp <= 0) {
      setPhase(PHASE_GAME_OVER);
    } else if (enemyHp <= 0) {
      setPhase(PHASE_WIN);
    }
  }, [playerHp, enemyHp]);

  useEffect(() => {
    if (!roomCode || !playerId) return;
    const unsubscribe = listenToPlayerData(roomCode, playerId, setPhase);
    return () => unsubscribe();
  }, [roomCode, playerId]);

  const handleCategorySelection = () => {
    if (!excludedCategory || !roomCode || !playerId) return;
    excludeCategory(excludedCategory, roomCode, playerId)
    setDisabledExcludeCategoryBtn(true)
  }

  const handleAnswer = (selected: string) => {
    if (!roomCode || !playerId || !selected) return;
    answerQuestion(selected, roomCode, playerId)
  };

  const handleReset = () => {
    resetGame();
    setExcludedCategory(null)
    setDisabledExcludeCategoryBtn(false)
  }

  useEffect(() => {
    if (isTest) {
      setShowCardWrapper(true)
      return
    }
    const delay = setTimeout(() => {
      setShowCardWrapper(true);
    }, CARD_MOUNT_DELAY);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${base}assets/backgrounds/battlefield.png`}
          alt="Battlefield"
          className="w-full h-full object-cover select-none"
        />
      </div>

      {/* Intro */}
      {showIntro && <Intro visible={introVisible} />}

      {/* Castle (always blue player) */}
      <div
        className="absolute left-1/2 top-[30%] sm:top-[10%] z-10 transition-opacity duration-1000 ease-out opacity-0 animate-[fadeInSlide_1s_ease-out_0.2s_forwards]"
        style={{ transform: 'translateX(-50%)', width: '600px', maxWidth: '80vw' }}
      >
        <Castle
          stage={isCastle ? getStageFromHp(playerHp) : getStageFromHp(enemyHp)}
          showDamageEffect={isCastle ? showCastleBoom : showArmyBoom}
        />
      </div>

      {/* Army (always red player) */}
      <div
        className="absolute bottom-[10%] left-1/2 z-10 opacity-0 \
[animation:fadeInSlide_1s_ease-out_1.5s_forwards] \
transition-opacity duration-1000 ease-out"
        style={{ transform: 'translateX(-50%)', width: '600px', maxWidth: '80vw' }}
      >
        <Army
          health={isCastle ? enemyHp : playerHp}
          maxHealth={7}
          showBoom={isCastle ? showArmyBoom : showCastleBoom}
        />
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header
          current={round}
          total={questions.length}
          playerHp={playerHp}
          enemyHp={enemyHp}
          excludedCategories={excludedCategories}
          playerName={playerName}
          enemyName={enemyName}
          isCastlePlayer={isCastle}
        />
      </div>

      {/* Game Content */}
      <div className="relative z-30 flex-1 flex justify-center items-center pt-[15vh] sm:pt-[25vh]">
        {showCardWrapper && (
          <CardWrapper keyProp={phase + '-' + prevRound}>
            {phase === PHASE_MENU &&
              <Menu setPhase={setPhase} />
            }

            {phase === PHASE_WAITING &&
              <>
                <p className="text-lg sm:text-xl text-shadow-lg text-[#795649] font-bold text-center drop-shadow p-2 w-full min-h-20 mt-4 break-words">
                  Waiting for another player to join...
                </p>
                <p className="text-lg sm:text-xl text-shadow-lg text-[#795649] font-bold text-center drop-shadow p-2 w-full min-h-20 mt-4 break-words">
                  Invite Code: <strong>{roomCode}</strong>
                </p>
              </>
            }

            {phase === PHASE_CATEGORY && (
              <div className="flex flex-col items-center gap-4 w-full">
                <CategorySelector
                  categories={ALL_CATEGORIES}
                  selected={excludedCategory}
                  onChange={setExcludedCategory}
                  disabledExcludeCategoryBtn={disabledExcludeCategoryBtn}
                />
                <Button onClick={handleCategorySelection} disabled={disabledExcludeCategoryBtn}>
                  Confirm
                </Button>
              </div>
            )}

            {phase === PHASE_PLAY && questions.length > 0 && (
              <QuestionContent
                question={questions[round]}
                onSelect={handleAnswer}
                feedback={feedback}
              />
            )}
          </CardWrapper>
        )}
      </div>

      {[PHASE_WIN, PHASE_GAME_OVER, PHASE_TIE].includes(phase) && (
        <GameEndScreen
          type={phase}
          onRestart={handleReset}
        />
      )}
    </div>
  )
}

export default Game;
