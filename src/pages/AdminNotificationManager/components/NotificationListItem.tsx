import { useTranslation } from 'react-i18next';
import { useRemoveNotificationMutation } from '@/hooks/admin/NotificationsHooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faXmark } from '@fortawesome/free-solid-svg-icons';

import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { Notification } from '@/resources/admin/Notification';
import { LocaleDateTime } from '@/components/LocaleDateTime';
import { DeleteToolbarButton } from '@/components/Buttons/DeleteToolbarButton';
import { ButtonGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { MarkdownRenderer } from '@/components/MarkdownRenderer/MarkdownRenderer';

type Props = {
    notification: Notification
}

export function NotificationListItem({ notification }: Props) {
    const { t } = useTranslation();
    const removeMutation = useRemoveNotificationMutation();

    // Remove notification
    const handleRemove = async (delNotification: Notification) => {
        try {
            await removeMutation.mutateAsync(delNotification);
        } catch (e) {
            // already handled globally
        }
    };

    return (
        <tr>
            <td>
                <MarkdownRenderer source={notification.message} />
            </td>
            <td>
                <LocaleDateTime value={notification.startTime} />
            </td>
            <td>
                <LocaleDateTime value={notification.endTime} />
            </td>
            <td>
                {t(`notification.scopes.${notification.scope}`)}
            </td>
            <td>
                {notification.dismissible
                    ? <FontAwesomeIcon icon={faCheck} />
                    : <FontAwesomeIcon icon={faXmark} />}
            </td>
            <td>
                <ButtonGroup className="mt-1">
                    <LinkContainer to={`edit-notification/${notification.id}`}>
                        <ToolbarButton text={t('common.edit')} displayTextBreakpoint="none" icon={faEdit} />
                    </LinkContainer>
                    <DeleteToolbarButton
                        displayTextBreakpoint="none"
                        onDelete={() => handleRemove(notification)}
                    />
                </ButtonGroup>
            </td>
        </tr>
    );
}
