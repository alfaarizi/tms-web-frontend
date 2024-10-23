export interface GridSubmission {
    id: number;
    status: string;
    translatedStatus: string;
    grade?: number;
    uploaderID: number;
    verified: boolean;
}
