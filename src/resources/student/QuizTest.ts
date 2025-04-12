import { Group } from '@/resources/instructor/Group';

export interface QuizTest {
    name: string;
    availablefrom: string;
    availableuntil: string;
    duration: number;
    groupID: number;
    group?: Group;
}
