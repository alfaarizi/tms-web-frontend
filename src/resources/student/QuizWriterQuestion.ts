import { QuizWriterAnswer } from 'resources/student/QuizWriterAnswer';

export interface QuizWriterQuestion {
    id: number;
    text: string;
    answers: QuizWriterAnswer[];
    selectedAnswerID: number | null;
}
