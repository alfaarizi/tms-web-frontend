import { User } from '@/resources/common/User';
import { CodeCheckerResult } from '@/resources/instructor/CodeCheckerResult';
import { Task } from '@/resources/instructor/Task';
import { CodeCompassInstance } from '@/resources/instructor/CodeCompassInstance';
import { WebAppExecution } from '@/resources/instructor/WebAppExecution';

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
    uploader: User;
    uploaderID: number;
    uploadCount: number;
    taskID: number;
    groupID: number;
    task?: Task;
    execution?: WebAppExecution,
    gitRepo?: string;
    delay?: string;
    ipAddresses: string[];
    verified: boolean;
    codeCompass?: CodeCompassInstance;
    codeCheckerResult?: CodeCheckerResult;
}
