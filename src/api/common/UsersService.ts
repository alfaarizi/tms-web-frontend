import { axiosInstance } from 'api/axiosInstance';
import { User } from 'resources/common/User';

export async function searchStudent(text: string) {
    const res = await axiosInstance.get<User[]>(`common/users/student?text=${text}`);
    return res.data;
}

export async function searchFaculty(text: string) {
    const res = await axiosInstance.get<User[]>(`common/users/faculty?text=${text}`);
    return res.data;
}
