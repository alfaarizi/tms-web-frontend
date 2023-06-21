import { Course } from 'resources/common/Course';
import { Instructor } from 'resources/instructor/Instructor';

export interface Group {
    id: number;
    number?: number;
    course: Course;
    courseID?: number;
    isExamGroup: number;
    semesterID: number;
    canvasCanBeSynchronized: boolean;
    isCanvasCourse: boolean;
    timezone: string;
    canvasUrl?: string;
    lastSyncTime?: string;
    instructors?: Instructor[];
}
