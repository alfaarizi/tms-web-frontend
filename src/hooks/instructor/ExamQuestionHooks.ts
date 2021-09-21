import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as ExamQuestionsService from 'api/instructor/ExamQuestionsService';
import { ExamQuestion } from 'resources/instructor/ExamQuestion';

export const QUERY_KEY = 'instructor/exam-question';

export function useQuestionsForSet(questionsetID: number) {
    return useQuery([QUERY_KEY, { questionsetID }], () => ExamQuestionsService.listForQuestionSet(questionsetID));
}

export function useQuestionsForTest(enabled: boolean, testID: number, userID?: number) {
    return useQuery([QUERY_KEY, {
        testID,
        userID,
    }], () => ExamQuestionsService.listForTest(testID, userID), {
        enabled,
    });
}

export function useCreateQuestionMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: ExamQuestion) => ExamQuestionsService.create(data), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { questionsetID: data.questionsetID }];

            const oldData = queryClient.getQueryData<ExamQuestion[]>(key);
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

    return useMutation((data: ExamQuestion) => ExamQuestionsService.update(data), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { questionsetID: data.questionsetID }];

            const oldData = queryClient.getQueryData<ExamQuestion[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, oldData.map((question) => (question.id === data.id ? data : question)));
            }
        },
    });
}

export function useRemoveQuestionMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: ExamQuestion) => ExamQuestionsService.remove(data.id), {
        onSuccess: (_data, variables) => {
            const key = [QUERY_KEY, { questionsetID: variables.questionsetID }];

            const oldData = queryClient.getQueryData<ExamQuestion[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, oldData.filter((question) => question.id !== variables.id));
            }
        },
    });
}
