export interface WebAppExecution {
    id: number,
    submissionID: number,
    instructorID: number,
    port: number,
    startedAt: string,
    shutdownAt: string,
    containerName: string,
    url: string
}
