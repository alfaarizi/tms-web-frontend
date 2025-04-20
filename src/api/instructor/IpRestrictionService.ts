import { IpRestrictionItem } from '@/resources/instructor/IpRestrictionItem';
import { axiosInstance } from '@/api/axiosInstance';

// Fetch all IP restrictions
export async function index() {
    const res = await axiosInstance.get<IpRestrictionItem[]>('/instructor/ip-restriction');
    return res.data;
}
