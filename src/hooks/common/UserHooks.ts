import { useTranslation } from 'react-i18next';
import {
    MutationFunction, useMutation, useQuery, useQueryClient,
} from 'react-query';

import * as AuthService from 'api/common/AuthService';
import { UserInfo } from 'resources/common/UserInfo';
import { MockLogin } from 'resources/common/MockLogin';
import { axiosInstance } from 'api/axiosInstance';
import { LoginResponse } from 'resources/common/LoginResponse';
import { LdapLogin } from 'resources/common/LdapLogin';
import { useHistory } from 'react-router';
import { useAppContext } from 'context/AppContext';

export const USER_INFO_QUERY_KEY = 'userinfo';

/**
 * Changes i18next language and updates the Accept-Language header.
 */
export function useClientSideLocaleChange() {
    const { i18n } = useTranslation();
    const queryClient = useQueryClient();

    const change = async (locale: string) => {
        // Always update the header, to make sure it is not undefined
        axiosInstance.defaults.headers.common['Accept-Language'] = locale;

        // Change i18next language, if the new locale is different
        if (locale !== i18n.language) {
            await i18n.changeLanguage(locale);

            // Reload all content to change dynamic content language
            // Cancel all fetching queries,
            // to make sure the next invalidate call will trigger a refetch with the updated header
            await queryClient.cancelQueries({ fetching: true });
            // Then invalidate all queries, to trigger a refetch
            await queryClient.invalidateQueries();
        }
    };

    return {
        change,
    };
}

/**
 * Locale set mutation.
 * Sets location on the server, then update i18next configuration and headers
 */
export function useChangeUserLocaleMutation() {
    const clientSideLocale = useClientSideLocaleChange();

    return useMutation((locale: string) => AuthService.updateUserLocale(locale), {
        onSuccess: async (_data, locale) => {
            // Also change clientside locale
            await clientSideLocale.change(locale);
        },
    });
}

/**
 * Provides information about the current user
 */
export function useUserInfo(enabled: boolean = true) {
    const appContext = useAppContext();
    const clientSideLocale = useClientSideLocaleChange();

    return useQuery<UserInfo>(USER_INFO_QUERY_KEY, () => AuthService.userinfo(), {
        enabled,
        onSuccess: async (data) => {
            if (!data) {
                return;
            }

            // Update language based on userinfo
            await clientSideLocale.change(data.locale);

            // Set selected semester to actual semester, if it is null
            if (appContext.selectedSemester === null) {
                appContext.setSelectedSemester(data.actualSemester);
            }
        },
    });
}

/**
 * Generic login mutation. Other login methods should use this hook with their own TLoginData type and mutationFn.
 * @param mutationFn
 */
export function useBaseLoginMutation<TLoginData>(mutationFn: MutationFunction<LoginResponse, TLoginData>) {
    const queryClient = useQueryClient();
    const appContext = useAppContext();
    const clientSideLocale = useClientSideLocaleChange();

    return useMutation(mutationFn, {
        retry: false,
        onSuccess: async (data: LoginResponse) => {
            // Save token to localStorage
            localStorage.setItem('accessToken', data.accessToken);
            // Set token in axiosInstance
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
            // Set image token in local storage
            localStorage.setItem('imageToken', data.imageToken);
            // Update userInfo based on response
            queryClient.setQueryData(USER_INFO_QUERY_KEY, data.userInfo);
            // Set selected semester
            appContext.setSelectedSemester(data.userInfo.actualSemester);
            // Set locale
            await clientSideLocale.change(data.userInfo.locale);
        },
    });
}

/**
 * MockLogin mutation
 */
export function useMockLoginMutation() {
    return useBaseLoginMutation<MockLogin>((loginData: MockLogin) => AuthService.mockLogin(loginData));
}

/**
 * LdapLogin mutation
 */
export function useLdapLoginMutation() {
    return useBaseLoginMutation<LdapLogin>((loginData: LdapLogin) => AuthService.ldapLogin(loginData));
}

/**
 * Logout mutation
 */
export function useLogoutMutation() {
    const queryClient = useQueryClient();
    const history = useHistory();
    const appContext = useAppContext();

    const localLogout = () => {
        // Remove access token
        axiosInstance.defaults.headers.common.Authorization = '';
        // Remove all queries expect userInfo, for security reasons
        queryClient.removeQueries({
            predicate: (query) => query.queryKey !== USER_INFO_QUERY_KEY,
        });
        // Reset AppContext, for security reasons
        appContext.resetState();
        // Reset localStorage, this also clears accessTokens
        localStorage.clear();
        // Set userinfo to null
        queryClient.setQueryData(USER_INFO_QUERY_KEY, null);
        // Redirect to homepage
        history.replace('/');
    };

    const mutation = useMutation(() => AuthService.logout(), {
        retry: false,
        onSettled: () => {
            localLogout();
        },
    });

    return {
        logout: mutation.mutate,
        logoutExpired: localLogout,
    };
}
