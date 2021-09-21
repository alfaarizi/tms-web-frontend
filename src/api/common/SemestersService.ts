import { axiosInstance } from 'api/axiosInstance';
import { Semester } from 'resources/common/Semester';

export async function index() {
    const res = await axiosInstance.get<Semester[]>('/common/semesters');
    return res.data;
}
