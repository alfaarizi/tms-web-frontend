import { useMutation, useQuery, useQueryClient } from 'react-query';

import { StudentFile } from 'resources/instructor/StudentFile';
import * as StudentFilesService from 'api/instructor/StudentFilesService';
import { useDownloader } from 'hooks/common/useDownloader';
import { QUERY_KEY as GROUP_QUERY_KEY } from 'hooks/instructor/GroupHooks';
import { QUERY_KEY as TASK_QUERY_KEY } from 'hooks/instructor/TaskHooks';

export const QUERY_KEY = 'instructor/student-files';

export function useStudentFilesForTask(taskID: number) {
    return useQuery([QUERY_KEY, { taskID }], () => StudentFilesService.listForTask(taskID));
}

export function useStudentFilesForStudent(groupID: number, uploaderID: number) {
    return useQuery([QUERY_KEY, {
        groupID,
        uploaderID,
    }],
    () => StudentFilesService.listForStudent(groupID, uploaderID));
}

export function useStudentFile(id: number) {
    return useQuery([QUERY_KEY, { id }], () => StudentFilesService.view(id));
}

export function useGradeMutation() {
    const queryClient = useQueryClient();

    return useMutation((file: StudentFile) => StudentFilesService.grade(file), {
        onSuccess: async (data) => {
            // Replace existing StudentFile with the returned data
            queryClient.setQueryData([QUERY_KEY, { id: data.id }], data);

            // Update lists
            const forTask = queryClient.getQueryData<StudentFile[]>([QUERY_KEY, { taskID: data.taskID }]);
            if (forTask) {
                const newList = forTask.map((file) => (file.id === data.id ? data : file));
                queryClient.setQueryData([QUERY_KEY, { taskID: data.taskID }], newList);
            }

            const forUploader = queryClient.getQueryData<StudentFile[]>([QUERY_KEY, {
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

export function useDownloadStudentFile() {
    return useDownloader((id: number) => StudentFilesService.download(id));
}

export type ExportSpreadsheetParams = {
    taskID: number,
    format: StudentFilesService.SpreadsheetFormat,
};

export function useExportSpreadsheet() {
    return useDownloader(
        ({ taskID, format }: ExportSpreadsheetParams) => StudentFilesService.exportSpreadsheet(taskID, format),
    );
}

export type DownloadAllParams = {
    taskID: number,
    onlyUngraded: boolean,
};

export function useDownloadAll() {
    return useDownloader(
        ({ taskID, onlyUngraded }: DownloadAllParams) => StudentFilesService.downloadAllFiles(taskID, onlyUngraded),
    );
}
