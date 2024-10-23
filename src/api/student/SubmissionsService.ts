import { AxiosResponse } from 'axios';

import { axiosInstance } from 'api/axiosInstance';
import { SubmissionUpload } from 'resources/student/SubmissionUpload';
import { Submission } from 'resources/student/Submission';
import { VerifyItem } from 'resources/student/VerifyItem';
import { AutoTesterResult } from 'resources/common/AutoTesterResult';

export async function download(id: number) {
    const res = await axiosInstance.get<Blob>(`/student/submissions/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}

export async function upload(uploadData: SubmissionUpload) {
    const formData = new FormData();
    formData.append('taskID', uploadData.taskID.toString());
    formData.append('file', uploadData.file);

    const res = await axiosInstance.post<Submission>('/student/submissions/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function downloadTestReport(id: number) {
    const res = await axiosInstance.get<Blob>(`/student/submissions/${id}/download-report`, {
        responseType: 'blob',
    });
    return res.data;
}

export async function verify(data: VerifyItem) {
    const res = await axiosInstance.post<VerifyItem, AxiosResponse<Submission>>(
        '/student/submissions/verify',
        data,
    );
    return res.data;
}

export async function autoTesterResults(id: number) {
    const res = await axiosInstance.get<AutoTesterResult[]>(
        `/student/submissions/${id}/auto-tester-results`,
    );
    return res.data;
}
