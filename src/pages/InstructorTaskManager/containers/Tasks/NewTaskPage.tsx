import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';

import { TaskForm } from 'pages/InstructorTaskManager/components/Tasks/TaskForm';
import { Task } from 'resources/instructor/Task';
import { useCreateTaskMutation } from 'hooks/instructor/TaskHooks';
import { useUserInfo } from 'hooks/common/UserHooks';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';

type Params = {
    groupID?: string
}

export function NewTaskPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const groupID = parseInt(params.groupID || '-1', 10);
    const createMutation = useCreateTaskMutation();
    const userInfo = useUserInfo();
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

    return (
        <TaskForm
            title={t('task.newTask')}
            onSave={handleSave}
            onCancel={handleSaveCancel}
            showVersionControl={!!userInfo.data && userInfo.data.isVersionControlEnabled}
            serverSideError={addErrorBody}
        />
    );
}
