import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Container } from 'react-bootstrap';
import { Notification } from 'resources/admin/Notification';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { useCreateNotificationMutation } from 'hooks/admin/NotificationsHooks';
import { NotificationForm } from 'pages/AdminNotificationManager/components/NotificationForm';
import { getUserTimezone } from 'utils/getUserTimezone';

export function NewNotificationPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const createMutation = useCreateNotificationMutation();
    const [addErrorBody, setAddErrorBody] = useState<ValidationErrorBody | null>(null);

    const handleSave = async (notification: Notification) => {
        try {
            await createMutation.mutateAsync(notification);
            history.replace('/admin/notification-manager/notifications');
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setAddErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push('/admin/notification-manager/notifications');
    };

    return (
        <Container fluid={false} className="mt-3">
            <NotificationForm
                title={t('notification.newNotification')}
                onSave={handleSave}
                onCancel={handleSaveCancel}
                serverSideError={addErrorBody}
                timezone={getUserTimezone()}
                isLoading={createMutation.isLoading}
            />
        </Container>
    );
}
