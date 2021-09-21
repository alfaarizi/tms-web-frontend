import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { Group } from 'resources/instructor/Group';
import { useCreateGroupMutation } from 'hooks/instructor/GroupHooks';
import { GroupForm } from 'pages/InstructorTaskManager/components/Groups/GroupForm';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { useCourses } from 'hooks/instructor/CourseHooks';

export function NewGroup() {
    const history = useHistory();
    const { t } = useTranslation();
    const courses = useCourses(true, false);
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
        <GroupForm
            title={t('group.newGroup')}
            courses={courses.data}
            onSave={handleSave}
            onCancel={handleSaveCancel}
            serverSideError={addErrorBody}
        />
    );
}
