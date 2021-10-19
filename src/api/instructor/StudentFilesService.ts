import { StudentFile } from 'resources/instructor/StudentFile';
import { axiosInstance } from 'api/axiosInstance';

export async function listforTask(taskID: number) {
    const res = await axiosInstance.get<StudentFile[]>('/instructor/student-files/list-for-task', {
        params: {
            taskID,
            expand: 'uploader',
        },
    });
    return res.data;
}

export async function listForStudent(groupID: number, uploaderID: number) {
    const res = await axiosInstance.get<StudentFile[]>('/instructor/student-files/list-for-student', {
        params: {
            groupID,
            uploaderID,
            expand: 'task, task.group',
        },
    });
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<StudentFile>(
        `/instructor/student-files/${id}`, {
            params: {
                expand: 'uploader,task,task.group',
            },
        },
    );
    return res.data;
}

export async function download(id: number) {
    const res = await axiosInstance.get<Blob>(`/instructor/student-files/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}

export type SpreadsheetFormat = 'xls' | 'csv';

export async function exportSpreadsheet(taskID: number, format: SpreadsheetFormat) {
    const res = await axiosInstance.get<Blob>('/instructor/student-files/export-spreadsheet', {
        params: {
            taskID,
            format,
        },
        responseType: 'blob',
    });
    return res.data;
}

export async function downloadAllFiles(taskID: number, onlyUngraded: boolean) {
    const res = await axiosInstance.get<Blob>('/instructor/student-files/download-all-files', {
        responseType: 'blob',
        params: {
            taskID,
            onlyUngraded,
        },
    });
    return res.data;
}

export async function grade(file: StudentFile) {
    const res = await axiosInstance.patch(`/instructor/student-files/${file.id}`, file);
    return res.data;
}
