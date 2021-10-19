import * as ExamTestInstancesService from 'api/student/ExamTestInstancesService';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ExamTestInstanceAnswer } from 'resources/student/ExamTestInstanceAnswer';

export const QUERY_KEY = 'student/exam-test-instances';

export function useTestInstances(semesterID: number, submitted: boolean) {
    return useQuery([QUERY_KEY, {
        semesterID,
        submitted,
    }], () => ExamTestInstancesService.index(semesterID, submitted));
}

export function useTestInstance(id: number) {
    return useQuery([QUERY_KEY, { id }], () => ExamTestInstancesService.view(id));
}

export function useResults(id: number, enabled: boolean) {
    return useQuery([QUERY_KEY, { id }, 'results'], () => ExamTestInstancesService.results(id || 0), {
        enabled,
    });
}

export function useStartWriteMutation() {
    return useMutation((id: number) => ExamTestInstancesService.startWrite(id));
}

export function useFinishWriteMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation(
        (arr: ExamTestInstanceAnswer[]) => ExamTestInstancesService.finishWrite(id, arr),
        {
            onSuccess: async () => {
                // Invalidate all queries starting with QUERY_KEY
                await queryClient.invalidateQueries(QUERY_KEY);
            },
        },
    );
}
