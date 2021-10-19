import { useMutation, useQuery, useQueryClient } from 'react-query';

import { StudentFile } from 'resources/instructor/StudentFile';
import * as StudentFilesService from 'api/instructor/StudentFilesService';
import { useDownloader } from 'hooks/common/useDownloader';
import { QUERY_KEY as GROUP_QUERY_KEY } from 'hooks/instructor/GroupHooks';

export const QUERY_KEY = 'instructor/student-files';

export function useStudentFilesForTask(taskID: number) {
    return useQuery([QUERY_KEY, { taskID }], () => StudentFilesService.listforTask(taskID));
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
        },
    });
}

export function useDownloadStudentFile() {
    return useDownloader((id: number) => StudentFilesService.download(id));
}

export function useExportSpreadsheet(taskID: number) {
    return useDownloader(
        (format: StudentFilesService.SpreadsheetFormat) => StudentFilesService.exportSpreadsheet(taskID, format),
    );
}

export function useDownloadAll(taskID: number) {
    return useDownloader(
        (onlyUngraded: boolean) => StudentFilesService.downloadAllFiles(taskID, onlyUngraded),
    );
}
