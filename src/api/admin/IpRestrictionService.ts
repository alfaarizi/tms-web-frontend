import { IpRestriction } from '@/resources/admin/IpRestriction';
import { axiosInstance } from '@/api/axiosInstance';

// Fetch all IP restrictions
export async function index() {
    const res = await axiosInstance.get<IpRestriction[]>('/admin/ip-restriction');
    return res.data;
}

// View a specific IP restriction by ID
export async function view(ipRestrictionID: number) {
    const res = await axiosInstance.get<IpRestriction>(`/admin/ip-restriction/${ipRestrictionID}`);
    return res.data;
}

// Create a new IP restriction
export async function create(ipRestriction: IpRestriction) {
    const res = await axiosInstance.post<IpRestriction>('/admin/ip-restriction', ipRestriction);
    return res.data;
}

// Update an existing IP restriction
export async function update(ipRestriction: IpRestriction) {
    const res = await axiosInstance.patch<IpRestriction>(`/admin/ip-restriction/${ipRestriction.id}`, ipRestriction);
    return res.data;
}

// Delete an IP restriction by ID
export async function remove(ipRestrictionID: number) {
    const res = await axiosInstance.delete<IpRestriction>(`/admin/ip-restriction/${ipRestrictionID}`);
    return res.data;
}
