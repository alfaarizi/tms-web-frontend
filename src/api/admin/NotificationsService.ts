import { Notification } from '@/resources/admin/Notification';
import { axiosInstance } from '@/api/axiosInstance';

export async function index() {
    const res = await axiosInstance.get<Notification[]>('/admin/notifications');
    return res.data;
}

export async function view(notificationID: number) {
    const res = await axiosInstance.get<Notification>(`/admin/notifications/${notificationID}`);
    return res.data;
}

export async function create(notification: Notification) {
    const res = await axiosInstance.post<Notification>('admin/notifications', notification);
    return res.data;
}

export async function update(notification: Notification) {
    const res = await axiosInstance.patch<Notification>(`admin/notifications/${notification.id}`, notification);
    return res.data;
}

export async function remove(notificationID: number) {
    const res = await axiosInstance.delete<Notification>(`admin/notifications/${notificationID}`);
    return res.data;
}
