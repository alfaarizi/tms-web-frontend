import { Course } from 'resources/common/Course';

export interface Group {
    id: number;
    number: number;
    course: Course;
    instructorNames: string[];
    timezone: string;
    isCanvasCourse: boolean;
    canvasUrl?: string;
    lastSyncTime?: string;
    notes?: string;
    isExamGroup: boolean;
}
