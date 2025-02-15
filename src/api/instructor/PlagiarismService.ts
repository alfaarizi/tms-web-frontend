import { axiosInstance } from '@/api/axiosInstance';
import { PlagiarismBasefile } from '@/resources/instructor/PlagiarismBasefile';
import { BaseFileUpload } from '@/resources/instructor/BaseFileUpload';
import { BaseFileUploadResult } from '@/resources/instructor/BaseFileUploadResult';
import { Plagiarism } from '@/resources/instructor/Plagiarism';
import { PlagiarismType } from '@/resources/instructor/PlagiarismType';
import { RequestPlagiarism } from '@/resources/instructor/RequestPlagiarism';

export async function index(semesterID: number) {
    const res = await axiosInstance.get<Plagiarism[]>('/instructor/plagiarism', { params: { semesterID } });
    return res.data;
}

export async function getServices() {
    const res = await axiosInstance.get<PlagiarismType[]>('/instructor/plagiarism/services');
    return res.data;
}

export async function add(data: RequestPlagiarism) {
    const res = await axiosInstance.post<Plagiarism>('/instructor/plagiarism', data);
    return res.data;
}

export async function update(id: number, data: Plagiarism) {
    const res = await axiosInstance.patch<Plagiarism>(`/instructor/plagiarism/${id}`, data);
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<Plagiarism>(`/instructor/plagiarism/${id}`);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete(`/instructor/plagiarism/${id}`);
}

export async function run(id: number) {
    const res = await axiosInstance.post<Plagiarism>(`/instructor/plagiarism/${id}/run`);
    return res.data;
}

export async function getBasefiles() {
    const res = await axiosInstance.get<PlagiarismBasefile[]>(
        '/instructor/plagiarism-basefile',
        { params: { expand: 'course,deletable' } },
    );
    return res.data;
}

export async function basefilesByTasks(ids: number[]) {
    const res = await axiosInstance.post<PlagiarismBasefile[]>(
        '/instructor/plagiarism-basefile/by-tasks?expand=course',
        { ids },
    );
    return res.data;
}

export async function downloadBasefile(id: number) {
    const res = await axiosInstance.get<Blob>(`/instructor/plagiarism-basefile/${id}/download`, {
        responseType: 'blob',
    });
    return res.data;
}

export async function uploadBasefiles(uploadData: BaseFileUpload) {
    const formData = new FormData();
    formData.append('courseID', uploadData.courseID.toString());
    for (let i = 0; i < uploadData.files.length; ++i) {
        formData.append('files[]', uploadData.files[i]);
    }

    const res = await axiosInstance.post<BaseFileUploadResult>('/instructor/plagiarism-basefile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export async function removeBasefile(id: number) {
    await axiosInstance.delete(`/instructor/plagiarism-basefile/${id}`);
}
