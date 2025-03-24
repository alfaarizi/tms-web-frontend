import { QuizTestInstance } from 'resources/student/QuizTestInstance';
import { QuizResultQuestion } from 'resources/student/QuizResultQuestion';
import { axiosInstance } from 'api/axiosInstance';
import { QuizWriterData } from 'resources/student/QuizWriterData';
import { QuizTestInstanceAnswer } from 'resources/student/QuizTestInstanceAnswer';
import { UnlockTest } from 'resources/student/UnlockTest';

export async function index(semesterID: number, submitted: boolean, future: boolean) {
    const res = await axiosInstance.get<QuizTestInstance[]>('/student/quiz-test-instances', {
        params: {
            semesterID,
            submitted,
            future,
            expand: 'group',
        },
    });
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<QuizTestInstance>(`/student/quiz-test-instances/${id}`);
    return res.data;
}

export async function results(id: number) {
    const res = await axiosInstance.get<QuizResultQuestion[]>(`/student/quiz-test-instances/${id}/results`);
    return res.data;
}

export async function startWrite(id: number) {
    const res = await axiosInstance.post<QuizWriterData>(`/student/quiz-test-instances/${id}/start-write`);
    return res.data;
}

export async function finishWrite(id: number, arr: QuizTestInstanceAnswer[]) {
    const res = await axiosInstance.post<QuizTestInstance>(
        `/student/quiz-test-instances/${id}/finish-write`,
        arr,
    );
    return res.data;
}

export async function unlock(data: UnlockTest) {
    await axiosInstance.post('/student/quiz-test-instances/unlock', data);
}
