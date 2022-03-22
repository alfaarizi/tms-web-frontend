import { GridStudentFile } from 'resources/instructor/GridStudentFile';

export interface GridTask {
    id: number;
    name: string;
    studentFiles: GridStudentFile[],
    available?: string;
    softDeadline?: string;
    hardDeadline: string;
    translatedCategory: string;
}
