import { ExamTest } from 'resources/instructor/ExamTest';
import { axiosInstance } from '../axiosInstance';

export async function index(semesterID: number) {
    const res = await axiosInstance.get<ExamTest[]>('/instructor/exam-tests', {
        params: { semesterID },
    });
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<ExamTest>(`/instructor/exam-tests/${id}`);
    return res.data;
}

export async function create(test: ExamTest) {
    const res = await axiosInstance.post<ExamTest>('/instructor/exam-tests', test);
    return res.data;
}

export async function update(test: ExamTest) {
    const res = await axiosInstance.put<ExamTest>(`/instructor/exam-tests/${test.id}`, test);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<void>(`/instructor/exam-tests/${id}`);
}

export async function duplicate(id: number) {
    const res = await axiosInstance.post<ExamTest>(`/instructor/exam-tests/${id}/duplicate`);
    return res.data;
}

export async function finalize(id: number) {
    await axiosInstance.post<void>(`/instructor/exam-tests/${id}/finalize`);
}
