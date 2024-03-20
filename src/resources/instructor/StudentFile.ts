import { User } from 'resources/common/User';
import { CodeCheckerResult } from 'resources/instructor/CodeCheckerResult';
import { Task } from './Task';
import { CodeCompassInstance } from './CodeCompassInstance';
import { WebAppExecution } from './WebAppExecution';

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
