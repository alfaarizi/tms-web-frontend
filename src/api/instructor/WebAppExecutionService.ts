import { axiosInstance } from 'api/axiosInstance';
import { WebAppExecution } from 'resources/instructor/WebAppExecution';
import { SetupWebAppExecution } from 'resources/instructor/SetupWebAppExecution';

export async function one(studentFileID: number) {
    const res = await axiosInstance.get<WebAppExecution>('/instructor/web-app-execution', {
        params: { studentFileID },
    });
    return res.data;
}

export async function startWebAppExecution(studentFileID: number, data: SetupWebAppExecution) {
    const res = await axiosInstance.post<WebAppExecution>('/instructor/web-app-execution', {
        studentFileID,
        runInterval: data.runInterval,
    });
    return res.data;
}

export async function stopWebAppExecution(webAppExecution: WebAppExecution) {
    const res = await axiosInstance.delete<void>(`/instructor/web-app-execution/${webAppExecution.id}`);
    return res.data;
}

export async function downloadRunLog(webAppExecution: WebAppExecution) {
    const res = await axiosInstance.get<Blob>(`/instructor/web-app-execution/${webAppExecution.id}/download-run-log`, {
        responseType: 'blob',
    });
    return res.data;
}
