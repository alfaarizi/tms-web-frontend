import { axiosInstance } from 'api/axiosInstance';
import { PublicSystemInfo } from 'resources/common/PublicSystemInfo';
import { PrivateSystemInfo } from 'resources/common/PrivateSystemInfo';

export async function publicInfo() {
    const res = await axiosInstance.get<PublicSystemInfo>('/common/system/public-info');
    return res.data;
}

export async function privateInfo() {
    const res = await axiosInstance.get<PrivateSystemInfo>('/common/system/private-info');
    return res.data;
}
