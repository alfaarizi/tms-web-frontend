export interface RequestPlagiarism {
    name: string;
    description: string;
    selectedTasks: number[];
    selectedStudents: number[];
    selectedBasefiles: number[];
    ignoreThreshold: number;
}
