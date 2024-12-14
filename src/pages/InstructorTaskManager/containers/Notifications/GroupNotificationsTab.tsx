import React from 'react';
import { useNotifications } from 'hooks/instructor/NotificationsHooks';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Table } from 'react-bootstrap';

import { Group } from 'resources/instructor/Group';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { NotificationListItem } from 'pages/InstructorTaskManager/components/Notifications/NotificationListItem';
import { useRouteMatch } from 'react-router';

type Props = {
    group: Group
}

/**
 * Displays notification list for the given group
 * @param group
 * @constructor
 */
export function GroupNotificationsTab({ group }: Props) {
    const { t } = useTranslation();
    const { url } = useRouteMatch();
    const notifications = useNotifications(group.id);

    if (!notifications.data) {
        return null;
    }

    // Render
    return (
        <>
            <ButtonGroup className="mt-2">
                <LinkContainer to={`${url}/new-notification`}>
                    <ToolbarButton
                        icon={faPlus}
                        text={t('notification.newNotification')}
                        displayTextBreakpoint="xs"
                    />
                </LinkContainer>
            </ButtonGroup>
            <CustomCard>
                <Table responsive>
                    <thead>
                        <tr>
                            <th style={{ borderTop: 'none' }}>{t('notification.message')}</th>
                            <th style={{ borderTop: 'none' }}>{t('notification.startTime')}</th>
                            <th style={{ borderTop: 'none' }}>{t('notification.endTime')}</th>
                            <th style={{ borderTop: 'none' }}>{t('notification.dismissible')}</th>
                            <th style={{ borderTop: 'none' }}>{t('common.operations')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(notifications.data)?.map(
                            (notification) => (
                                <NotificationListItem key={notification.id} notification={notification} />
                            ),
                        )}
                    </tbody>
                </Table>
            </CustomCard>
        </>
    );
}
