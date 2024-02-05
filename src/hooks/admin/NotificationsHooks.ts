import { useMutation, useQuery, useQueryClient } from 'react-query';

import * as NotificationsService from 'api/admin/NotificationsService';
import { Notification } from 'resources/admin/Notification';

export const QUERY_KEY = 'admin/notifications';
export const COMMON_QUERY_KEY = 'common/notifications';

export function useNotification(notificationID: number) {
    return useQuery([QUERY_KEY, { notificationID }], () => NotificationsService.view(notificationID));
}

export function useNotifications() {
    return useQuery([QUERY_KEY], () => NotificationsService.index());
}

export function useCreateNotificationMutation() {
    const queryClient = useQueryClient();

    return useMutation((uploadData: Notification) => NotificationsService.create(uploadData), {
        onSuccess: async (data) => {
            const oldNotifications = queryClient.getQueryData<Notification[]>(QUERY_KEY);
            if (oldNotifications) {
                queryClient.setQueryData(QUERY_KEY, [...oldNotifications, data]);
            }

            await queryClient.invalidateQueries([COMMON_QUERY_KEY]);
        },
    });
}

export function useUpdateNotificationMutation() {
    const queryClient = useQueryClient();

    return useMutation((uploadData: Notification) => NotificationsService.update(uploadData), {
        onSuccess: async (data) => {
            // Update notification info with the returned data
            const key = [QUERY_KEY, { notificationID: data.id }];
            const oldNotification = queryClient.getQueryData<Notification[]>(key);
            if (oldNotification) {
                queryClient.setQueryData(key, data);
            }

            // Update notification list with the returned data
            const oldNotifications = queryClient.getQueryData<Notification[]>(QUERY_KEY);

            if (oldNotifications) {
                const newList = oldNotifications.map(
                    (notification) => (notification.id === data.id ? data : notification),
                );
                queryClient.setQueryData(QUERY_KEY, newList);
            }

            await queryClient.invalidateQueries([COMMON_QUERY_KEY]);
        },
    });
}

export function useRemoveNotificationMutation() {
    const queryClient = useQueryClient();

    return useMutation((notification: Notification) => NotificationsService.remove(notification.id), {
        onSuccess: async (_data, variable) => {
            const key = [QUERY_KEY];
            const oldNotifications = queryClient.getQueryData<Notification[]>(key);

            if (oldNotifications) {
                queryClient.setQueryData(key, oldNotifications.filter(
                    (notification) => notification.id !== variable.id,
                ));
            }

            await queryClient.invalidateQueries([COMMON_QUERY_KEY]);
        },
    });
}
