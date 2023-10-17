import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import { CourseForm } from 'pages/AdminCourseManager/components/CourseForm';
import { Course } from 'resources/common/Course';
import { useCreateCourseMutation } from 'hooks/admin/CoursesHooks';

export function NewCoursePage() {
    const { t } = useTranslation();
    const history = useHistory();
    const createMutation = useCreateCourseMutation();

    const handleSave = async (data: Course) => {
        try {
            const newCourse = await createMutation.mutateAsync(data);
            history.replace(`./${newCourse.id}`);
        } catch (e) {
            // Already handled globally
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
        />
    );
}
