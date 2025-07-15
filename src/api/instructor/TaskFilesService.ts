import { axiosInstance } from '@/api/axiosInstance';
import { TaskFile } from '@/resources/common/TaskFile';
import { TaskFilesUpload } from '@/resources/instructor/TaskFilesUpload';
import { TaskFilesUploadResult } from '@/resources/instructor/TaskFilesUploadResult';

export async function index(
    taskID: number,
    includeAttachments?: boolean,
    includeTestFiles?: boolean,
    includeWebTestSuites?: boolean,
) {
    const res = await axiosInstance.get<TaskFile[]>('/instructor/task-files', {
        params: {
            taskID,
            includeAttachments,
            includeTestFiles,
            includeWebTestSuites,
        },
    });
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete(`/instructor/task-files/${id}`);
}

export async function upload(uploadData: TaskFilesUpload) {
    const formData = new FormData();
    formData.append('taskID', uploadData.taskID.toString());
    formData.append('category', uploadData.category);
    if (uploadData.overwrite != null) {
        formData.append('override', uploadData.overwrite.toString());
    }
    for (let i = 0; i < uploadData.files.length; ++i) {
        formData.append('files[]', uploadData.files[i]);
    }

    const res = await axiosInstance.post<TaskFilesUploadResult>('/instructor/task-files', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function download(id: number) {
    const res = await axiosInstance.get<Blob>(`/instructor/task-files/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}
