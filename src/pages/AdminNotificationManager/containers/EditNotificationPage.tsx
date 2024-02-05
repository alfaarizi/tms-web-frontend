import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { Container } from 'react-bootstrap';
import { Notification } from 'resources/admin/Notification';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { useNotification, useUpdateNotificationMutation } from 'hooks/admin/NotificationsHooks';
import { NotificationForm } from 'pages/AdminNotificationManager/components/NotificationForm';
import { getUserTimezone } from 'utils/getUserTimezone';

type Params = {
    notificationID: string
}
export function EditNotificationPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const notification = useNotification(parseInt(params.notificationID, 10));
    const updateMutation = useUpdateNotificationMutation();
    const [editErrorBody, setEditErrorBody] = useState<ValidationErrorBody | null>(null);

    // Saves notification data after edit
    const handleEditSave = async (notificationData: Notification) => {
        try {
            await updateMutation.mutateAsync(notificationData);
            history.replace('/admin/notification-manager/notifications');
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setEditErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push('/admin/notification-manager/notifications');
    };

    if (!notification.data) {
        return null;
    }

    return (
        <Container fluid={false} className="mt-3">
            <NotificationForm
                title={t('notification.editNotification')}
                editData={notification.data}
                onSave={handleEditSave}
                onCancel={handleSaveCancel}
                serverSideError={editErrorBody}
                timezone={getUserTimezone()}
                isLoading={updateMutation.isLoading}
            />
        </Container>
    );
}
