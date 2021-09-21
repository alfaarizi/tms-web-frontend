import { ExamWriterAnswer } from 'resources/student/ExamWriterAnswer';

export interface ExamWriterQuestion {
    id: number;
    text: string;
    answers: ExamWriterAnswer[];
    selectedAnswerID: number | null;
}
