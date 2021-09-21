export interface StudentStats {
    taskID: number;
    name: string;
    submittingTime: string;
    softDeadLine: string;
    hardDeadLine: string;
    user?: number;
    username: string;
    group: number[];
}
