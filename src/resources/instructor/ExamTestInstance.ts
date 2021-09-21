import { User } from 'resources/common/User';

export interface ExamTestInstance {
    id: number;
    score: number;
    user: User;
    testDuration: number;
}
