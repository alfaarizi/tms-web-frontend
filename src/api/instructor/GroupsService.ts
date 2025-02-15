import { axiosInstance } from '@/api/axiosInstance';
import { Group } from '@/resources/instructor/Group';
import { User } from '@/resources/common/User';
import { UserAddResponse } from '@/resources/instructor/UserAddResponse';
import { GroupStats } from '@/resources/instructor/GroupStats';
import { StudentStats } from '@/resources/instructor/StudentStats';
import { StudentNotes } from '@/resources/instructor/StudentNotes';
import { safeLocaleCompare } from '@/utils/safeLocaleCompare';

export async function index(semesterID: number, courseID?: number) {
    const res = await axiosInstance.get<Group[]>('/instructor/groups', {
        params: {
            semesterID,
            courseID,
            expand: 'instructors',
        },
    });
    return res.data;
}

export async function view(groupID: number) {
    const res = await axiosInstance.get<Group>(`/instructor/groups/${groupID}`);
    return res.data;
}

export async function create(group: Group) {
    const res = await axiosInstance.post<Group>('instructor/groups', group);
    return res.data;
}

export async function update(group: Group) {
    const res = await axiosInstance.patch<Group>(`instructor/groups/${group.id}`, group);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete(`instructor/groups/${id}`);
}

export async function duplicate(id: number) {
    const res = await axiosInstance.post<Group>(`instructor/groups/${id}/duplicate`);
    return res.data;
}

export async function addStudentNotes(groupID: number, userId: number, notes: string) {
    const res = await axiosInstance.put<StudentNotes>(
        `/instructor/groups/${groupID}/students/${userId}/notes`,
        { notes },
    );
    return res.data;
}

export async function studentNotes(groupID: number, userId: number) {
    const res = await axiosInstance.get<StudentNotes>(`/instructor/groups/${groupID}/students/${userId}/notes`);
    return res.data;
}

export async function listStudents(groupID: number) {
    const res = await axiosInstance.get<User[]>(`/instructor/groups/${groupID}/students`);
    return res.data.sort((a, b) => {
        if (a.name === b.name) {
            return a.userCode.localeCompare(b.userCode);
        }
        return safeLocaleCompare(a.name, b.name);
    });
}

export async function addStudents(groupID: number, userCodes: string[]) {
    const res = await axiosInstance.post<UserAddResponse>(`/instructor/groups/${groupID}/students`, { userCodes });
    return res.data;
}

export async function removeStudent(groupID: number, studentID: number) {
    await axiosInstance.delete<UserAddResponse>(`/instructor/groups/${groupID}/students/${studentID}`);
}

export async function listInstructors(groupID: number) {
    const res = await axiosInstance.get<User[]>(`/instructor/groups/${groupID}/instructors`);
    return res.data;
}

export async function addInstructors(groupID: number, userCodes: string[]) {
    const res = await axiosInstance.post<UserAddResponse>(`/instructor/groups/${groupID}/instructors`, { userCodes });
    return res.data;
}

export async function removeInstructor(groupID: number, instructorID: number) {
    await axiosInstance.delete<UserAddResponse>(`/instructor/groups/${groupID}/instructors/${instructorID}`);
}

export async function groupStats(groupID: number) {
    const res = await axiosInstance.get<GroupStats[]>(`instructor/groups/${groupID}/stats`);
    return res.data;
}

export async function studentStats(groupID: number, studentID: number) {
    const res = await axiosInstance.get<StudentStats[]>(`instructor/groups/${groupID}/students/${studentID}/stats`);
    return res.data;
}
