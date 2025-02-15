import { QuizAnswer } from '@/resources/instructor/QuizAnswer';
import { axiosInstance } from '@/api/axiosInstance';

export async function index(questionID: number) {
    const res = await axiosInstance.get<QuizAnswer[]>('/instructor/quiz-answers', {
        params: { questionID },
    });
    return res.data;
}

export async function create(answer: QuizAnswer) {
    const res = await axiosInstance.post<QuizAnswer>('/instructor/quiz-answers', answer);
    return res.data;
}

export async function update(answer: QuizAnswer) {
    const res = await axiosInstance.patch<QuizAnswer>(`/instructor/quiz-answers/${answer.id}`, answer);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<void>(`/instructor/quiz-answers/${id}`);
}
