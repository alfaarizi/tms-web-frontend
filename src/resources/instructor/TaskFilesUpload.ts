export interface TaskFilesUpload {
    taskID: number;
    category: string;
    files: File[];
    override?: boolean;
}
