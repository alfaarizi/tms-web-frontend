import { Submission } from '@/resources/instructor/Submission';
import { AutoTesterResult } from '@/resources/common/AutoTesterResult';
import { IpAddress } from '@/resources/instructor/IpAddress';
import { axiosInstance } from '@/api/axiosInstance';
import { SubmissionGrade } from '@/resources/instructor/SubmissionGrade';
import { SubmissionPersonalDeadline } from '@/resources/instructor/SubmissionPersonalDeadline';

export async function listForTask(taskID: number) {
    const res = await axiosInstance.get<Submission[]>('/instructor/submissions/list-for-task', {
        params: {
            taskID,
            expand: 'uploader,execution,codeCompass,codeCheckerResult',
        },
    });
    return res.data;
}

export async function listForStudent(groupID: number, uploaderID: number) {
    const res = await axiosInstance.get<Submission[]>('/instructor/submissions/list-for-student', {
        params: {
            groupID,
            uploaderID,
            expand: 'task,task.group,execution,codeCompass,codeCheckerResult',
        },
    });
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<Submission>(`/instructor/submissions/${id}`, {
        params: {
            expand: 'uploader,task,task.group,execution,codeCompass,codeCheckerResult,'
                    + 'codeCheckerResult.stdout,codeCheckerResult.stderr,codeCheckerResult.codeCheckerReports,'
                    + 'codeCheckerResult.runnerErrorMessage'
            ,
        },
    });
    return res.data;
}

export async function download(id: number) {
    const res = await axiosInstance.get<Blob>(`/instructor/submissions/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}

export async function downloadTestReport(id: number) {
    const res = await axiosInstance.get<Blob>(`/instructor/submissions/${id}/download-report`, {
        responseType: 'blob',
    });
    return res.data;
}

export type SpreadsheetFormat = 'xlsx' | 'csv';

export async function exportSpreadsheet(taskID: number, format: SpreadsheetFormat) {
    const res = await axiosInstance.get<Blob>('/instructor/submissions/export-spreadsheet', {
        params: {
            taskID,
            format,
        },
        responseType: 'blob',
    });
    return res.data;
}

export async function downloadAllFiles(taskID: number, onlyUngraded: boolean) {
    const res = await axiosInstance.get<Blob>('/instructor/submissions/download-all-files', {
        responseType: 'blob',
        params: {
            taskID,
            onlyUngraded,
        },
    });
    return res.data;
}

export async function grade(gradeData: SubmissionGrade) {
    const res = await axiosInstance.patch(
        `/instructor/submissions/${gradeData.id}?expand=uploader,task,task.group,codeCompass,codeCheckerResult,`
        + 'codeCheckerResult.stdout,codeCheckerResult.stderr,codeCheckerResult.codeCheckerReports,'
        + 'codeCheckerResult.runnerErrorMessage',
        {
            status: gradeData.status,
            grade: gradeData.grade,
            notes: gradeData.notes,
        },
    );
    return res.data;
}

export async function setPersonalDeadline(submissionData: SubmissionPersonalDeadline) {
    const res = await axiosInstance.patch(
        `/instructor/submissions/${submissionData.id}/set-personal-deadline`
        + '?expand=uploader,task,task.group,codeCompass,codeCheckerResult,'
        + 'codeCheckerResult.stdout,codeCheckerResult.stderr,codeCheckerResult.codeCheckerReports,'
        + 'codeCheckerResult.runnerErrorMessage',
        {
            personalDeadline: submissionData.personalDeadline,
        },
    );
    return res.data;
}

export async function startCodeCompass(file: Submission) {
    const res = await axiosInstance
        .post<Submission>(
            `/instructor/submissions/${file.id}/start-code-compass?expand=uploader,task,task.group,`
                + 'codeCompass,codeCheckerResult',
        );
    return res.data;
}

export async function stopCodeCompass(file: Submission) {
    const res = await axiosInstance
        .post<Submission>(
            `/instructor/submissions/${file.id}/stop-code-compass?expand=uploader,task,task.group,`
                + 'codeCompass,codeCheckerResult',
        );
    return res.data;
}

export async function autoTesterResults(id: number) {
    const res = await axiosInstance.get<AutoTesterResult[]>(
        `/instructor/submissions/${id}/auto-tester-results`,
    );
    return res.data;
}

export async function ipAddresses(id: number) {
    const res = await axiosInstance.get<IpAddress[]>(
        `/instructor/submissions/${id}/ip-addresses?expand=submission,submission.task,submission.task.group,`
            + 'submission.task.group.course',
    );
    return res.data;
}
