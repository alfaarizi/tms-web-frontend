import { axiosInstance } from '@/api/axiosInstance';

export async function syncSubmission(taskID: number) {
    await axiosInstance.post<void>(`/student/canvas/sync-submission?taskID=${taskID}`);
}
