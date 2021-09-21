import { useQuery } from 'react-query';

import { index } from 'api/instructor/CoursesService';
import { Course } from 'resources/common/Course';

export const QUERY_KEY = 'instructor/courses';

export function useCourses(instructor: boolean, forGroups: boolean, enabled: boolean = true) {
    return useQuery<Course[]>([QUERY_KEY], () => index(instructor, forGroups), { enabled });
}
