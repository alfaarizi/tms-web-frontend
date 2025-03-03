import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as QuizTestsService from 'api/instructor/QuizTestsService';
import { QuizTest } from 'resources/instructor/QuizTest';
import { QUERY_KEY as QUESTIONS_QUERY_KEY } from 'hooks/instructor/QuizQuestionHooks';

export const QUERY_KEY = 'instructor/quiz-tests';

export function useTests(semesterID: number) {
    return useQuery([QUERY_KEY, { semesterID }], () => QuizTestsService.index(semesterID));
}

export function useTest(id: number) {
    return useQuery([QUERY_KEY, { id }], () => QuizTestsService.view(id));
}

export function useCreateTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((test: QuizTest) => QuizTestsService.create(test), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const listKey = [QUERY_KEY, { semesterID: data.semesterID }];
            const oldList = queryClient.getQueryData<QuizTest[]>(listKey);
            if (oldList) {
                queryClient.setQueryData(listKey, [...oldList, data]);
            }
        },
    });
}

export function useUpdateTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((test: QuizTest) => QuizTestsService.update(test), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const listKey = [QUERY_KEY, { semesterID: data.semesterID }];
            const oldList = queryClient.getQueryData<QuizTest[]>(listKey);
            if (oldList) {
                queryClient.setQueryData(listKey, oldList.map((test) => (test.id === data.id ? data : test)));
            }
        },
    });
}

export function useRemoveTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((test: QuizTest) => QuizTestsService.remove(test.id), {
        onSuccess: (_data, variables) => {
            const listKey = [QUERY_KEY, { semesterID: variables.semesterID }];
            const oldList = queryClient.getQueryData<QuizTest[]>(listKey);
            if (oldList) {
                queryClient.setQueryData(listKey, oldList.filter((test) => test.id !== variables.id));
            }
        },
    });
}

export function useDuplicateTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => QuizTestsService.duplicate(id), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const listKey = [QUERY_KEY, { semesterID: data.semesterID }];
            const oldList = queryClient.getQueryData<QuizTest[]>(listKey);
            if (oldList) {
                queryClient.setQueryData(listKey, [...oldList, data]);
            }
        },
    });
}

export function useFinalizeTestMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => QuizTestsService.finalize(id), {
        onSuccess: async (_data, id) => {
            await queryClient.invalidateQueries([QUERY_KEY, { id }]);
            await queryClient.invalidateQueries([QUESTIONS_QUERY_KEY, { testID: id }]);
        },
    });
}
