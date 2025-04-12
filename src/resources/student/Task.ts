import { Submission } from '@/resources/student/Submission';
import { TaskFile } from '@/resources/common/TaskFile';

export interface Task {
    id: number;
    groupID: number;
    name: string;
    category: string;
    translatedCategory: string;
    description: string;
    softDeadline: string;
    hardDeadline: string;
    available?: string;
    creatorName: string;
    submission: Submission;
    taskFiles: TaskFile[];
    gitInfo?: {
        path: string
        usage: string
    }
    autoTest: number;
    exitPasswordProtected: boolean;
    entryPasswordProtected: boolean;
    entryPasswordUnlocked: boolean;
    canvasUrl?: string;
    appType?: string;
    isSubmissionCountRestricted: boolean;
    submissionLimit: number;
}
