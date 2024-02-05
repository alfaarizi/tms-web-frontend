import React from 'react';
import { Notification } from 'resources/common/Notification';
import { NotificationAlert } from './NotificationAlert';

type Props = {
    notifications: Notification[],
}

export function NotificationAlerts({
    notifications,
}: Props) {
    return (
        <>
            {notifications.map((notification) => (
                <NotificationAlert key={notification.id} notification={notification} />
            ))}
        </>
    );
}
