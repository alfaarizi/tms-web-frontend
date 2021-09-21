import { Course } from 'resources/common/Course';

export interface ExamQuestionSet {
    id: number;
    name: string;
    courseID: number;
    course: Course
}
