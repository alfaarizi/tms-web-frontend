import { Course } from '@/resources/common/Course';

export interface PlagiarismBasefile {
    id: number;
    name: string;
    lastUpdateTime: string;
    course?: Course;
    deletable?: boolean;
}
