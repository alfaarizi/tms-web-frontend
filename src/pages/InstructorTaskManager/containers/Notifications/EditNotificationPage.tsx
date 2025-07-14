import { useState } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useGroup } from '@/hooks/instructor/GroupHooks';
import { useNotification, useUpdateNotificationMutation } from '@/hooks/instructor/NotificationsHooks';
import { NotificationForm } from '@/pages/InstructorTaskManager/components/Notifications/NotificationForm';
import { Notification } from '@/resources/instructor/Notification';
import { getUserTimezone } from '@/utils/getUserTimezone';
import { StickyBreadcrumb } from '@/components/Header/StickyBreadcrumb';

type Params = {
    notificationID: string,
    groupID?: string
}

export function EditNotificationPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const groupID = parseInt(params.groupID || '-1', 10);
    const group = useGroup(groupID);
    const notification = useNotification(parseInt(params.notificationID, 10));
    const updateMutation = useUpdateNotificationMutation();
    const [editErrorBody, setEditErrorBody] = useState<ValidationErrorBody | null>(null);

    // Saves notification data after edit
    const handleEditSave = async (notificationData: Notification) => {
        try {
            const result = await updateMutation.mutateAsync(notificationData);
            history.replace(`../../${result.groupID}?tab=notifications`);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setEditErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push(`/instructor/task-manager/groups/${groupID}?tab=notifications`);
    };

    if (!notification.data) {
        return null;
    }

    return (
        <>
            {group.data ? (
                <StickyBreadcrumb>
                    <LinkContainer to="/instructor/task-manager">
                        <Breadcrumb.Item>{t('navbar.taskmanager')}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/course-manager/courses/${group.data.courseID}`}>
                        <Breadcrumb.Item>{group.data.course.name}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/task-manager/groups/${group.data.id}?tab=notifications`}>
                        <Breadcrumb.Item>
                            {t('common.group')}
                            {' #'}
                            {group.data.number}
                        </Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer
                        to={`/instructor/task-manager/groups/${group.data.id}
                            /edit-notification/${notification.data.id}`}
                    >
                        <Breadcrumb.Item active>{t('notification.editNotification')}</Breadcrumb.Item>
                    </LinkContainer>
                </StickyBreadcrumb>
            ) : null}
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
        </>
    );
}
