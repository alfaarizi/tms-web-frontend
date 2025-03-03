import { QuizTest } from 'resources/instructor/QuizTest';
import { axiosInstance } from '../axiosInstance';

export async function index(semesterID: number) {
    const res = await axiosInstance.get<QuizTest[]>('/instructor/quiz-tests', {
        params: {
            semesterID,
            expand: 'group',
        },
    });
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<QuizTest>(`/instructor/quiz-tests/${id}`);
    return res.data;
}

export async function create(test: QuizTest) {
    const res = await axiosInstance.post<QuizTest>('/instructor/quiz-tests', test);
    return res.data;
}

export async function update(test: QuizTest) {
    const res = await axiosInstance.put<QuizTest>(`/instructor/quiz-tests/${test.id}`, test);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<void>(`/instructor/quiz-tests/${id}`);
}

export async function duplicate(id: number) {
    const res = await axiosInstance.post<QuizTest>(`/instructor/quiz-tests/${id}/duplicate`);
    return res.data;
}

export async function finalize(id: number) {
    await axiosInstance.post<void>(`/instructor/quiz-tests/${id}/finalize`);
}
