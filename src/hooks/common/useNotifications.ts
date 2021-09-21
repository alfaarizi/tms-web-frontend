import { useAppContext } from 'context/AppContext';

export function useNotifications() {
    const appCtx = useAppContext();

    return {
        notification: appCtx.currentNotification,
        push: appCtx.setCurrentNotification,
        close: () => appCtx.setCurrentNotification(null),
    };
}
