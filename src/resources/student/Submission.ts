import { CodeCheckerResult } from '@/resources/student/CodeCheckerResult';

export interface Submission {
    id: number;
    name?: string;
    uploadTime?: string;
    status: string;
    translatedStatus: string;
    grade: number;
    notes: string;
    isVersionControlled: number;
    graderName: string;
    errorMsg?: string;
    uploadCount: number;
    taskID: number;
    verified: boolean;
    codeCheckerResult: CodeCheckerResult;
    personalDeadline?: string;
}
