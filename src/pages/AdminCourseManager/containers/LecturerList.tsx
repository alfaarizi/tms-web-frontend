import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AddUserCard } from 'components/AddUsers/AddUserCard';
import { UserListCard } from 'components/UserListCard/UserListCard';
import {
    useAddLecturerMutation,
    useCourseLecturers,
    useDeleteLecturerMutation,
} from 'hooks/admin/CoursesHooks';
import { Course } from 'resources/common/Course';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { useSearchFacultyQuery } from 'hooks/common/UserHooks';

type Props = {
    course: Course
}

export function LecturerList({ course }: Props) {
    const { t } = useTranslation();
    const instructors = useCourseLecturers(course.id);
    const addMutation = useAddLecturerMutation(course.id);
    const deleteMutation = useDeleteLecturerMutation(course.id);
    const [userSearchText, setUserSearchText] = useState<string>('');
    const [userSearchQueryEnabled, setUserSearchQueryEnabled] = useState<boolean>(false);
    const facultySearchQuery = useSearchFacultyQuery(userSearchText, userSearchQueryEnabled);

    useEffect(() => {
        addMutation.reset();
    }, [course.id]);

    const handleAdd = (userCodes: string[]) => {
        addMutation.mutate(userCodes);
    };

    const handleDelete = (studentID: number) => {
        deleteMutation.mutate(studentID);
    };

    const handleSearch = (text: string) => {
        setUserSearchText(text);
        setUserSearchQueryEnabled(true);
    };

    if (!instructors.data) {
        return null;
    }

    return (
        <>
            <AddUserCard
                id="add-lecturers"
                title={t('course.addLecturers')}
                onAdd={handleAdd}
                data={addMutation.data}
                isLoading={addMutation.isLoading}
                onSearch={handleSearch}
                searchData={facultySearchQuery.data}
                isSearchLoading={facultySearchQuery.isLoading}
            />

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
