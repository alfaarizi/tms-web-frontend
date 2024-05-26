import { Semester } from './Semester';

export interface PrivateSystemInfo {
    uploadMaxFilesize: number;
    postMaxSize: number;
    actualSemester: Semester,
    isAutoTestEnabled: boolean;
    isVersionControlEnabled: boolean;
    isCanvasEnabled: boolean;
    isCodeCompassEnabled: boolean;
    serverDateTime: string;
}
