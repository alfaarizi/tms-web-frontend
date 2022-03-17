import { axiosInstance } from 'api/axiosInstance';
import { PublicSystemInfo } from 'resources/common/PublicSystemInfo';

export async function publicInfo() {
    const res = await axiosInstance.get<PublicSystemInfo>('/common/system/public-info');
    return res.data;
}
