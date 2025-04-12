import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as QuizQuestionsService from '@/api/instructor/QuizQuestionsService';
import { QuizQuestion } from '@/resources/instructor/QuizQuestion';

export const QUERY_KEY = 'instructor/quiz-question';

export function useQuestionsForSet(questionsetID: number) {
    return useQuery([QUERY_KEY, { questionsetID }], () => QuizQuestionsService.listForQuestionSet(questionsetID));
}

export function useQuestionsForTest(enabled: boolean, testID: number, userID?: number) {
    return useQuery([QUERY_KEY, {
        testID,
        userID,
    }], () => QuizQuestionsService.listForTest(testID, userID), {
        enabled,
    });
}

export function useCreateQuestionMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: QuizQuestion) => QuizQuestionsService.create(data), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { questionsetID: data.questionsetID }];

            const oldData = queryClient.getQueryData<QuizQuestion[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, [...oldData, data]);
            } else {
                queryClient.setQueryData(key, [data]);
            }
        },
    });
}

export function useUpdateQuestionMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: QuizQuestion) => QuizQuestionsService.update(data), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { questionsetID: data.questionsetID }];

            const oldData = queryClient.getQueryData<QuizQuestion[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, oldData.map((question) => (question.id === data.id ? data : question)));
            }
        },
    });
}

export function useRemoveQuestionMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: QuizQuestion) => QuizQuestionsService.remove(data.id), {
        onSuccess: (_data, variables) => {
            const key = [QUERY_KEY, { questionsetID: variables.questionsetID }];

            const oldData = queryClient.getQueryData<QuizQuestion[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, oldData.filter((question) => question.id !== variables.id));
            }
        },
    });
}
