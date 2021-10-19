export interface ExamTest {
    id: number;
    name: string;
    questionamount: number;
    duration: number;
    shuffled: number;
    unique: number;
    availablefrom: string;
    availableuntil: string;
    courseName: string;
    groupNumber: number;
    groupID: number;
    questionsetID: number;
    courseID: number;
    semesterID: number;
    timezone: string;
}
