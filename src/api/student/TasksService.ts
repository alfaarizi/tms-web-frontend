import { axiosInstance } from 'api/axiosInstance';
import { Task } from 'resources/student/Task';
import { AxiosResponse } from 'axios';
import { UnlockItem } from 'resources/student/UnlockItem';

export async function index(groupID: number) {
    const res = await axiosInstance.get<Task[][]>('/student/tasks', {
        params: {
            groupID,
            expand: 'submissions',
        },
    });
    return res.data;
}

export async function one(taskID: number) {
    const res = await axiosInstance.get<Task>(`/student/tasks/${taskID}`, {
        params: {
            expand: 'submissions, taskFiles,'
            + 'submissions.codeCheckerResult, submissions.codeCheckerResult.codeCheckerReports',
        },
    });
    return res.data;
}

export async function unlock(taskId: number, data: UnlockItem) {
    const res = await axiosInstance.post<UnlockItem, AxiosResponse<Task>>(
        `/student/tasks/${taskId}/unlock`, { password: data.password },
    );
    return res.data;
}
