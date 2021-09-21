import { axiosInstance } from 'api/axiosInstance';
import { StudentFileUpload } from 'resources/student/StudentFileUpload';
import { StudentFile } from 'resources/student/StudentFile';

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
