import { Group } from 'resources/instructor/Group';
import { Semester } from 'resources/common/Semester';

export interface Task {
    id: number;
    name: string;
    category: string;
    translatedCategory: string;
    description: string;
    available?: string;
    softDeadline?: string;
    hardDeadline: string;
    autoTest: number;
    isVersionControlled?: boolean;
    groupID: number;
    semesterID: number;
    creatorName: string;
    testOS: string;
    showFullErrorMsg: number;
    reevaluateAutoTest: number;
    imageName?: string;
    compileInstructions: string;
    runInstructions?: string;
    codeCompassCompileInstructions?: string;
    codeCompassPackagesInstallInstructions?: string;
    group?: Group;
    semester?: Semester;
    canvasUrl?: string;
}
