import { useQuery } from 'react-query';
import { index } from 'api/instructor/QuizTestInstancesService';

export const QUERY_KEY = 'instructor/quiz-test-instances';

export function useQuizTestInstances(testID: number, submitted?: boolean) {
    return useQuery([QUERY_KEY, {
        testID,
        submitted,
    }], () => index(testID, submitted));
}
