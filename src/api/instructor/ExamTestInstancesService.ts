import { axiosInstance } from 'api/axiosInstance';
import { ExamTestInstance } from 'resources/instructor/ExamTestInstance';

export async function index(testID: number, submitted?: boolean) {
    const res = await axiosInstance.get<ExamTestInstance[]>('/instructor/exam-test-instances', {
        params: {
            testID,
            submitted,
        },
    });
    return res.data;
}
