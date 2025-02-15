import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { Notification } from '@/resources/common/Notification';
import { Alert } from 'react-bootstrap';
import { useGlobalContext } from '@/context/GlobalContext';
import { useDismissNotificationMutation } from '@/hooks/common/NotificationsHooks';
import { MarkdownRenderer } from '@/components/MarkdownRenderer/MarkdownRenderer';
import { DISMISSED_NOTIFICATIONS_LOCAL_STORAGE_KEY } from '@/constants/localStorageKeys';

type Props = {
    notification: Notification
}

export function NotificationAlert({ notification }: Props) {
    const [show, setShow] = useState(true);
    const { isLoggedIn } = useGlobalContext();
    const [localDismissed, setLocalDismissed] = useState(localStorage
        .getItem(DISMISSED_NOTIFICATIONS_LOCAL_STORAGE_KEY));
    const dismissMutation = useDismissNotificationMutation();

    useEffect(() => {
        if (localDismissed) {
            const localDismissedArray = JSON.parse(localDismissed || '[]');
            if (localDismissedArray.includes(notification.id.toString()) && notification.dismissible) {
                setShow(false);
            }
        }
    }, [localDismissed]);

    useEffect(() => {
        if (localDismissed && isLoggedIn) {
            const localDismissedArray = JSON.parse(localDismissed || '[]');
            if (localDismissedArray.includes(notification.id.toString()) && notification.dismissible) {
                dismissMutation.mutate(notification);
            }
        }
    }, [isLoggedIn]);

    const handleDismiss = () => {
        if (notification.dismissible) {
            const localDismissedArray = JSON.parse(localDismissed || '[]');
            localDismissedArray.push(notification.id.toString());
            localStorage.setItem(DISMISSED_NOTIFICATIONS_LOCAL_STORAGE_KEY, JSON.stringify(localDismissedArray));
            // document.cookie = `notifications=${cookieNotificationsArray.join(',')};path=/`;
            setLocalDismissed(JSON.stringify(localDismissedArray));
            if (isLoggedIn) {
                dismissMutation.mutate(notification);
            } else {
                setShow(false);
            }
        }
    };

    if (show) {
        return (
            <Alert
                variant={notification.isGroupNotification ? 'info' : 'warning'}
                className="m-0 p-1 d-flex align-items-center"
                onClose={() => handleDismiss()}
                dismissible={notification.dismissible}
                style={{ zIndex: 999 }}
            >
                <FontAwesomeIcon icon={faBullhorn} size="xl" />
                <MarkdownRenderer source={notification.message} />
            </Alert>
        );
    }
    return null;
}
