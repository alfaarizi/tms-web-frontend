import { Notification } from 'resources/instructor/Notification';
import { axiosInstance } from 'api/axiosInstance';

export async function index(groupID: number) {
    const res = await axiosInstance.get<Notification[]>('/instructor/notifications', {
        params: {
            groupID,
        },
    });
    return res.data;
}

export async function view(notificationID: number) {
    const res = await axiosInstance.get<Notification>(`/instructor/notifications/${notificationID}`);
    return res.data;
}

export async function create(notification: Notification) {
    const res = await axiosInstance.post<Notification>('instructor/notifications', notification);
    return res.data;
}

export async function update(notification: Notification) {
    const res = await axiosInstance.patch<Notification>(`instructor/notifications/${notification.id}`, notification);
    return res.data;
}

export async function remove(notificationID: number) {
    const res = await axiosInstance.delete<Notification>(`instructor/notifications/${notificationID}`);
    return res.data;
}
