import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { useNotifications } from 'hooks/admin/NotificationsHooks';
import { NotificationList } from 'pages/AdminNotificationManager/components/NotificationList';
import { NewNotificationPage } from 'pages/AdminNotificationManager/containers/NewNotificationPage';
import { EditNotificationPage } from 'pages/AdminNotificationManager/containers/EditNotificationPage';

export function NotificationManagerPage() {
    const notifications = useNotifications();
    const { url } = useRouteMatch();

    return (
        <>
            <Switch>
                <Route path={`${url}/notifications`}>
                    <NotificationList notifications={notifications.data} />
                </Route>
                <Route path={`${url}/new-notification`} exact>
                    <NewNotificationPage />
                </Route>
                <Route path={`${url}/edit-notification/:notificationID`} exact>
                    <EditNotificationPage />
                </Route>
            </Switch>
        </>
    );
}
