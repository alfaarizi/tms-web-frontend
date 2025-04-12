import { Notification } from '@/resources/common/Notification';
import { axiosInstance } from '@/api/axiosInstance';

export async function index() {
    const res = await axiosInstance.get<Notification[]>('/common/notifications');
    return res.data;
}

export async function dismiss(notification: Notification) {
    const res = await axiosInstance.post<Notification>(
        `common/notifications/dismiss?notificationID=${notification.id}`,
    );
    return res.data;
}
