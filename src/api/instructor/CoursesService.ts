import { axiosInstance } from 'api/axiosInstance';
import { Course } from 'resources/common/Course';
import { CreateOrUpdateCourse } from 'resources/common/CreateOrUpdateCourse';
import { User } from 'resources/common/User';
import { UserAddResponse } from 'resources/instructor/UserAddResponse';

export async function index(instructor: boolean, forGroups: boolean) {
    const res = await axiosInstance.get<Course[]>('/instructor/courses', {
        params: {
            instructor,
            forGroups,
        },
    });
    return res.data;
}

export async function view(courseID: number) {
    const res = await axiosInstance.get<Course>(`/instructor/courses/${courseID}`);
    return res.data;
}

export async function update(id: number, course: CreateOrUpdateCourse) {
    const res = await axiosInstance.patch<Course>(`/instructor/courses/${id}`, course);
    return res.data;
}

export async function listLecturers(courseID: number) {
    const res = await axiosInstance.get<User[]>(`/instructor/courses/${courseID}/lecturers`);
    return res.data;
}

export async function addLecturers(courseID: number, userCodes: string[]) {
    const res = await axiosInstance.post<UserAddResponse>(`/instructor/courses/${courseID}/lecturers`, { userCodes });
    return res.data;
}

export async function removeLecturer(courseID: number, lecturerID: number) {
    await axiosInstance.delete<UserAddResponse>(`/instructor/courses/${courseID}/lecturers/${lecturerID}`);
}
