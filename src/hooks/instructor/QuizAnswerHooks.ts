import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as QuizAnswersService from 'api/instructor/QuizAnswersService';
import { QuizAnswer } from 'resources/instructor/QuizAnswer';

export const QUERY_KEY = 'instructor/quiz-answer';

export function useAnswers(questionID: number) {
    return useQuery([QUERY_KEY, { questionID }], () => QuizAnswersService.index(questionID));
}

export function useCreateAnswerMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: QuizAnswer) => QuizAnswersService.create(data), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { questionID: data.questionID }];

            const oldData = queryClient.getQueryData<QuizAnswer[]>(key);
            if (oldData) {
                if (data.correct) {
                    await queryClient.invalidateQueries(key);
                } else {
                    queryClient.setQueryData(key, [...oldData, data]);
                }
            } else {
                queryClient.setQueryData(key, [data]);
            }
        },
    });
}

export function useUpdateAnswerMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: QuizAnswer) => QuizAnswersService.update(data), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { questionID: data.questionID }];

            const oldData = queryClient.getQueryData<QuizAnswer[]>(key);
            if (oldData) {
                if (data.correct) {
                    await queryClient.invalidateQueries(key);
                } else {
                    queryClient.setQueryData(key, oldData.map((answer) => (answer.id === data.id ? data : answer)));
                }
            }
        },
    });
}

export function useRemoveAnswerMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: QuizAnswer) => QuizAnswersService.remove(data.id), {
        onSuccess: (_data, variables) => {
            const key = [QUERY_KEY, { questionID: variables.questionID }];

            const oldData = queryClient.getQueryData<QuizAnswer[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, oldData.filter((answer) => answer.id !== variables.id));
            }
        },
    });
}
