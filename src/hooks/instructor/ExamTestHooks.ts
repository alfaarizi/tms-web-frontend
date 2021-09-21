import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as ExamTestsService from 'api/instructor/ExamTestsService';
import { ExamTest } from 'resources/instructor/ExamTest';
import { QUERY_KEY as QUESTIONS_QUERY_KEY } from './ExamQuestionHooks';

export const QUERY_KEY = 'instructor/exam-tests';

export function useTests(semesterID: number) {
    return useQuery([QUERY_KEY, { semesterID }], () => ExamTestsService.index(semesterID));
}

export function useTest(id: number) {
    return useQuery([QUERY_KEY, { id }], () => ExamTestsService.view(id));
}

export function useCreateTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((test: ExamTest) => ExamTestsService.create(test), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const oldList = queryClient.getQueryData<ExamTest[]>(QUERY_KEY);
            if (oldList) {
                queryClient.setQueryData(QUERY_KEY, [...oldList, data]);
            }
        },
    });
}

export function useUpdateTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((test: ExamTest) => ExamTestsService.update(test), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const oldList = queryClient.getQueryData<ExamTest[]>(QUERY_KEY);
            if (oldList) {
                queryClient.setQueryData(QUERY_KEY, oldList.map((test) => (test.id === data.id ? data : test)));
            }
        },
    });
}

export function useRemoveTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => ExamTestsService.remove(id), {
        onSuccess: (_data, id) => {
            const oldList = queryClient.getQueryData<ExamTest[]>(QUERY_KEY);
            if (oldList) {
                queryClient.setQueryData(QUERY_KEY, oldList.filter((test) => test.id !== id));
            }
        },
    });
}

export function useDuplicateTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => ExamTestsService.duplicate(id), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const oldList = queryClient.getQueryData<ExamTest[]>(QUERY_KEY);
            if (oldList) {
                queryClient.setQueryData(QUERY_KEY, [...oldList, data]);
            }
        },
    });
}

export function useFinalizeTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => ExamTestsService.finalize(id), {
        onSuccess: async (_data, id) => {
            await queryClient.invalidateQueries([QUESTIONS_QUERY_KEY, { testID: id }]);
        },
    });
}
