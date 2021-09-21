import { Semester } from 'resources/common/Semester';

export interface UserInfo {
    id: number;
    neptun: string;
    locale: string;
    isStudent: boolean;
    isFaculty: boolean;
    isAdmin: boolean;
    actualSemester: Semester,
    isAutoTestEnabled: boolean;
    isVersionControlEnabled: boolean;
    isCanvasEnabled: boolean;
}
