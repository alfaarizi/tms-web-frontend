import { axiosInstance } from 'api/axiosInstance';
import { UserSettings } from 'resources/common/UserSettings';
import { ConfirmEmailResponse } from 'resources/common/ConfirmEmailResponse';

export async function getSettings() {
    const res = await axiosInstance.get<UserSettings>('/common/user-settings');
    return res.data;
}

export async function putSettings(settings: UserSettings) {
    await axiosInstance.put('/common/user-settings', settings);
}

export async function postConfirmEmail(code: string) {
    const res = await axiosInstance.post<ConfirmEmailResponse>(`/common/user-settings/confirm-email?code=${code}`);
    return res.data;
}
