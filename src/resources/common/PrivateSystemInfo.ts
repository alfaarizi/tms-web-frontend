import { Semester } from './Semester';

export interface PrivateSystemInfo {
    uploadMaxFilesize: number;
    postMaxSize: number;
    maxWebAppRunTime: number;
    actualSemester: Semester,
    isAutoTestEnabled: boolean;
    isVersionControlEnabled: boolean;
    isCanvasEnabled: boolean;
    isCodeCompassEnabled: boolean;
    userCodeFormat: string;
    serverDateTime: string;
}
