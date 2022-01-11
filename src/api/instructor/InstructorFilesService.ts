import { axiosInstance } from 'api/axiosInstance';
import { InstructorFile } from 'resources/common/InstructorFile';
import { InstructorFilesUpload } from 'resources/instructor/InstructorFilesUpload';
import { InstructorFilesUploadResult } from 'resources/instructor/InstructorFilesUploadResult';

export async function index(taskID: number, includeAttachments?: boolean, includeTestFiles?: boolean) {
    const res = await axiosInstance.get<InstructorFile[]>('/instructor/instructor-files', {
        params: {
            taskID,
            includeAttachments,
            includeTestFiles,
        },
    });
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete(`/instructor/instructor-files/${id}`);
}

export async function upload(uploadData: InstructorFilesUpload) {
    const formData = new FormData();
    formData.append('taskID', uploadData.taskID.toString());
    formData.append('category', uploadData.category);
    for (let i = 0; i < uploadData.files.length; ++i) {
        formData.append('files[]', uploadData.files[i]);
    }

    const res = await axiosInstance.post<InstructorFilesUploadResult>('/instructor/instructor-files', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function download(id: number) {
    const res = await axiosInstance.get<Blob>(`/instructor/instructor-files/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}
