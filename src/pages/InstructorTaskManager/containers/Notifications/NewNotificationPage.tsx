import { useState } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useGroup } from '@/hooks/instructor/GroupHooks';
import { useCreateNotificationMutation } from '@/hooks/instructor/NotificationsHooks';
import { NotificationForm } from '@/pages/InstructorTaskManager/components/Notifications/NotificationForm';
import { Notification } from '@/resources/instructor/Notification';
import { getUserTimezone } from '@/utils/getUserTimezone';
import { StickyBreadcrumb } from '@/components/Header/StickyBreadcrumb';

type Params = {
    groupID?: string
}

export function NewNotificationPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const groupID = parseInt(params.groupID || '-1', 10);
    const group = useGroup(groupID);
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
                    <LinkContainer to={`/instructor/task-manager/groups/${group.data.id}/new-notification`}>
                        <Breadcrumb.Item active>{t('notification.newNotification')}</Breadcrumb.Item>
                    </LinkContainer>
                </StickyBreadcrumb>
            ) : null}
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
        </>
    );
}
