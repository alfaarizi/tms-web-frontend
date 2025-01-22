export interface SubmissionGrade {
    id: number;
    status: string;
    grade: number | undefined;
    notes?: string;
}
