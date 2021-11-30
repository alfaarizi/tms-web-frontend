import { useGlobalContext } from 'context/GlobalContext';

export function useNotifications() {
    const appCtx = useGlobalContext();

    return {
        notification: appCtx.currentNotification,
        push: appCtx.setCurrentNotification,
        close: () => appCtx.setCurrentNotification(null),
    };
}
