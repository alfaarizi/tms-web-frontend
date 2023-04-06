import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouteMatch } from 'react-router';

import { useDeleteStudentMutation, useAddStudentsMutation, useGroupStudents } from 'hooks/instructor/GroupHooks';

import { AddUserCard } from 'components/UserListCard/AddUserCard';
import { UserListCard } from 'components/UserListCard/UserListCard';
import { Group } from 'resources/instructor/Group';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { StudentNotesContainer } from 'pages/InstructorTaskManager/containers/Groups/StudentNotesContainer';

type Props = {
    group: Group
}

export function GroupStudentsListTab({ group }: Props) {
    const { t } = useTranslation();
    const students = useGroupStudents(group.id);
    const addMutation = useAddStudentsMutation(group.id);
    const deleteMutation = useDeleteStudentMutation(group.id);
    const actualSemester = useActualSemester();
    const { url } = useRouteMatch();

    useEffect(() => {
        addMutation.reset();
    }, [group.id]);

    const handleAdd = (neptunCodes: string[]) => {
        addMutation.mutate(neptunCodes);
    };

    const handleDelete = (studentID: number) => {
        deleteMutation.mutate(studentID);
    };

    if (!students.data) {
        return null;
    }

    return (
        <>
            {actualSemester.check(group.semesterID) && !group.isCanvasCourse
                ? <AddUserCard title={t('group.addStudents')} onAdd={handleAdd} data={addMutation.data} />
                : null}

            <UserListCard
                title={t('common.students')}
                users={students.data}
                renderUserButtons={(user) => (
                    <>
                        <LinkContainer to={`${url}/students/${user.id}`}>
                            <ToolbarButton
                                icon={faUser}
                                text={t('group.studentSolutions')}
                                displayTextBreakpoint="none"
                            />
                        </LinkContainer>
                        <StudentNotesContainer
                            groupId={group.id}
                            student={user}
                            studentId={user.id}
                            isActualSemester={actualSemester.check(group.semesterID)}
                            displayTextBreakpoint="none"
                        />
                        {actualSemester.check(group.semesterID) && !group.isCanvasCourse
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
