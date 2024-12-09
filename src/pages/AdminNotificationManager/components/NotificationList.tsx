import React from 'react';
import { useTranslation } from 'react-i18next';

import { Notification } from 'resources/admin/Notification';
import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { NotificationListItem } from 'pages/AdminNotificationManager/components/NotificationListItem';
import { ButtonGroup, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';

type Props = {
    notifications?: Notification[],
}

export function NotificationList({
    notifications,
}: Props) {
    const { t } = useTranslation();

    return (
        <SingleColumnLayout>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('common.notifications')}</CustomCardTitle>
                    <ButtonGroup className="mt-2">
                        <LinkContainer to="new-notification">
                            <ToolbarButton
                                icon={faPlus}
                                text={t('notification.newNotification')}
                                displayTextBreakpoint="xs"
                            />
                        </LinkContainer>
                    </ButtonGroup>
                </CustomCardHeader>
                <Table responsive>
                    <thead>
                        <tr>
                            <th style={{ borderTop: 'none' }}>{t('notification.message')}</th>
                            <th style={{ borderTop: 'none' }}>{t('notification.startTime')}</th>
                            <th style={{ borderTop: 'none' }}>{t('notification.endTime')}</th>
                            <th style={{ borderTop: 'none' }}>{t('notification.scope')}</th>
                            <th style={{ borderTop: 'none' }}>{t('notification.dismissable')}</th>
                            <th style={{ borderTop: 'none' }}>{t('common.operations')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications?.map(
                            (notification) => (
                                <NotificationListItem key={notification.id} notification={notification} />
                            ),
                        )}
                    </tbody>
                </Table>
            </CustomCard>
        </SingleColumnLayout>
    );
}
