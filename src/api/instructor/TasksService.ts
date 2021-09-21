import { axiosInstance } from 'api/axiosInstance';
import { Task } from 'resources/instructor/Task';
import { TesterFormData } from 'resources/instructor/TesterFormData';
import { User } from 'resources/common/User';
import { SetupTester } from 'resources/instructor/SetupTester';

export async function index(groupID: number) {
    const res = await axiosInstance.get<Task[][]>('/instructor/tasks', { params: { groupID } });
    return res.data;
}

export async function one(taskID: number) {
    const res = await axiosInstance.get<Task>(`/instructor/tasks/${taskID}`, {
        params: { expand: 'studentFiles, instructorFiles' },
    });
    return res.data;
}

export async function create(task: Task) {
    const res = await axiosInstance.post<Task>('/instructor/tasks', task);
    return res.data;
}

export async function update(task: Task) {
    const res = await axiosInstance.patch<Task>(`/instructor/tasks/${task.id}`, task);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete(`/instructor/tasks/${id}`);
}

export async function plagiarismListForCourse(
    courseID: number | 'All', myTasks: boolean, semesterFromID: number, semesterToID: number,
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

export async function toggleAutoTester(id: number) {
    const res = await axiosInstance.patch<Task>(`/instructor/tasks/${id}/toggle-auto-tester`);
    return res.data;
}

export async function testerFormData(id: number) {
    const res = await axiosInstance.get<TesterFormData>(`/instructor/tasks/${id}/tester-form-data`);
    return res.data;
}

export async function setupAutoTester(id: number, data: SetupTester) {
    // Build form data to upload files
    const formData = new FormData();
    formData.append('testOS', data.testOS);
    formData.append('showFullErrorMsg', data.showFullErrorMsg ? '1' : '0');
    formData.append('imageName', data.imageName || '');
    formData.append('compileInstructions', data.compileInstructions);
    formData.append('runInstructions', data.runInstructions);

    if (!!data.files && data.files.length > 0) {
        for (let i = 0; i < data.files.length; ++i) {
            formData.append('files[]', data.files[i]);
        }
    }

    const res = await axiosInstance.post<Task>(`/instructor/tasks/${id}/setup-auto-tester`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    // The api returns a string instead of number
    res.data.showFullErrorMsg = parseInt(res.data.showFullErrorMsg.toString(), 10);
    return res.data;
}
