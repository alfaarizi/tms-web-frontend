import { useMutation, useQuery, useQueryClient } from 'react-query';

import { TaskFile } from 'resources/common/TaskFile';
import * as TaskFilesService from 'api/instructor/TaskFilesService';
import { TaskFilesUpload } from 'resources/instructor/TaskFilesUpload';
import { useDownloader } from 'hooks/common/useDownloader';

export const QUERY_KEY = 'instructor/task-files';

export function useTaskFiles(
    taskID: number, includeAttachments: boolean, includeTestFiles: boolean, includeWebTestSuites: boolean,
) {
    return useQuery([QUERY_KEY, {
        taskID, includeAttachments, includeTestFiles, includeWebTestSuites,
    }],
    () => TaskFilesService.index(taskID, includeAttachments, includeTestFiles, includeWebTestSuites));
}

export function useAttachmentTaskFiles(taskID: number) {
    return useTaskFiles(taskID, true, false, false);
}

export function useTestTaskFiles(taskID: number) {
    return useTaskFiles(taskID, false, true, false);
}

export function useWebTestSuites(taskID: number) {
    return useTaskFiles(taskID, false, false, true);
}

export function useTaskFilesUploadMutation(
    taskID: number, includeAttachments: boolean, includeTestFiles: boolean, includeWebTestSuites: boolean,
) {
    const queryClient = useQueryClient();

    return useMutation(async (uploadData: TaskFilesUpload) => TaskFilesService.upload(uploadData), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, {
                taskID, includeAttachments, includeTestFiles, includeWebTestSuites,
            }];
            const oldFileList = queryClient.getQueryData<TaskFile[]>(key);
            if (oldFileList) {
                queryClient.setQueryData(key, [...oldFileList, ...data.uploaded]);
            }
        },
    });
}

export function useAttachmentTaskFilesUploadMutation(taskID: number) {
    return useTaskFilesUploadMutation(taskID, true, false, false);
}

export function useTestTaskFilesUploadMutation(taskID: number) {
    return useTaskFilesUploadMutation(taskID, false, true, false);
}

export function useWebTestSuiteUploadMutation(taskID: number) {
    return useTaskFilesUploadMutation(taskID, false, false, true);
}

export function useTaskFileRemoveMutation(
    taskID: number, includeAttachments: boolean, includeTestFiles: boolean, includeWebTestSuites: boolean,
) {
    const queryClient = useQueryClient();

    return useMutation((id: number) => TaskFilesService.remove(id), {
        onSuccess: (_data, id) => {
            const key = [QUERY_KEY, {
                taskID, includeAttachments, includeTestFiles, includeWebTestSuites,
            }];
            const oldFileList = queryClient.getQueryData<TaskFile[]>(key);
            if (oldFileList) {
                const newList = oldFileList.filter((file) => file.id !== id);
                queryClient.setQueryData(key, newList);
            }
        },
    });
}

export function useAttachmentTaskFileRemoveMutation(taskID: number) {
    return useTaskFileRemoveMutation(taskID, true, false, false);
}

export function useTestTaskFileRemoveMutation(taskID: number) {
    return useTaskFileRemoveMutation(taskID, false, true, false);
}

export function useWebTestSuiteRemoveMutation(taskID: number) {
    return useTaskFileRemoveMutation(taskID, false, false, true);
}

export function useTaskFileDownload() {
    return useDownloader((id: number) => TaskFilesService.download(id));
}
