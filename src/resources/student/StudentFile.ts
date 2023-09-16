import { CodeCheckerResult } from 'resources/student/CodeCheckerResult';
import { AutoTesterResult } from 'resources/common/AutoTesterResult';

export interface StudentFile {
    id: number;
    name?: string;
    uploadTime?: string;
    isAccepted: string;
    translatedIsAccepted: string;
    grade: number;
    notes: string;
    isVersionControlled: number;
    graderName: string;
    errorMsg?: string;
    uploadCount: number;
    taskID: number;
    verified: boolean;
    codeCheckerResult: CodeCheckerResult;
}
