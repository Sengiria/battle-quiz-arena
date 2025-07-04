import type { Feedback, Question } from "../../constants/questions";

export type QuestionsContentProps = {
  question: Question;
  onSelect: (answer: string) => void;
  feedback: Feedback | null;
}
