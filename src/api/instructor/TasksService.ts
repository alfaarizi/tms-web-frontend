import { axiosInstance } from '@/api/axiosInstance';
import { Task } from '@/resources/instructor/Task';
import { User } from '@/resources/common/User';
import { CodeCompassParameters } from '@/resources/instructor/CodeCompassParameters';
import { TaskUpdate } from '@/resources/instructor/TaskUpdate';
import { GridTask } from '@/resources/instructor/GridTask';

/**
 * Loads task list
 * @param groupID
 */
export async function index(groupID: number) {
    const res = await axiosInstance.get<Task[][]>('/instructor/tasks', {
        params: {
            groupID,
            expand: 'group',
        },
    });
    return res.data;
}

/**
 * Loads task list with submissions. Only select necessary fields for the task grid.
 * @param groupID
 */
export async function getTasksForGrid(groupID: number) {
    const res = await axiosInstance.get<GridTask[][]>('/instructor/tasks', {
        params: {
            groupID,
            fields: 'id,name,available,softDeadline,hardDeadline,translatedCategory'
                + ',submissions.id,submissions.status,submissions.translatedStatus'
                + ',submissions.grade,submissions.uploaderID,submissions.verified',
            expand: 'submissions',
        },
    });
    return res.data;
}

export async function one(taskID: number) {
    const res = await axiosInstance.get<Task>(`/instructor/tasks/${taskID}`, {
        params: { expand: 'group,taskLevelGitRepo' },
    });
    return res.data;
}

export async function create(task: Task) {
    const res = await axiosInstance.post<Task>('/instructor/tasks?expand=group,taskLevelGitRepo', task);
    return res.data;
}

export async function update(data: TaskUpdate) {
    const res = await axiosInstance
        .patch<Task>(`/instructor/tasks/${data.task.id}?expand=group,taskLevelGitRepo`, data);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete(`/instructor/tasks/${id}`);
}

export async function plagiarismListForCourse(
    courseID: number | 'All',
    myTasks: boolean,
    semesterFromID: number,
    semesterToID: number,
) {
    const res = await axiosInstance.get<Task[]>('/instructor/tasks/list-for-course', {
        params: {
            courseID,
            myTasks,
            semesterFromID,
            semesterToID,
            fields: 'id,name,group.number, group.course.name, semester.name',
            expand: 'group.course, semester',
        },
    });
    return res.data;
}

export async function listUsers(ids: number[]) {
    const res = await axiosInstance.post<User[]>('/instructor/tasks/list-users', { ids });
    return res.data;
}

export async function setupCodeCompassParameters(id: number, data: CodeCompassParameters) {
    const formData = new FormData();
    formData.append('codeCompassCompileInstructions', data.compileInstructions);
    formData.append('codeCompassPackagesInstallInstructions', data.packagesInstallInstructions);

    const res = await axiosInstance.post<Task>(`/instructor/tasks/${id}/setup-code-compass-parser`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}
