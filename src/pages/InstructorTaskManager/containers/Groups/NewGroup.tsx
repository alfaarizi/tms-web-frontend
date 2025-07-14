import { useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useCourses } from '@/hooks/instructor/CoursesHooks';
import { useCreateGroupMutation } from '@/hooks/instructor/GroupHooks';
import { GroupForm } from '@/pages/InstructorTaskManager/components/Groups/GroupForm';
import { Group } from '@/resources/instructor/Group';
import { StickyBreadcrumb } from '@/components/Header/StickyBreadcrumb';

export function NewGroup() {
    const history = useHistory();
    const { t } = useTranslation();
    const courses = useCourses(false, true, false);
    const createMutation = useCreateGroupMutation();
    const [addErrorBody, setAddErrorBody] = useState<ValidationErrorBody | null>(null);

    const handleSave = async (data: Group) => {
        try {
            const res = await createMutation.mutateAsync(data);
            history.push(`../groups/${res.id}`);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setAddErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push('/instructor/task-manager/groups');
    };

    return (
        <>
            <StickyBreadcrumb>
                <LinkContainer to="/instructor/task-manager">
                    <Breadcrumb.Item>{t('navbar.taskmanager')}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/instructor/task-manager/groups/new">
                    <Breadcrumb.Item active>{t('group.newGroup')}</Breadcrumb.Item>
                </LinkContainer>
            </StickyBreadcrumb>
            <GroupForm
                title={t('group.newGroup')}
                courses={courses.data}
                onSave={handleSave}
                onCancel={handleSaveCancel}
                serverSideError={addErrorBody}
                isLoading={createMutation.isLoading}
            />
        </>
    );
}
