import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { CourseDetails } from 'pages/AdminCourseManager/components/CourseDetails';
import { useCourse, useUpdateCourseMutation } from 'hooks/admin/CoursesHooks';
import { LecturerList } from 'pages/AdminCourseManager/containers/LecturerList';
import { CourseForm } from 'pages/AdminCourseManager/components/CourseForm';
import { useShow } from 'ui-hooks/useShow';
import { CreateOrUpdateCourse } from 'resources/common/CreateOrUpdateCourse';
import { ServerSideValidationError, ValidationErrorBody } from '../../../exceptions/ServerSideValidationError';

type Params = {
    id?: string
}

export function CoursePage() {
    const { t } = useTranslation();
    const params = useParams<Params>();
    const courseID = parseInt(params.id || '-1', 10);
    const course = useCourse(courseID);
    const showEdit = useShow();
    const updateMutation = useUpdateCourseMutation(courseID);
    const [validationError, setValidationError] = useState<ValidationErrorBody | null>(null);

    useEffect(() => {
        showEdit.toHide();
    }, [courseID]);

    const handleEditSave = async (courseData: CreateOrUpdateCourse) => {
        try {
            setValidationError(null);
            await updateMutation.mutateAsync(courseData);
            showEdit.toHide();
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setValidationError(e.body);
            }
            // Other cases are already handled globally
        }
    };

    if (!course.data) {
        return null;
    }

    return (
        <>
            {showEdit.show
                ? (
                    <CourseForm
                        title={t('course.editCourse')}
                        onSave={handleEditSave}
                        onCancel={showEdit.toHide}
                        editData={course.data}
                        isLoading={updateMutation.isLoading}
                        serverSideErrors={validationError}
                    />
                )
                : (
                    <CourseDetails
                        course={course.data}
                        onEdit={showEdit.toShow}
                    />
                )}
            <LecturerList course={course.data} />
        </>
    );
}
