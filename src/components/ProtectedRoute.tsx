import React, { ReactNode } from 'react';
import { Route, RouteProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import ErrorPage from 'pages/ErrorPage';
import Login from 'pages/Login';
import { useIsLoggedIn } from 'hooks/common/UserHooks';

interface Props extends RouteProps {
    hasPermission?: boolean,
    children: ReactNode
}

/**
 * Requires login and check permissions for the given route
 * @param children content
 * @param hasPermission custom permission checks (optional)
 * @param rest react-router route properties
 * @constructor
 */
export function ProtectedRoute({
    children,
    hasPermission = true,
    ...rest
}: Props) {
    const { t } = useTranslation();
    const isLoggedIn = useIsLoggedIn();

    let content;
    if (!isLoggedIn) {
        content = <Login />;
    } else if (!hasPermission) {
        content = <ErrorPage title={t('errorPage.accessDenied')} />;
    } else {
        content = children;
    }

    return (
        <Route {...rest}>
            {content}
        </Route>
    );
}
