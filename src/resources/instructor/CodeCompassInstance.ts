export interface CodeCompassInstance {
    id: number;
    studentFileId: number;
    starterUserId: number;
    port?: number;
    status: Status;
    errorLogs?: string;
    username?: string;
    password?: string;
}

export enum Status {
    running = 'RUNNING',
    starting = 'STARTING',
    waiting = 'WAITING'
}
