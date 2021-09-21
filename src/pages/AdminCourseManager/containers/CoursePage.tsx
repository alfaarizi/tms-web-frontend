import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { CourseDetails } from 'pages/AdminCourseManager/components/CourseDetails';
import { useCourse, useUpdateCourseMutation } from 'hooks/admin/CoursesHooks';
import { LecturerList } from 'pages/AdminCourseManager/containers/LecturerList';
import { Course } from 'resources/common/Course';
import { CourseForm } from 'pages/AdminCourseManager/components/CourseForm';
import { useShow } from 'ui-hooks/useShow';

type Params = {
    id?: string
}

export function CoursePage() {
    const { t } = useTranslation();
    const params = useParams<Params>();
    const courseID = parseInt(params.id || '-1', 10);
    const course = useCourse(courseID);
    const showEdit = useShow();
    const updateMutation = useUpdateCourseMutation();

    useEffect(() => {
        showEdit.toHide();
    }, [courseID]);

    const handleEditSave = async (courseData: Course) => {
        try {
            await updateMutation.mutateAsync(courseData);
            showEdit.toHide();
        } catch (e) {
            // Already handled globally
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
