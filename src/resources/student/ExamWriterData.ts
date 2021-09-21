import { ExamWriterQuestion } from 'resources/student/ExamWriterQuestion';

export interface ExamWriterData {
    testName: string;
    duration: number;
    questions: ExamWriterQuestion[];
}
