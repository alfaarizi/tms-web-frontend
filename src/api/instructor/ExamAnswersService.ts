import { ExamAnswer } from 'resources/instructor/ExamAnswer';
import { axiosInstance } from '../axiosInstance';

export async function index(questionID: number) {
    const res = await axiosInstance.get<ExamAnswer[]>('/instructor/exam-answers', {
        params: { questionID },
    });
    return res.data;
}

export async function create(answer: ExamAnswer) {
    const res = await axiosInstance.post<ExamAnswer>('/instructor/exam-answers', answer);
    return res.data;
}

export async function update(answer: ExamAnswer) {
    const res = await axiosInstance.patch<ExamAnswer>(`/instructor/exam-answers/${answer.id}`, answer);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<void>(`/instructor/exam-answers/${id}`);
}
