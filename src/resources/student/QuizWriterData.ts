import { QuizWriterQuestion } from './QuizWriterQuestion';

export interface QuizWriterData {
    testName: string;
    duration: number;
    questions: QuizWriterQuestion[];
}
