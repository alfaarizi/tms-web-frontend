import { Course } from '@/resources/common/Course';

export interface QuizQuestionSet {
    id: number;
    name: string;
    courseID: number;
    course: Course
}
