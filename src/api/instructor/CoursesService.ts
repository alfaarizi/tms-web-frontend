import { axiosInstance } from 'api/axiosInstance';
import { Course } from 'resources/common/Course';

export async function index(instructor: boolean, forGroups: boolean) {
    const res = await axiosInstance.get<Course[]>('/instructor/courses', {
        params: {
            instructor,
            forGroups,
        },
    });
    return res.data;
}
