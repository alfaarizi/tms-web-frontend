import { Course } from '@/resources/common/Course';
import { axiosInstance } from '@/api/axiosInstance';
import { CreateOrUpdateCourse } from '@/resources/common/CreateOrUpdateCourse';

export async function index() {
    const res = await axiosInstance.get<Course[]>('/admin/courses');
    return res.data;
}

export async function create(course: CreateOrUpdateCourse) {
    const res = await axiosInstance.post<Course>('/admin/courses', course);
    return res.data;
}
