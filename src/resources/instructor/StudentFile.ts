import { User } from 'resources/common/User';
import { Task } from './Task';

export interface StudentFile {
    id: number;
    name: string;
    uploadTime: string;
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
    gitRepo?: string;
    delay?: string;
}
