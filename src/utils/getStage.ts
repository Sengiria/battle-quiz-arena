export const getStageFromHp = (hp: number, maxHp = 7) => {
  const clamped = Math.max(0, Math.min(hp, maxHp));
  const progress = 1 - clamped / maxHp;
  return Math.min(4, Math.floor(progress * 5)); // for 5 stages (0–4)
};
