import { Course } from '@/resources/common/Course';
import { Instructor } from '@/resources/instructor/Instructor';
import { CanvasSyncLevel } from '@/resources/instructor/CanvasSyncLevel';

export interface Group {
    id: number;
    number?: number;
    course: Course;
    courseID?: number;
    isExamGroup: number;
    semesterID: number;
    canvasCanBeSynchronized: boolean;
    isCanvasCourse: boolean;
    syncLevelArray: CanvasSyncLevel[];
    timezone: string;
    canvasUrl?: string;
    lastSyncTime?: string;
    instructors?: Instructor[];
    day?: number|null;
    startTime?: string|null;
    roomNumber: string;
}
