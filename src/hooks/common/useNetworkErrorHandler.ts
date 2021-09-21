import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { axiosInstance } from 'api/axiosInstance';
import { AxiosError } from 'axios';

import { useNotifications } from 'hooks/common/useNotifications';
import { ServerSideValidationError } from 'exceptions/ServerSideValidationError';
import { useLogoutMutation } from 'hooks/common/UserHooks';

/**
 * Global error handler. Displays notifications about network errors and handle specific status codes.
 */
export function useNetworkErrorHandler() {
    const { push } = useNotifications();
    const logoutMutation = useLogoutMutation();
    const location = useLocation();

    const errorHandler = (error: AxiosError) => {
        if (error.response?.status === 422) {
            const validationError = new ServerSideValidationError(
                'Serverside validation Failed',
                error.response.data,
            );
            return Promise.reject(validationError);
        }

        if (error.response?.status === 401) {
            // Status code 401 may indicate that authentication is required for an external service used by the backend
            if (error.response.headers['proxy-authenticate']) {
                // Save the current location to localStorage.
                // So, the application can redirect the user to the original location after successful login.
                localStorage.setItem('proxyAuthRedirect', location.pathname);

                // Get redirectURI (or other instructions) from the response headers
                const redirectTo: string = error.response.headers['proxy-authenticate'];
                // Redirects to the given login page
                window.open(redirectTo, '_self');
            } else {
                logoutMutation.logoutExpired();
            }
        } else if (error.response?.data.message) {
            // If the error has a formatted json body with a detailed error message, then display the message
            push({
                variant: 'error',
                message: error.response.data.message,
            });
        } else {
            // If it an error without a formatted json body
            // then display the generic error message for the given status
            push({
                variant: 'error',
                message: error.message,
            });
        }

        // Send the error forward, sometimes we want to use it in react-query
        return Promise.reject(error);
    };

    useEffect(() => {
        // Register new the error handler
        const res = axiosInstance.interceptors.response.use((data) => data, errorHandler);

        // Cleanup
        return () => {
            axiosInstance.interceptors.response.eject(res);
        };
    }, [location]);
}
