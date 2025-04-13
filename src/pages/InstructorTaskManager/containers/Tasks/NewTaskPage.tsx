import { useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { usePrivateSystemInfoQuery } from '@/hooks/common/SystemHooks';
import { useGroup } from '@/hooks/instructor/GroupHooks';
import { useCreateTaskMutation } from '@/hooks/instructor/TaskHooks';
import { TaskForm } from '@/pages/InstructorTaskManager/components/Tasks/TaskForm';
import { Task } from '@/resources/instructor/Task';

type Params = {
    groupID?: string
}

export function NewTaskPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const groupID = parseInt(params.groupID || '-1', 10);
    const group = useGroup(groupID);
    const createMutation = useCreateTaskMutation();
    const privateSystemInfo = usePrivateSystemInfoQuery();
    const [addErrorBody, setAddErrorBody] = useState<ValidationErrorBody | null>(null);

    const handleSave = async (task: Task) => {
        try {
            const result = await createMutation.mutateAsync({
                ...task,
                groupID,
            });
            history.replace(`../${result.groupID}`);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setAddErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push(`/instructor/task-manager/groups/${groupID}`);
    };

    if (!privateSystemInfo.data || !group.data) {
        return null;
    }

    return (
        <>
            <Breadcrumb>
                <LinkContainer to="/instructor/task-manager">
                    <Breadcrumb.Item>{t('navbar.taskmanager')}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`/instructor/course-manager/courses/${group.data.courseID}`}>
                    <Breadcrumb.Item>{group.data.course.name}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`/instructor/task-manager/groups/${group.data.id}`}>
                    <Breadcrumb.Item>{group.data.id}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`/instructor/task-manager/groups/${group.data.id}/new-task`}>
                    <Breadcrumb.Item active>{t('task.newTask')}</Breadcrumb.Item>
                </LinkContainer>
            </Breadcrumb>
            <TaskForm
                title={t('task.newTask')}
                onSave={handleSave}
                onCancel={handleSaveCancel}
                showVersionControl={!!privateSystemInfo.data && privateSystemInfo.data.isVersionControlEnabled}
                serverSideError={addErrorBody}
                timezone={group.data.timezone}
                isLoading={createMutation.isLoading}
            />
        </>
    );
}
