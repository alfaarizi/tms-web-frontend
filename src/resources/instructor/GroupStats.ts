export interface Submitted {
    intime: number;
    delayed: number;
    missed: number;
}

export interface GroupStats {
    taskID: number;
    name: string;
    points: number[];
    submitted: Submitted;
}
