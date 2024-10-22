import { Course } from 'resources/common/Course';
import { axiosInstance } from 'api/axiosInstance';
import { User } from 'resources/common/User';
import { UserAddResponse } from 'resources/instructor/UserAddResponse';
import { CreateOrUpdateCourse } from 'resources/common/CreateOrUpdateCourse';

export async function index() {
    const res = await axiosInstance.get<Course[]>('/admin/courses');
    return res.data;
}

export async function view(courseID: number) {
    const res = await axiosInstance.get<Course>(`/admin/courses/${courseID}`);
    return res.data;
}

export async function create(course: CreateOrUpdateCourse) {
    const res = await axiosInstance.post<Course>('admin/courses', course);
    return res.data;
}

export async function update(id: number, course: CreateOrUpdateCourse) {
    const res = await axiosInstance.patch<Course>(`admin/courses/${id}`, course);
    return res.data;
}

export async function listLecturers(courseID: number) {
    const res = await axiosInstance.get<User[]>(`admin/courses/${courseID}/lecturers`);
    return res.data;
}

export async function addLecturers(courseID: number, userCodes: string[]) {
    const res = await axiosInstance.post<UserAddResponse>(`admin/courses/${courseID}/lecturers`, { userCodes });
    return res.data;
}

export async function removeLecturer(courseID: number, lecturerID: number) {
    await axiosInstance.delete<UserAddResponse>(`/admin/courses/${courseID}/lecturers/${lecturerID}`);
}
