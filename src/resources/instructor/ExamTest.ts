import { Group } from 'resources/instructor/Group';

export interface ExamTest {
    id: number;
    name: string;
    questionamount: number;
    duration: number;
    shuffled: number;
    unique: number;
    availablefrom: string;
    availableuntil: string;
    groupID: number;
    questionsetID: number;
    semesterID: number;
    timezone: string;
    group?: Group;
}
