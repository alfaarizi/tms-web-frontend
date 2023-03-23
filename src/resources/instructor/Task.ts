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
    appType?: string;
    showFullErrorMsg: number;
    password?: string;
    imageName?: string;
    compileInstructions: string;
    runInstructions?: string;
    codeCompassCompileInstructions?: string;
    codeCompassPackagesInstallInstructions?: string;
    group?: Group;
    semester?: Semester;
    canvasUrl?: string;
    port?: number;
    staticCodeAnalysis: boolean;
    staticCodeAnalyzerTool?: string;
    staticCodeAnalyzerInstructions?: string;
    codeCheckerCompileInstructions?: string;
    codeCheckerToggles?: string;
    codeCheckerSkipFile?: string;
    taskLevelGitRepo?: string;
}
