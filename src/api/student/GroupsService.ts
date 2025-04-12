import { axiosInstance } from '@/api/axiosInstance';
import { Group } from '@/resources/student/Group';

export async function index(semesterID: number) {
    const res = await axiosInstance.get<Group[]>('/student/groups', {
        params: {
            semesterID,
            expand: 'course',
        },
    });
    return res.data;
}

export async function view(groupID: number) {
    const res = await axiosInstance.get<Group>(`/student/groups/${groupID}`, { params: { expand: 'course,notes' } });
    return res.data;
}
