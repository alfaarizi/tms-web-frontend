import { axiosInstance } from 'api/axiosInstance';
import { ConfirmEmailResponse } from 'resources/common/ConfirmEmailResponse';
import { LoginResponse } from 'resources/common/LoginResponse';
import { MockLogin } from 'resources/common/MockLogin';
import { UserInfo } from 'resources/common/UserInfo';
import { LdapLogin } from 'resources/common/LdapLogin';
import { UserSettings } from 'resources/common/UserSettings';

export async function ldapLogin(loginData: LdapLogin) {
    const res = await axiosInstance.post<LoginResponse>('/common/auth/ldap-login', loginData);
    return res.data;
}

export async function mockLogin(loginData: MockLogin) {
    const res = await axiosInstance.post<LoginResponse>('/common/auth/mock-login', loginData);
    return res.data;
}

export async function userinfo() {
    const res = await axiosInstance.get<UserInfo>('/common/auth/user-info');
    return res.data;
}

export async function logout() {
    await axiosInstance.post('/common/auth/logout');
}

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
