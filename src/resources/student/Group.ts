import { Course } from 'resources/common/Course';

export interface Group {
    id: number;
    number: number;
    course: Course;
    instructorNames: string[];
    canvasUrl?: string;
    notes?: string;
}
