import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { AddUserCard } from 'components/UserListCard/AddUserCard';
import { UserListCard } from 'components/UserListCard/UserListCard';
import {
    useAddLecturerMutation,
    useCourseLecturers,
    useDeleteLecturerMutation,
} from 'hooks/admin/CoursesHooks';
import { Course } from 'resources/common/Course';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';

type Props = {
    course: Course
}

export function LecturerList({ course }: Props) {
    const { t } = useTranslation();
    const instructors = useCourseLecturers(course.id);
    const addMutation = useAddLecturerMutation(course.id);
    const deleteMutation = useDeleteLecturerMutation(course.id);

    useEffect(() => {
        addMutation.reset();
    }, [course.id]);

    const handleAdd = (neptunCodes: string[]) => {
        addMutation.mutate(neptunCodes);
    };

    const handleDelete = (studentID: number) => {
        deleteMutation.mutate(studentID);
    };

    if (!instructors.data) {
        return null;
    }

    return (
        <>
            <AddUserCard title={t('course.addLecturers')} onAdd={handleAdd} data={addMutation.data} />

            <UserListCard
                title={t('course.lecturers')}
                users={instructors.data}
                renderUserButtons={(user) => (
                    <DeleteToolbarButton
                        displayTextBreakpoint="none"
                        onDelete={() => handleDelete(user.id)}
                    />
                )}
            />
        </>
    );
}
