import { axiosInstance } from 'api/axiosInstance';

export async function download(id: number) {
    const res = await axiosInstance.get<Blob>(`/student/task-files/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}
