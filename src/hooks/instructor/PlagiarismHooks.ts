import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as PlagiarismService from 'api/instructor/PlagiarismService';
import { Plagiarism } from 'resources/instructor/Plagiarism';
import { RequestPlagiarism } from 'resources/instructor/RequestPlagiarism';

export const QUERY_KEY = 'instructor/plagiarism';

export function usePlagiarismList(semesterID: number) {
    return useQuery([QUERY_KEY, { semesterID }], () => PlagiarismService.index(semesterID));
}

export function usePlagiarismRequest(id: number) {
    return useQuery([QUERY_KEY, { id }], () => PlagiarismService.view(id));
}

export function useCreatePlagiarismMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: RequestPlagiarism) => PlagiarismService.add(data), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { semesterID: data.semesterID }];
            const oldData = queryClient.getQueryData<Plagiarism[]>(key);

            if (oldData) {
                const existing = oldData.find((plagiarism) => plagiarism.id === data.id);
                if (!existing) {
                    queryClient.setQueryData(key, [data, ...oldData]);
                }
            }
        },
    });
}

export function useUpdatePlagiarismMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation((data: Plagiarism) => PlagiarismService.update(id, data), {
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            const key = [QUERY_KEY, { semesterID: data.semesterID }];
            const oldData = queryClient.getQueryData<Plagiarism[]>(key);

            if (oldData) {
                queryClient.setQueryData(key, oldData.map((report) => (report.id === data.id ? data : report)));
            }
        },
    });
}

export function useRemovePlagiarismMutation() {
    const queryClient = useQueryClient();

    return useMutation((data: Plagiarism) => PlagiarismService.remove(data.id), {
        onSuccess: (_data, variables) => {
            const key = [QUERY_KEY, { semesterID: variables.semesterID }];
            const oldData = queryClient.getQueryData<Plagiarism[]>(key);

            if (oldData) {
                queryClient.setQueryData(key, oldData.filter((report) => report.id !== variables.id));
            }
        },
    });
}

export function useRunMossMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => PlagiarismService.runMoss(id), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { id: data.id }];
            queryClient.setQueryData<Plagiarism>(key, data);
        },
    });
}
