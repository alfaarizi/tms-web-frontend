export interface WebAppExecution {
    id: number,
    studentFileID: number,
    instructorID: number,
    port: number,
    startedAt: string,
    shutdownAt: string,
    containerName: string,
    url: string
}
