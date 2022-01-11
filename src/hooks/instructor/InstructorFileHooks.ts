import { useMutation, useQuery, useQueryClient } from 'react-query';

import { InstructorFile } from 'resources/common/InstructorFile';
import * as InstructorFilesService from 'api/instructor/InstructorFilesService';
import { InstructorFilesUpload } from 'resources/instructor/InstructorFilesUpload';
import { useDownloader } from 'hooks/common/useDownloader';

export const QUERY_KEY = 'instructor/instructor-files';

export function useInstructorFiles(taskID: number, includeAttachments: boolean, includeTestFiles: boolean) {
    return useQuery([QUERY_KEY, { taskID, includeAttachments, includeTestFiles }],
        () => InstructorFilesService.index(taskID, includeAttachments, includeTestFiles));
}

export function useAttachmentInstructorFiles(taskID: number) {
    return useInstructorFiles(taskID, true, false);
}

export function useTestInstructorFiles(taskID: number) {
    return useInstructorFiles(taskID, false, true);
}

export function useInstructorFilesUploadMutation(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation(async (uploadData: InstructorFilesUpload) => InstructorFilesService.upload(uploadData), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { taskID }];
            const oldFileList = queryClient.getQueryData<InstructorFile[]>(key);
            if (oldFileList) {
                queryClient.setQueryData(key, [...oldFileList, ...data.uploaded]);
            }
        },
    });
}

export function useRemoveInstructorFileMutation(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation((id: number) => InstructorFilesService.remove(id), {
        onSuccess: (_data, id) => {
            const key = [QUERY_KEY, { taskID }];
            const oldFileList = queryClient.getQueryData<InstructorFile[]>(key);
            if (oldFileList) {
                const newList = oldFileList.filter((file) => file.id !== id);
                queryClient.setQueryData(key, newList);
            }
        },
    });
}

export function useInstructorFileDownload() {
    return useDownloader((id: number) => InstructorFilesService.download(id));
}
