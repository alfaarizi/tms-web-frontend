import { useQuery } from 'react-query';
import { index } from 'api/instructor/ExamTestInstancesService';

export const QUERY_KEY = 'instructor/exam-test-instances';

export function useExamTestInstances(testID: number, submitted?: boolean) {
    return useQuery([QUERY_KEY, {
        testID,
        submitted,
    }], () => index(testID, submitted));
}
