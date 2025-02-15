import { TFunction } from 'react-i18next';
import { Notification } from '@/resources/common/Notification';

export function getClockDifferenceNotification(diff: number, t: TFunction<'translation'>): Notification {
    return {
        id: -1,
        message: t('errorPage.serverTimeDiff', { diff }),
        dismissible: false,
        isGroupNotification: false,
    };
}
