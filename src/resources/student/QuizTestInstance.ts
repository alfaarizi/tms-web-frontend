import { QuizTest } from '@/resources/student/QuizTest';

export interface QuizTestInstance {
    id: number;
    starttime: string;
    finishtime: string;
    submitted: number;
    score: number;
    maxScore: number;
    test: QuizTest;
    isUnlocked: boolean;
}
