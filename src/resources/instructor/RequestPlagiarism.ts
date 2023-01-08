import { PlagiarismType } from './PlagiarismType';

export interface RequestPlagiarism {
    type: PlagiarismType;
    name: string;
    description: string;
    selectedTasks: number[];
    selectedStudents: number[];
    selectedBasefiles: number[];
    ignoreThreshold: number;
    tune: number;
    ignoreFiles: string[];
}
