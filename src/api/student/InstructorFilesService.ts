import { axiosInstance } from 'api/axiosInstance';

export async function download(id: number) {
    const res = await axiosInstance.get<Blob>(`/student/instructor-files/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}
