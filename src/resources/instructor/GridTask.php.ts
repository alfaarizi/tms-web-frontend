import { GridSubmission } from '@/resources/instructor/GridSubmission';

export interface GridTask {
    id: number;
    name: string;
    submissions: GridSubmission[],
    available?: string;
    softDeadline?: string;
    hardDeadline: string;
    translatedCategory: string;
}
