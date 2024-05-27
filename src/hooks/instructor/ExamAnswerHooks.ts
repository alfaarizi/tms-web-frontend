import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as ExamAnswersService from 'api/instructor/ExamAnswersService';
import { ExamAnswer } from 'resources/instructor/ExamAnswer';

export const QUERY_KEY = 'instructor/exam-answer';

export function useAnswers(questionID: number) {
    return useQuery([QUERY_KEY, { questionID }], () => ExamAnswersService.index(questionID));
}

export function useCreateAnswerMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: ExamAnswer) => ExamAnswersService.create(data), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { questionID: data.questionID }];

            const oldData = queryClient.getQueryData<ExamAnswer[]>(key);
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

    return useMutation((data: ExamAnswer) => ExamAnswersService.update(data), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { questionID: data.questionID }];

            const oldData = queryClient.getQueryData<ExamAnswer[]>(key);
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

    return useMutation((data: ExamAnswer) => ExamAnswersService.remove(data.id), {
        onSuccess: (_data, variables) => {
            const key = [QUERY_KEY, { questionID: variables.questionID }];

            const oldData = queryClient.getQueryData<ExamAnswer[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, oldData.filter((answer) => answer.id !== variables.id));
            }
        },
    });
}
