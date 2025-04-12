import { Semester } from '@/resources/common/Semester';

export interface PrivateSystemInfo {
    uploadMaxFilesize: number;
    postMaxSize: number;
    maxWebAppRunTime: number;
    actualSemester: Semester,
    isAutoTestEnabled: boolean;
    isVersionControlEnabled: boolean;
    isCanvasEnabled: boolean;
    isCodeCompassEnabled: boolean;
    serverDateTime: string;
}
