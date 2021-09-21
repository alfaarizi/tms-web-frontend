import { TestCase } from 'resources/instructor/TestCase';
import { axiosInstance } from '../axiosInstance';

export async function index(taskID: number) {
    const res = await axiosInstance.get<TestCase[]>('/instructor/test-cases', {
        params: { taskID },
    });
    return res.data;
}

export async function create(answer: TestCase) {
    const res = await axiosInstance.post<TestCase>('/instructor/test-cases', answer);
    return res.data;
}

export async function update(testCase: TestCase) {
    const res = await axiosInstance.patch<TestCase>(`/instructor/test-cases/${testCase.id}`, testCase);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<void>(`/instructor/test-cases/${id}`);
}
