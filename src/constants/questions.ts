import type { Category } from "./categories"

export type Question = {
  question: string
  answers: string[]
  correctAnswer: string
  category: Category
}

export type Feedback = {
  selected: string;
  enemySelected: string | null;
}
