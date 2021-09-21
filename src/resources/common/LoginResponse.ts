import { UserInfo } from 'resources/common/UserInfo';

export interface LoginResponse {
    accessToken: string;
    imageToken: string;
    userInfo: UserInfo;
}
