import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { FullScreenSpinner } from 'components/FullScreenSpinner/FullScreenSpinner';
import { CanvasOauth2Response } from 'resources/instructor/CanvasOauth2Response';
import { useCanvasOauth2ResponseMutation } from 'hooks/instructor/CanvasHooks';
import { PROXY_AUTH_REDIRECT_LOCAL_STORAGE_KEY } from 'constants/localStorageKeys';

/**
 * Forwards Canvas OAuth2 response to backend, then redirects to the original page
 * @constructor
 */
export function CanvasOAuth2() {
    const location = useLocation();
    const history = useHistory();
    const queryParams = new URLSearchParams(location.search);
    const oauth2Mutation = useCanvasOauth2ResponseMutation();

    useEffect(() => {
        const canvasResponse: CanvasOauth2Response = {
            code: queryParams.get('code'),
            state: queryParams.get('state'),
            error: queryParams.get('error'),
        };
        oauth2Mutation.mutateAsync(canvasResponse).then(() => {
            const proxyAuthRedirect: string | null = localStorage.getItem(PROXY_AUTH_REDIRECT_LOCAL_STORAGE_KEY);
            if (proxyAuthRedirect !== null) {
                localStorage.removeItem(PROXY_AUTH_REDIRECT_LOCAL_STORAGE_KEY);
                history.replace(proxyAuthRedirect);
            } else {
                history.replace('/instructor/task-manager');
            }
        }).catch(() => {
            // Already handled globally
        });
    }, []);

    return <FullScreenSpinner />;
}
