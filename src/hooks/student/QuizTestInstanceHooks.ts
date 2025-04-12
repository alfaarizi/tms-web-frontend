import * as QuizTestInstancesService from '@/api/student/QuizTestInstancesService';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { QuizTestInstanceAnswer } from '@/resources/student/QuizTestInstanceAnswer';
import { UnlockTest } from '@/resources/student/UnlockTest';

export const QUERY_KEY = 'student/quiz-test-instances';

export function useTestInstances(semesterID: number, submitted: boolean, future: boolean) {
    return useQuery([QUERY_KEY, {
        semesterID,
        submitted,
        future,
    }], () => QuizTestInstancesService.index(semesterID, submitted, future));
}

export function useTestInstance(id: number) {
    return useQuery([QUERY_KEY, { id }], () => QuizTestInstancesService.view(id));
}

export function useResults(id: number, enabled: boolean) {
    return useQuery([QUERY_KEY, { id }, 'results'], () => QuizTestInstancesService.results(id || 0), {
        enabled,
    });
}

export function useStartWriteMutation() {
    return useMutation((id: number) => QuizTestInstancesService.startWrite(id));
}

export function useFinishWriteMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation(
        (arr: QuizTestInstanceAnswer[]) => QuizTestInstancesService.finishWrite(id, arr),
        {
            onSuccess: async () => {
                // Invalidate all queries starting with QUERY_KEY
                await queryClient.invalidateQueries(QUERY_KEY);
            },
        },
    );
}

export function useUnlockTestMutation() {
    return useMutation(
        (data: UnlockTest) => QuizTestInstancesService.unlock(data),
    );
}
