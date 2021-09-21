import { axiosInstance } from 'api/axiosInstance';
import { LoginResponse } from 'resources/common/LoginResponse';
import { MockLogin } from 'resources/common/MockLogin';
import { UserInfo } from 'resources/common/UserInfo';
import { LdapLogin } from 'resources/common/LdapLogin';

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

export async function updateUserLocale(locale: string) {
    await axiosInstance.put('/common/auth/update-user-locale', { locale });
}
