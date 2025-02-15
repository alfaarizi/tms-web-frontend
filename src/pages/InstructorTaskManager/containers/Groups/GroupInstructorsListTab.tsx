import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import {
    useAddInstructorsMutation,
    useDeleteInstructorMutation,
    useGroupInstructors,
} from '@/hooks/instructor/GroupHooks';
import { AddUserCard } from '@/components/AddUsers/AddUserCard';
import { UserListCard } from '@/components/UserListCard/UserListCard';
import { Group } from '@/resources/instructor/Group';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { DeleteToolbarButton } from '@/components/Buttons/DeleteToolbarButton';
import { useCourses } from '@/hooks/instructor/CoursesHooks';
import { useSearchFacultyQuery, useUserSettings } from '@/hooks/common/UserHooks';

type Props = {
    group: Group
}

export function GroupInstructorsListTab({ group }: Props) {
    const { t } = useTranslation();
    const instructors = useGroupInstructors(group.id);
    const addMutation = useAddInstructorsMutation(group.id);
    const deleteMutation = useDeleteInstructorMutation(group.id);
    const [userSearchText, setUserSearchText] = useState<string>('');
    const [userSearchQueryEnabled, setUserSearchQueryEnabled] = useState<boolean>(false);
    const facultySearchQuery = useSearchFacultyQuery(userSearchText, userSearchQueryEnabled);
    const userSettings = useUserSettings();
    const actualSemester = useActualSemester();
    const courses = useCourses(false, true, false);
    const isLecturer = courses.data ? courses.data.some((c) => c.id === group.course.id) : false;
    const isAdmin = userSettings.data?.isAdmin;

    useEffect(() => {
        addMutation.reset();
    }, [group.id]);

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

    if (!instructors.data || !courses.data) {
        return null;
    }

    return (
        <>
            {actualSemester.check(group.semesterID) && (isLecturer || isAdmin)
                ? (
                    <AddUserCard
                        id="add-instructors"
                        title={t('group.addInstructors')}
                        onAdd={handleAdd}
                        data={addMutation.data}
                        isLoading={addMutation.isLoading}
                        onSearch={handleSearch}
                        searchData={facultySearchQuery.data}
                        isSearchLoading={facultySearchQuery.isLoading}
                    />
                )
                : null}

            <UserListCard
                title={t('common.instructors')}
                users={instructors.data}
                renderUserButtons={(user) => (
                    <>
                        {actualSemester.check(group.semesterID) && (isLecturer || isAdmin)
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
