export interface TaskFilesUpload {
    taskID: number;
    category: string;
    files: File[];
    overwrite?: boolean;
}
