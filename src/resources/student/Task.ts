import { StudentFile } from 'resources/student/StudentFile';
import { InstructorFile } from 'resources/common/InstructorFile';

export interface Task {
    id: number;
    name: string;
    category: string;
    translatedCategory: string;
    description: string;
    softDeadline: string;
    hardDeadline: string;
    available?: string;
    creatorName: string;
    studentFiles: StudentFile[];
    instructorFiles: InstructorFile[];
    gitInfo?: {
        path: string
        usage: string
    }
    autoTest: number;
    passwordProtected: boolean;
    canvasUrl?: string;
}
