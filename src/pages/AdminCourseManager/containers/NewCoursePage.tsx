import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import { CourseForm } from 'pages/AdminCourseManager/components/CourseForm';
import { useCreateCourseMutation } from 'hooks/admin/CoursesHooks';
import { CreateOrUpdateCourse } from 'resources/common/CreateOrUpdateCourse';
import { ServerSideValidationError, ValidationErrorBody } from '../../../exceptions/ServerSideValidationError';

export function NewCoursePage() {
    const { t } = useTranslation();
    const history = useHistory();
    const createMutation = useCreateCourseMutation();
    const [validationError, setValidationError] = useState<ValidationErrorBody | null>(null);

    const handleSave = async (data: CreateOrUpdateCourse) => {
        try {
            setValidationError(null);
            const newCourse = await createMutation.mutateAsync(data);
            history.replace(`./${newCourse.id}`);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setValidationError(e.body);
            }
            // Other cases are already handled globally
        }
    };

    const handleCancel = () => {
        history.push('./');
    };

    return (
        <CourseForm
            onSave={handleSave}
            onCancel={handleCancel}
            title={t('course.newCourse')}
            isLoading={createMutation.isLoading}
            serverSideErrors={validationError}
        />
    );
}
