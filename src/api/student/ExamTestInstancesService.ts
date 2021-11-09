import { ExamTestInstance } from 'resources/student/ExamTestInstance';
import { ExamResultQuestion } from 'resources/student/ExamResultQuestion';
import { axiosInstance } from 'api/axiosInstance';
import { ExamWriterData } from 'resources/student/ExamWriterData';
import { ExamTestInstanceAnswer } from 'resources/student/ExamTestInstanceAnswer';

export async function index(semesterID: number, submitted: boolean, future: boolean) {
    const res = await axiosInstance.get<ExamTestInstance[]>('/student/exam-test-instances', {
        params: {
            semesterID,
            submitted,
            future,
        },
    });
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<ExamTestInstance>(`/student/exam-test-instances/${id}`);
    return res.data;
}

export async function results(id: number) {
    const res = await axiosInstance.get<ExamResultQuestion[]>(`/student/exam-test-instances/${id}/results`);
    return res.data;
}

export async function startWrite(id: number) {
    const res = await axiosInstance.post<ExamWriterData>(`/student/exam-test-instances/${id}/start-write`);
    return res.data;
}

export async function finishWrite(id: number, arr: ExamTestInstanceAnswer[]) {
    const res = await axiosInstance.post<ExamTestInstance>(`/student/exam-test-instances/${id}/finish-write`, arr);
    return res.data;
}
