import { ExamTest } from 'resources/student/ExamTest';

export interface ExamTestInstance {
    id: number;
    starttime: string;
    finishtime: string;
    submitted: number;
    score: number;
    maxScore: number;
    test: ExamTest;
}
