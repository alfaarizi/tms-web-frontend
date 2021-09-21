import { axiosInstance } from 'api/axiosInstance';
import { Plagiarism } from 'resources/instructor/Plagiarism';
import { RequestPlagiarism } from 'resources/instructor/RequestPlagiarism';

export async function index(semesterID: number) {
    const res = await axiosInstance.get<Plagiarism[]>('/instructor/plagiarism', { params: { semesterID } });
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

export async function runMoss(id: number) {
    const res = await axiosInstance.post<Plagiarism>(`/instructor/plagiarism/${id}/run-moss`);
    return res.data;
}
