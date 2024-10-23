import { useMutation, useQuery, useQueryClient } from 'react-query';

import * as SubmissionsService from 'api/student/SubmissionsService';

export const QUERY_KEY = 'student/submissions';

export function useAutoTestResults(id: number) {
    return useQuery(
        [QUERY_KEY, 'auto-tester-results', { id }],
        () => SubmissionsService.autoTesterResults(id),
    );
}
