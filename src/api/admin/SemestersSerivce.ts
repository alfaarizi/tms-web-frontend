import { axiosInstance } from 'api/axiosInstance';
import { Semester } from 'resources/common/Semester';

export async function getNext() {
    const res = await axiosInstance.get<Semester>('/admin/semesters/get-next');
    return res.data;
}

export async function addNext() {
    const res = await axiosInstance.post<Semester>('/admin/semesters/add-next');
    return res.data;
}
