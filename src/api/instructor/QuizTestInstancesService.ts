import { axiosInstance } from 'api/axiosInstance';
import { QuizTestInstance } from 'resources/instructor/QuizTestInstance';

export async function index(testID: number, submitted?: boolean) {
    const res = await axiosInstance.get<QuizTestInstance[]>('/instructor/quiz-test-instances', {
        params: {
            testID,
            submitted,
        },
    });
    return res.data;
}
