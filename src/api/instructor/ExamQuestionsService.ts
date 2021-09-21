import { axiosInstance } from 'api/axiosInstance';
import { ExamQuestion } from 'resources/instructor/ExamQuestion';

export async function listForQuestionSet(questionsetID: number) {
    const res = await axiosInstance.get<ExamQuestion[]>('/instructor/exam-questions/list-for-set', {
        params: { questionsetID },
    });
    return res.data;
}

export async function listForTest(testID: number, userID?: number) {
    const res = await axiosInstance.get<ExamQuestion[]>('/instructor/exam-questions/list-for-test', {
        params: {
            testID,
            userID,
        },
    });
    return res.data;
}

export async function create(question: ExamQuestion) {
    const res = await axiosInstance.post<ExamQuestion>('/instructor/exam-questions', question);
    return res.data;
}

export async function update(question: ExamQuestion) {
    const res = await axiosInstance.patch<ExamQuestion>(`/instructor/exam-questions/${question.id}`, question);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<void>(`/instructor/exam-questions/${id}`);
}
