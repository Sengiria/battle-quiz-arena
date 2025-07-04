
import type { Category } from '../constants/categories';
import type { Question } from '../constants/questions';
import { QUESTIONS } from '../data/questions/index';
import { shuffleArray } from './shuffleArray';

export const getRandomQuestions = (count: number, excludedCategories: Category[]): Question[] => {
  const filtered = QUESTIONS.filter((q) => !excludedCategories.includes(q.category))
  const shuffled = shuffleArray(filtered)
  return shuffled.slice(0, count)
}