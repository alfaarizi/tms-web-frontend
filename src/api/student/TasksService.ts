import { axiosInstance } from 'api/axiosInstance';
import { Task } from 'resources/student/Task';

export async function index(groupID: number) {
    const res = await axiosInstance.get<Task[][]>('/student/tasks', {
        params: {
            groupID,
            expand: 'studentFiles',
        },
    });
    return res.data;
}

export async function one(taskID: number) {
    const res = await axiosInstance.get<Task>(`/student/tasks/${taskID}`, {
        params: { expand: 'studentFiles, instructorFiles' },
    });
    return res.data;
}
