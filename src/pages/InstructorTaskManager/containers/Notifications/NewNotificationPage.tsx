import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Container } from 'react-bootstrap';
import { Notification } from 'resources/instructor/Notification';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { useCreateNotificationMutation } from 'hooks/instructor/NotificationsHooks';
import { NotificationForm } from 'pages/InstructorTaskManager/components/Notifications/NotificationForm';
import { getUserTimezone } from 'utils/getUserTimezone';
import { useParams } from 'react-router-dom';

type Params = {
    groupID?: string
}
export function NewNotificationPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const groupID = parseInt(params.groupID || '-1', 10);
    const createMutation = useCreateNotificationMutation();
    const [addErrorBody, setAddErrorBody] = useState<ValidationErrorBody | null>(null);

    const handleSave = async (notification: Notification) => {
        try {
            const result = await createMutation.mutateAsync({
                ...notification,
                groupID,
            });
            history.replace(`../${result.groupID}?tab=notifications`);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setAddErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push(`/instructor/task-manager/groups/${groupID}?tab=notifications`);
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
