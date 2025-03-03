import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as QuizQuestionSetsService from 'api/instructor/QuizQuestionSetsService';
import { QuizQuestionSet } from 'resources/instructor/QuizQuestionSet';
import { Image } from 'resources/common/Image';

export const QUERY_KEY = 'instructor/quiz-question-sets';

export function useQuestionSets() {
    return useQuery(QUERY_KEY, QuizQuestionSetsService.index);
}

export function useQuestionSet(id: number) {
    return useQuery([QUERY_KEY, { id }], () => QuizQuestionSetsService.view(id));
}

export function useCreateQuestionSetMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: QuizQuestionSet) => QuizQuestionSetsService.create(data), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const oldData = queryClient.getQueryData<QuizQuestionSet[]>(QUERY_KEY);
            if (oldData) {
                queryClient.setQueryData(QUERY_KEY, [...oldData, data]);
            } else {
                queryClient.setQueryData(QUERY_KEY, [data]);
            }
        },
    });
}

export function useUpdateQuestionSetMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: QuizQuestionSet) => QuizQuestionSetsService.update(data), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const oldData = queryClient.getQueryData<QuizQuestionSet[]>(QUERY_KEY);
            if (oldData) {
                queryClient.setQueryData(QUERY_KEY, oldData.map((set) => (set.id === data.id ? data : set)));
            }
        },
    });
}

export function useRemoveQuestionSetMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => QuizQuestionSetsService.remove(id), {
        onSuccess: (_data, id) => {
            const oldData = queryClient.getQueryData<QuizQuestionSet[]>(QUERY_KEY);
            if (oldData) {
                queryClient.setQueryData(QUERY_KEY, oldData.filter((set) => set.id !== id));
            }
        },
    });
}

export function useDuplicateQuestionSetMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => QuizQuestionSetsService.duplicate(id), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const oldData = queryClient.getQueryData<QuizQuestionSet[]>(QUERY_KEY);
            if (oldData) {
                queryClient.setQueryData(QUERY_KEY, [...oldData, data]);
            } else {
                queryClient.setQueryData(QUERY_KEY, [data]);
            }
        },
    });
}

export function useQuizImages(id: number) {
    return useQuery([QUERY_KEY, 'images', { id }], () => QuizQuestionSetsService.listImages(id));
}

export function useQuizImageUploadMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation((files: File[]) => QuizQuestionSetsService.uploadImages(id, files), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, 'images', { id }];
            const oldData = queryClient.getQueryData<Image[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, [...data.uploaded, ...oldData]);
            }
        },
    });
}

export function useRemoveQuizImageMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation((filename: string) => QuizQuestionSetsService.removeImage(id, filename), {
        onSuccess: (_data, filename) => {
            const key = [QUERY_KEY, 'images', { id }];
            const oldData = queryClient.getQueryData<Image[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, oldData.filter((img) => img.name !== filename));
            }
        },
    });
}
