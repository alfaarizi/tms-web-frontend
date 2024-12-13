import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Submission } from 'resources/instructor/Submission';
import * as SubmissionsService from 'api/instructor/SubmissionsService';
import { useDownloader } from 'hooks/common/useDownloader';
import { QUERY_KEY as GROUP_QUERY_KEY } from 'hooks/instructor/GroupHooks';
import { QUERY_KEY as TASK_QUERY_KEY } from 'hooks/instructor/TaskHooks';
import * as GroupService from 'api/instructor/GroupsService';

export const QUERY_KEY = 'instructor/submissions';

export function useSubmissionsForTask(taskID: number) {
    return useQuery([QUERY_KEY, { taskID }], () => SubmissionsService.listForTask(taskID));
}

export function useSubmissionsForStudent(groupID: number, uploaderID: number) {
    return useQuery([QUERY_KEY, {
        groupID,
        uploaderID,
    }],
    () => SubmissionsService.listForStudent(groupID, uploaderID));
}

export function useSubmission(id: number) {
    return useQuery([QUERY_KEY, { id }], () => SubmissionsService.view(id));
}

export function useGradeMutation() {
    const queryClient = useQueryClient();

    return useMutation((file: Submission) => SubmissionsService.grade(file), {
        onSuccess: async (data) => {
            // Replace existing Submission with the returned data
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            // Update lists
            const forTask = queryClient.getQueryData<Submission[]>([QUERY_KEY, { taskID: data.taskID }]);
            if (forTask) {
                const newList = forTask.map((file) => (file.id === data.id ? data : file));
                queryClient.setQueryData([QUERY_KEY, { taskID: data.taskID }], newList);
            }

            const forUploader = queryClient.getQueryData<Submission[]>([QUERY_KEY, {
                groupID: data.groupID,
                uploaderID: data.uploaderID,
            }]);
            if (forUploader) {
                const newList = forUploader.map((file) => (file.id === data.id ? data : file));
                queryClient.setQueryData([QUERY_KEY, {
                    groupID: data.groupID,
                    uploaderID: data.uploaderID,
                }], newList);
            }

            // Invalidate stat queries
            await queryClient.invalidateQueries([GROUP_QUERY_KEY, 'stats', { groupID: data.groupID }]);
            await queryClient.invalidateQueries([GROUP_QUERY_KEY, 'stats', {
                groupID: data.groupID,
                studentID: data.uploaderID,
            }]);

            // Invalidate task grid
            await queryClient.invalidateQueries([TASK_QUERY_KEY, { groupID: data.groupID }, 'grid']);
        },
    });
}

export function useDownloadSubmission() {
    return useDownloader((id: number) => SubmissionsService.download(id));
}

export function useDownloadTestReport() {
    return useDownloader((id: number) => SubmissionsService.downloadTestReport(id));
}

export type ExportSpreadsheetParams = {
    taskID: number,
    format: SubmissionsService.SpreadsheetFormat,
};

export function useExportSpreadsheet() {
    return useDownloader(
        ({ taskID, format }: ExportSpreadsheetParams) => SubmissionsService.exportSpreadsheet(taskID, format),
    );
}

export type DownloadAllParams = {
    taskID: number,
    onlyUngraded: boolean,
};

export function useDownloadAll() {
    return useDownloader(
        ({ taskID, onlyUngraded }: DownloadAllParams) => SubmissionsService.downloadAllFiles(taskID, onlyUngraded),
    );
}

export function useStartCodeCompassMutation(taskId: number) {
    const queryClient = useQueryClient();

    return useMutation((file: Submission) => SubmissionsService.startCodeCompass(file), {
        onSuccess: async (data) => {
            const forTask = queryClient.getQueryData<Submission[]>([QUERY_KEY, { taskID: taskId }]);
            if (forTask) {
                const newList = forTask.map((file) => (file.id === data.id ? data : file));
                queryClient.setQueryData([QUERY_KEY, { taskID: data.taskID }], newList);
            }

            const forUploader = queryClient.getQueryData<Submission[]>([QUERY_KEY, {
                groupID: data.groupID,
                uploaderID: data.uploader.id,
            }]);
            if (forUploader) {
                const newList = forUploader.map((file) => (file.id === data.id ? data : file));
                queryClient.setQueryData([QUERY_KEY, {
                    groupID: data.groupID,
                    uploaderID: data.uploader.id,
                }], newList);
            }
            queryClient.setQueryData<Submission>(([QUERY_KEY, { id: data.id }]), data);
        },
    });
}

export function useStopCodeCompassMutation(taskId: number) {
    const queryClient = useQueryClient();

    return useMutation((file: Submission) => SubmissionsService.stopCodeCompass(file), {
        onSuccess: async (data) => {
            const forTask = queryClient.getQueryData<Submission[]>([QUERY_KEY, { taskID: taskId }]);
            if (forTask) {
                const newList = forTask.map((file) => (file.id === data.id ? data : file));
                queryClient.setQueryData([QUERY_KEY, { taskID: data.taskID }], newList);
            }
            const forUploader = queryClient.getQueryData<Submission[]>([QUERY_KEY, {
                groupID: data.groupID,
                uploaderID: data.uploader.id,
            }]);
            if (forUploader) {
                const newList = forUploader.map((file) => (file.id === data.id ? data : file));
                queryClient.setQueryData([QUERY_KEY, {
                    groupID: data.groupID,
                    uploaderID: data.uploader.id,
                }], newList);
            }
            queryClient.setQueryData<Submission>(([QUERY_KEY, { id: data.id }]), data);
        },
    });
}

export function useAutoTestResults(id: number, enabled: boolean = true) {
    return useQuery(
        [QUERY_KEY, 'auto-tester-results', { id }],
        () => SubmissionsService.autoTesterResults(id),
        { enabled },
    );
}

export function useIpAddresses(id: number, enabled: boolean = true) {
    return useQuery(
        [QUERY_KEY, 'ip-addresses', { id }],
        () => SubmissionsService.ipAddresses(id),
        { enabled },
    );
}
