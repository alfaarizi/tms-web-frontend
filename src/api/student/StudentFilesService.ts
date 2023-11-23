import { AxiosResponse } from 'axios';

import { axiosInstance } from 'api/axiosInstance';
import { StudentFileUpload } from 'resources/student/StudentFileUpload';
import { StudentFile } from 'resources/student/StudentFile';
import { VerifyItem } from 'resources/student/VerifyItem';
import { AutoTesterResult } from 'resources/common/AutoTesterResult';

export async function download(id: number) {
    const res = await axiosInstance.get<Blob>(`/student/student-files/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}

export async function upload(uploadData: StudentFileUpload) {
    const formData = new FormData();
    formData.append('taskID', uploadData.taskID.toString());
    formData.append('file', uploadData.file);

    const res = await axiosInstance.post<StudentFile>('/student/student-files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function downloadTestReport(id: number) {
    const res = await axiosInstance.get<Blob>(`/student/student-files/${id}/download-report`, {
        responseType: 'blob',
    });
    return res.data;
}

export async function verify(data: VerifyItem) {
    const res = await axiosInstance.post<VerifyItem, AxiosResponse<StudentFile>>(
        '/student/student-files/verify',
        data,
    );
    return res.data;
}

export async function autoTesterResults(id: number) {
    const res = await axiosInstance.get<AutoTesterResult[]>(
        `/student/student-files/${id}/auto-tester-results`,
    );
    return res.data;
}
