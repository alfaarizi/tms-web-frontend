import { useMutation, useQuery, useQueryClient } from 'react-query';

import * as StudentFilesService from 'api/student/StudentFilesService';

export const QUERY_KEY = 'student/student-files';

export function useAutoTestResults(id: number) {
    return useQuery(
        [QUERY_KEY, 'auto-tester-results', { id }],
        () => StudentFilesService.autoTesterResults(id),
    );
}
