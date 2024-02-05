import { useMutation, useQuery, useQueryClient } from 'react-query';

import * as NotificationsService from 'api/common/NotificationsService';
import { Notification } from 'resources/common/Notification';

export const QUERY_KEY = 'common/notifications';

export function useNotifications() {
    return useQuery([QUERY_KEY], () => NotificationsService.index());
}

export function useDismissNotificationMutation() {
    const queryClient = useQueryClient();

    return useMutation((notification: Notification) => NotificationsService.dismiss(notification), {
        onSuccess: async (data) => {
            const oldNotifications = queryClient.getQueryData<Notification[]>(QUERY_KEY);

            if (oldNotifications) {
                queryClient.setQueryData(QUERY_KEY, oldNotifications.filter(
                    (notification) => notification.id !== data.id,
                ));
            }
        },
    });
}
