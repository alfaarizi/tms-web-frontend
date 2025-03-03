import { User } from 'resources/common/User';

export interface QuizTestInstance {
    id: number;
    score: number;
    user: User;
    testDuration: number;
}
