import { TestCase } from '@/resources/instructor/TestCase';
import { axiosInstance } from '@/api/axiosInstance';

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

export async function exportTestCases(taskID: number, format: string) {
    const res = await axiosInstance.get<Blob>('/instructor/test-cases/export-test-cases', {
        params: { taskID, format },
        responseType: 'blob',
    });
    return res.data;
}

export async function importTestCases(taskID: number, file: File) {
    const uploadData = new FormData();
    uploadData.append('file', file);
    const res = await axiosInstance.post<TestCase[]>('/instructor/test-cases/import-test-cases', uploadData, {
        params: { taskID },
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}
