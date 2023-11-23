import { StudentFile } from 'resources/instructor/StudentFile';
import { AutoTesterResult } from 'resources/common/AutoTesterResult';
import { axiosInstance } from 'api/axiosInstance';

export async function listForTask(taskID: number) {
    const res = await axiosInstance.get<StudentFile[]>('/instructor/student-files/list-for-task', {
        params: {
            taskID,
            expand: 'uploader,execution,codeCompass,codeCheckerResult',
        },
    });
    return res.data;
}

export async function listForStudent(groupID: number, uploaderID: number) {
    const res = await axiosInstance.get<StudentFile[]>('/instructor/student-files/list-for-student', {
        params: {
            groupID,
            uploaderID,
            expand: 'task,task.group,execution,codeCompass,codeCheckerResult',
        },
    });
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<StudentFile>(
        `/instructor/student-files/${id}`, {
            params: {
                expand: 'uploader,task,task.group,execution,codeCompass,codeCheckerResult,'
                    + 'codeCheckerResult.stdout,codeCheckerResult.stderr,codeCheckerResult.codeCheckerReports,'
                    + 'codeCheckerResult.runnerErrorMessage'
                ,
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

export async function downloadTestReport(id: number) {
    const res = await axiosInstance.get<Blob>(`/instructor/student-files/${id}/download-report`, {
        responseType: 'blob',
    });
    return res.data;
}

export type SpreadsheetFormat = 'xlsx' | 'csv';

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
    const res = await axiosInstance.patch(
        `/instructor/student-files/${file.id}?expand=uploader,task,task.group,codeCompass,codeCheckerResult,`
        + 'codeCheckerResult.stdout,codeCheckerResult.stderr,codeCheckerResult.codeCheckerReports,'
        + 'codeCheckerResult.runnerErrorMessage',
        file,
    );
    return res.data;
}

export async function startCodeCompass(file: StudentFile) {
    const res = await axiosInstance
        .post<StudentFile>(
            `/instructor/student-files/${file.id}/start-code-compass?expand=uploader,task,task.group,`
                + 'codeCompass,codeCheckerResult',
        );
    return res.data;
}

export async function stopCodeCompass(file: StudentFile) {
    const res = await axiosInstance
        .post<StudentFile>(
            `/instructor/student-files/${file.id}/stop-code-compass?expand=uploader,task,task.group`
                + 'codeCompass,codeCheckerResult',
        );
    return res.data;
}

export async function autoTesterResults(id: number) {
    const res = await axiosInstance.get<AutoTesterResult[]>(
        `/instructor/student-files/${id}/auto-tester-results`,
    );
    return res.data;
}
