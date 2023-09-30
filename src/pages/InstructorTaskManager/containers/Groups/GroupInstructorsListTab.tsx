import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';

import {
    useAddInstructorsMutation,
    useDeleteInstructorMutation,
    useGroupInstructors,
} from 'hooks/instructor/GroupHooks';
import { AddUserCard } from 'components/UserListCard/AddUserCard';
import { UserListCard } from 'components/UserListCard/UserListCard';
import { Group } from 'resources/instructor/Group';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { useCourses } from 'hooks/instructor/CourseHooks';

type Props = {
    group: Group
}

export function GroupInstructorsListTab({ group }: Props) {
    const { t } = useTranslation();
    const instructors = useGroupInstructors(group.id);
    const addMutation = useAddInstructorsMutation(group.id);
    const deleteMutation = useDeleteInstructorMutation(group.id);
    const actualSemester = useActualSemester();
    const courses = useCourses(true, false);
    const isLecturer = courses.data ? courses.data.some((c) => c.id === group.course.id) : false;

    useEffect(() => {
        addMutation.reset();
    }, [group.id]);

    const handleAdd = (neptunCodes: string[]) => {
        addMutation.mutate(neptunCodes);
    };

    const handleDelete = (studentID: number) => {
        deleteMutation.mutate(studentID);
    };

    if (!instructors.data || !courses.data) {
        return null;
    }

    return (
        <>
            {actualSemester.check(group.semesterID) && isLecturer
                ? <AddUserCard title={t('group.addInstructors')} onAdd={handleAdd} data={addMutation.data} />
                : null}

            <UserListCard
                title={t('common.instructors')}
                users={instructors.data}
                renderUserButtons={(user) => (
                    <>
                        {actualSemester.check(group.semesterID) && isLecturer
                            ? (
                                <DeleteToolbarButton
                                    displayTextBreakpoint="none"
                                    onDelete={() => handleDelete(user.id)}
                                />
                            )
                            : null}
                    </>
                )}
            />
        </>
    );
}
