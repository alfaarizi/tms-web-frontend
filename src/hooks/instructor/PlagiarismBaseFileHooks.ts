import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as PlagiarismService from 'api/instructor/PlagiarismService';
import { Plagiarism } from 'resources/instructor/Plagiarism';
import { RequestPlagiarism } from 'resources/instructor/RequestPlagiarism';
import { PlagiarismBasefile } from 'resources/instructor/PlagiarismBasefile';
import { BaseFileUpload } from 'resources/instructor/BaseFileUpload';
import { useDownloader } from 'hooks/common/useDownloader';

export const QUERY_KEY = 'instructor/plagiarism-basefile';

export function useBasefiles() {
    const key = [QUERY_KEY];
    return useQuery(key, () => PlagiarismService.getBasefiles());
}

export function useBasefilesByTasks(taskIDs: number[], enabled: boolean) {
    const key = [QUERY_KEY, 'tasks', ...taskIDs];
    return useQuery(key, () => PlagiarismService.basefilesByTasks(taskIDs), { enabled });
}

export function useUploadBasefileMutation() {
    const queryClient = useQueryClient();

    return useMutation(async (uploadData: BaseFileUpload) => PlagiarismService.uploadBasefiles(uploadData), {
        onSuccess: (data) => {
            const key = [QUERY_KEY];
            queryClient.invalidateQueries(key);
        },
    });
}

export function useRemoveBasefileMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => PlagiarismService.removeBasefile(id), {
        onSuccess: (_data, id) => {
            const key = [QUERY_KEY];
            const oldFileList = queryClient.getQueryData<PlagiarismBasefile[]>(key);
            if (oldFileList) {
                const newList = oldFileList.filter((file) => file.id !== id);
                queryClient.setQueryData(key, newList);
            }
        },
    });
}

export function useDownloadBasefileMutation() {
    return useDownloader((id: number) => PlagiarismService.downloadBasefile(id));
}
