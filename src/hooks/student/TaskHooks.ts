import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Task } from 'resources/student/Task';
import * as TasksService from 'api/student/TasksService';
import * as SubmissionsService from 'api/student/SubmissionsService';
import * as TaskFilesService from 'api/student/TaskFilesService';
import { Submission } from 'resources/student/Submission';
import { SubmissionUpload } from 'resources/student/SubmissionUpload';
import { useDownloader } from 'hooks/common/useDownloader';
import { VerifyItem } from 'resources/student/VerifyItem';

export const QUERY_KEY = 'student/tasks';

export function useTask(taskID: number) {
    return useQuery<Task>([QUERY_KEY, { taskID }], () => TasksService.one(taskID), {
        refetchInterval: (queryState) => (
            !!queryState?.submissions?.some((file) => file.status === 'Uploaded')
                && !!queryState?.autoTest
                ? 60000 : false),
        refetchIntervalInBackground: false,
    });
}

export function useTasks(groupID: number) {
    return useQuery<Task[][]>([QUERY_KEY, { groupID }], () => TasksService.index(groupID));
}

export function useUploadSubmissionMutation() {
    const queryClient = useQueryClient();

    return useMutation<Submission, Error, SubmissionUpload>(
        (uploadData) => SubmissionsService.upload(uploadData),
        {
            onSuccess: (submission: Submission, variables: SubmissionUpload) => {
                const key = [QUERY_KEY, { taskID: submission.taskID }];
                const oldTaskData = queryClient.getQueryData<Task>(key);
                if (oldTaskData) {
                    queryClient.setQueryData(key, {
                        ...oldTaskData,
                        submissions: [submission],
                    });
                }
            },
        },
    );
}

export function useVerifySubmissionMutation() {
    const queryClient = useQueryClient();

    return useMutation<Submission, Error, VerifyItem>(
        (data) => SubmissionsService.verify(data),
        {
            onSuccess: (submission) => {
                const key = [QUERY_KEY, { taskID: submission.taskID }];
                const oldTaskData = queryClient.getQueryData<Task>(key);
                if (oldTaskData) {
                    queryClient.setQueryData(key, {
                        ...oldTaskData,
                        submissions: [submission],
                    });
                }
            },
        },
    );
}

export function useDownloadTaskFile() {
    return useDownloader((id: number) => TaskFilesService.download(id));
}

export function useDownloadSubmission() {
    return useDownloader((id: number) => SubmissionsService.download(id));
}

export function useDownloadTestReport() {
    return useDownloader((id: number) => SubmissionsService.downloadTestReport(id));
}
