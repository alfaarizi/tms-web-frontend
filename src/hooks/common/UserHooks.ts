import { useTranslation } from 'react-i18next';
import {
    MutationFunction, useMutation, useQuery, useQueryClient,
} from 'react-query';

import * as AuthService from '@/api/common/AuthService';
import * as UserSettingsService from '@/api/common/UserSettingsService';
import { MockLogin } from '@/resources/common/MockLogin';
import { axiosInstance } from '@/api/axiosInstance';
import { LoginResponse } from '@/resources/common/LoginResponse';
import { LdapLogin } from '@/resources/common/LdapLogin';
import { useHistory } from 'react-router';
import { useGlobalContext } from '@/context/GlobalContext';
import { UserSettings } from '@/resources/common/UserSettings';
import { usePrivateSystemInfoQuery } from '@/hooks/common/SystemHooks';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, IMAGE_TOKEN_LOCAL_STORAGE_KEY } from '@/constants/localStorageKeys';
import * as UsersService from '@/api/common/UsersService';
import { User } from '@/resources/common/User';

export const USER_SETTINGS_QUERY_KEY = 'usersettings';
export const SEARCH_STUDENT_QUERY_KEY = 'common/users/student';
export const SEARCH_FACULTY_QUERY_KEY = 'common/users/faculty';

/**
 * Changes i18next language and updates the Accept-Language header.
 */
export function useClientSideLocaleChange() {
    const { i18n } = useTranslation();
    const queryClient = useQueryClient();

    const mutateAsync = async (locale: string) => {
        // Always update the header, to make sure it is not undefined
        axiosInstance.defaults.headers.common['Accept-Language'] = locale;

        // Change i18next language, if the new locale is different
        if (locale !== i18n.language) {
            await i18n.changeLanguage(locale);
            document.documentElement.lang = locale;

            // Reload all content to change dynamic content language
            // Cancel all fetching queries,
            // to make sure the next invalidate call will trigger a refetch with the updated header
            await queryClient.cancelQueries({ fetching: true });
            // Then invalidate all queries, to trigger a refetch
            await queryClient.invalidateQueries();
        }
    };

    return {
        mutateAsync,
    };
}

/**
 * Provides information about the current user
 */
export function useUserSettings(enabled: boolean = true) {
    return useQuery<UserSettings>(USER_SETTINGS_QUERY_KEY, () => UserSettingsService.getSettings(), {
        enabled,
    });
}

export function useSettingsMutation() {
    const clientSideLocale = useClientSideLocaleChange();

    return useMutation((settings: UserSettings) => UserSettingsService.putSettings(settings), {
        onSuccess: async (_data, settings) => {
            // Also change client-side locale
            await clientSideLocale.mutateAsync(settings.locale);
        },
    });
}

export function useConfirmEmailMutation() {
    return useMutation((code: string) => UserSettingsService.postConfirmEmail(code));
}

/**
 * Tries to authenticate the user with the access token set in the local storage
 */
export function useTokenAuth() {
    const userSettings = useUserSettings(false);
    const privateSystemInfo = usePrivateSystemInfoQuery(false);
    const globalContext = useGlobalContext();
    const clientSideLocale = useClientSideLocaleChange();

    const tryAuthenticate = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

        // Set token in axiosInstance
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Try to load user information
        const { data: userInfoData } = await userSettings.refetch();
        if (!userInfoData) {
            globalContext.setIsLoggedIn(false);
            return;
        }

        // Try to load system information
        const { data: privateSystemInfoData } = await privateSystemInfo.refetch();
        if (!privateSystemInfoData) {
            globalContext.setIsLoggedIn(false);
            return;
        }

        // If loading user settings and private system info, then the token was valid
        // Set the initial version of the global state from the aforementioned resources
        await clientSideLocale.mutateAsync(userInfoData.locale);
        globalContext.setSelectedSemester(privateSystemInfoData.actualSemester);
        globalContext.setIsLoggedIn(true);
    };

    return {
        tryAuthenticate,
    };
}

/**
 * Generic login mutation. Other login methods should use this hook with their own TLoginData type and mutationFn.
 * @param mutationFn
 */
export function useBaseLoginMutation<TLoginData>(mutationFn: MutationFunction<LoginResponse, TLoginData>) {
    const tokenAuth = useTokenAuth();

    return useMutation(mutationFn, {
        retry: false,
        onSuccess: async (loginResponse: LoginResponse) => {
            // Save token to localStorage
            localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, loginResponse.accessToken);
            // Set image token in local storage
            localStorage.setItem(IMAGE_TOKEN_LOCAL_STORAGE_KEY, loginResponse.imageToken);
            // Load user data after the tokens are set
            await tokenAuth.tryAuthenticate();
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
    const globalContext = useGlobalContext();

    const localLogout = () => {
        // Remove access token
        axiosInstance.defaults.headers.common.Authorization = '';
        // Remove all queries for security reasons
        queryClient.removeQueries();
        // Reset GlobalContext, for security reasons
        globalContext.resetState();
        // Set login status to logout
        globalContext.setIsLoggedIn(false);
        // Remove access tokens from local storage
        localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
        localStorage.removeItem(IMAGE_TOKEN_LOCAL_STORAGE_KEY);
    };

    const mutation = useMutation(() => AuthService.logout(), {
        retry: false,
        onSettled: () => {
            localLogout();
            history.replace('/');
        },
    });

    return {
        logout: mutation.mutate,
        logoutExpired: localLogout,
    };
}

/**
 * Provides read-only access for the login status
 */
export function useIsLoggedIn() {
    const { isLoggedIn } = useGlobalContext();
    return isLoggedIn;
}

export function useSearchStudentQuery(text: string, enabled: boolean = true) {
    return useQuery<User[]>(
        [SEARCH_STUDENT_QUERY_KEY, { text }],
        () => UsersService.searchStudent(text),
        { enabled },
    );
}

export function useSearchFacultyQuery(text: string, enabled: boolean = true) {
    return useQuery<User[]>(
        [SEARCH_FACULTY_QUERY_KEY, { text }],
        () => UsersService.searchFaculty(text),
        { enabled },
    );
}
