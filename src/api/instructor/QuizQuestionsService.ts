import { axiosInstance } from 'api/axiosInstance';
import { QuizQuestion } from 'resources/instructor/QuizQuestion';

export async function listForQuestionSet(questionsetID: number) {
    const res = await axiosInstance.get<QuizQuestion[]>('/instructor/quiz-questions/list-for-set', {
        params: { questionsetID },
    });
    return res.data;
}

export async function listForTest(testID: number, userID?: number) {
    const res = await axiosInstance.get<QuizQuestion[]>('/instructor/quiz-questions/list-for-test', {
        params: {
            testID,
            userID,
        },
    });
    return res.data;
}

export async function create(question: QuizQuestion) {
    const res = await axiosInstance.post<QuizQuestion>('/instructor/quiz-questions', question);
    return res.data;
}

export async function update(question: QuizQuestion) {
    const res = await axiosInstance.patch<QuizQuestion>(`/instructor/quiz-questions/${question.id}`, question);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<void>(`/instructor/quiz-questions/${id}`);
}
