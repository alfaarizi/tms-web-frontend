import { useTranslation } from 'react-i18next';
import {
    MutationFunction, useMutation, useQuery, useQueryClient,
} from 'react-query';

import * as AuthService from 'api/common/AuthService';
import * as UserSettingsService from 'api/common/UserSettingsService';
import { MockLogin } from 'resources/common/MockLogin';
import { axiosInstance } from 'api/axiosInstance';
import { LoginResponse } from 'resources/common/LoginResponse';
import { LdapLogin } from 'resources/common/LdapLogin';
import { useHistory } from 'react-router';
import { useGlobalContext } from 'context/GlobalContext';
import { UserSettings } from 'resources/common/UserSettings';
import { usePrivateSystemInfoQuery, PRIVATE_INFO_QUERY_KEY } from 'hooks/common/SystemHooks';

export const USER_SETTINGS_QUERY_KEY = 'usersettings';

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
    const clientSideLocale = useClientSideLocaleChange();

    return useQuery<UserSettings>(USER_SETTINGS_QUERY_KEY, () => UserSettingsService.getSettings(), {
        enabled,
        onSuccess: async (data) => {
            if (!data) {
                return;
            }

            // Update language based on user settings
            await clientSideLocale.mutateAsync(data.locale);
        },
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
 * Generic login mutation. Other login methods should use this hook with their own TLoginData type and mutationFn.
 * @param mutationFn
 */
export function useBaseLoginMutation<TLoginData>(mutationFn: MutationFunction<LoginResponse, TLoginData>) {
    const userSettings = useUserSettings(false);
    const privateSystemInfo = usePrivateSystemInfoQuery(false);
    const globalContext = useGlobalContext();

    return useMutation(mutationFn, {
        retry: false,
        onSuccess: async (data: LoginResponse) => {
            // Save token to localStorage
            localStorage.setItem('accessToken', data.accessToken);
            // Set token in axiosInstance
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
            // Set image token in local storage
            localStorage.setItem('imageToken', data.imageToken);
            // Load the settings of the current user
            await userSettings.refetch();
            const privateInfoData = await privateSystemInfo.refetch();

            // Set selected semester to actual semester, if it is null
            if (privateInfoData.data && globalContext.selectedSemester === null) {
                globalContext.setSelectedSemester(privateInfoData.data.actualSemester);
            }
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
        // Remove all queries expect user settings, for security reasons
        queryClient.removeQueries({
            predicate: (query) => query.queryKey !== USER_SETTINGS_QUERY_KEY,
        });
        // Reset GlobalContext, for security reasons
        globalContext.resetState();
        // Reset localStorage, this also clears accessTokens
        localStorage.clear();
        // Delete user settings and private info from cache
        queryClient.setQueryData(USER_SETTINGS_QUERY_KEY, null);
        queryClient.setQueryData(PRIVATE_INFO_QUERY_KEY, null);
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
