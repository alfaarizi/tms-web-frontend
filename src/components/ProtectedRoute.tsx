import React, { ReactNode } from 'react';
import { Route } from 'react-router';
import { useTranslation } from 'react-i18next';
import ErrorPage from 'pages/ErrorPage';

type Props = {
    path: string,
    enabled: boolean,
    children: ReactNode
}

export function ProtectedRoute({
    children,
    enabled,
    path,
}: Props) {
    const { t } = useTranslation();

    return (
        <Route path={path}>
            {enabled ? children : <ErrorPage title={t('errorPage.accessDenied')} />}
        </Route>
    );
}
