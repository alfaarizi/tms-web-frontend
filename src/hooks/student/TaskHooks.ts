import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Task } from 'resources/student/Task';
import * as TasksService from 'api/student/TasksService';
import * as StudentFilesService from 'api/student/StudentFilesService';
import * as InstructorFilesService from 'api/student/InstructorFilesService';
import { StudentFile } from 'resources/student/StudentFile';
import { StudentFileUpload } from 'resources/student/StudentFileUpload';
import { useDownloader } from 'hooks/common/useDownloader';
import { VerifyItem } from 'resources/student/VerifyItem';

export const QUERY_KEY = 'student/tasks';

export function useTask(taskID: number) {
    return useQuery<Task>([QUERY_KEY, { taskID }], () => TasksService.one(taskID));
}

export function useTasks(groupID: number) {
    return useQuery<Task[][]>([QUERY_KEY, { groupID }], () => TasksService.index(groupID));
}

export function useUploadStudentFileMutation() {
    const queryClient = useQueryClient();

    return useMutation<StudentFile, Error, StudentFileUpload>(
        (uploadData) => StudentFilesService.upload(uploadData),
        {
            onSuccess: (studentFile: StudentFile, variables: StudentFileUpload) => {
                const key = [QUERY_KEY, { taskID: studentFile.taskID }];
                const oldTaskData = queryClient.getQueryData<Task>(key);
                if (oldTaskData) {
                    queryClient.setQueryData(key, {
                        ...oldTaskData,
                        studentFiles: [studentFile],
                    });
                }
            },
        },
    );
}

export function useVerifyStudentFileMutation() {
    const queryClient = useQueryClient();

    return useMutation<StudentFile, Error, VerifyItem>(
        (data) => StudentFilesService.verify(data),
        {
            onSuccess: (studentFile) => {
                const key = [QUERY_KEY, { taskID: studentFile.taskID }];
                const oldTaskData = queryClient.getQueryData<Task>(key);
                if (oldTaskData) {
                    queryClient.setQueryData(key, {
                        ...oldTaskData,
                        studentFiles: [studentFile],
                    });
                }
            },
        },
    );
}

export function useDownloadInstructorFile() {
    return useDownloader((id: number) => InstructorFilesService.download(id));
}

export function useDownloadStudentFile() {
    return useDownloader((id: number) => StudentFilesService.download(id));
}
