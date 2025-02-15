import { QuizWriterQuestion } from '@/resources/student/QuizWriterQuestion';

export interface QuizWriterData {
    testName: string;
    duration: number;
    questions: QuizWriterQuestion[];
}
