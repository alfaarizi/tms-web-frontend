import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as ExamQuestionSetsService from 'api/instructor/ExamQuestionSetsService';
import { ExamQuestionSet } from 'resources/instructor/ExamQuestionSet';
import { Image } from 'resources/common/Image';

export const QUERY_KEY = 'instructor/exam-question-sets';

export function useQuestionSets() {
    return useQuery(QUERY_KEY, ExamQuestionSetsService.index);
}

export function useQuestionSet(id: number) {
    return useQuery([QUERY_KEY, { id }], () => ExamQuestionSetsService.view(id));
}

export function useCreateQuestionSetMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: ExamQuestionSet) => ExamQuestionSetsService.create(data), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const oldData = queryClient.getQueryData<ExamQuestionSet[]>(QUERY_KEY);
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

    return useMutation((data: ExamQuestionSet) => ExamQuestionSetsService.update(data), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const oldData = queryClient.getQueryData<ExamQuestionSet[]>(QUERY_KEY);
            if (oldData) {
                queryClient.setQueryData(QUERY_KEY, oldData.map((set) => (set.id === data.id ? data : set)));
            }
        },
    });
}

export function useRemoveQuestionSetMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => ExamQuestionSetsService.remove(id), {
        onSuccess: (_data, id) => {
            const oldData = queryClient.getQueryData<ExamQuestionSet[]>(QUERY_KEY);
            if (oldData) {
                queryClient.setQueryData(QUERY_KEY, oldData.filter((set) => set.id !== id));
            }
        },
    });
}

export function useDuplicateQuestionSetMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => ExamQuestionSetsService.duplicate(id), {
        onSuccess: (data) => {
            // queryClient.setQueryData([QUERY_KEY, {id: data.id}], data);

            const oldData = queryClient.getQueryData<ExamQuestionSet[]>(QUERY_KEY);
            if (oldData) {
                queryClient.setQueryData(QUERY_KEY, [...oldData, data]);
            } else {
                queryClient.setQueryData(QUERY_KEY, [data]);
            }
        },
    });
}

export function useExamImages(id: number) {
    return useQuery([QUERY_KEY, 'images', { id }], () => ExamQuestionSetsService.listImages(id));
}

export function useExamImageUploadMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation((files: File[]) => ExamQuestionSetsService.uploadImages(id, files), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, 'images', { id }];
            const oldData = queryClient.getQueryData<Image[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, [...data.uploaded, ...oldData]);
            }
        },
    });
}

export function useRemoveExamImageMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation((filename: string) => ExamQuestionSetsService.removeImage(id, filename), {
        onSuccess: (_data, filename) => {
            const key = [QUERY_KEY, 'images', { id }];
            const oldData = queryClient.getQueryData<Image[]>(key);
            if (oldData) {
                queryClient.setQueryData(key, oldData.filter((img) => img.name !== filename));
            }
        },
    });
}
