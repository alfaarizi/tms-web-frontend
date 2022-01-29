export interface Plagiarism {
    id: number;
    semesterID: number;
    name: string;
    description: string;
    url: string | null;
    ignoreThreshold: number;
}
