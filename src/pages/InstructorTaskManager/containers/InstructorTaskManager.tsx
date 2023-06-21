import React, { useEffect, useMemo, useState } from 'react';
import {
    Route, Switch, useHistory, useRouteMatch,
} from 'react-router';
import { faPlus, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { TaskDetailsPage } from 'pages/InstructorTaskManager/containers/Tasks/TaskDetailsPage';
import { NewTaskPage } from 'pages/InstructorTaskManager/containers/Tasks/NewTaskPage';
import { StudentDetailsPage } from 'pages/InstructorTaskManager/containers/Students/StudentDetailsPage';
import { useGroups } from 'hooks/instructor/GroupHooks';
import { SideBarItem } from 'components/Navigation/SideBarItem';
import { NewGroup } from 'pages/InstructorTaskManager/containers/Groups/NewGroup';
import { SideBarLayout } from 'layouts/SideBarLayout';
import { GroupPage } from 'pages/InstructorTaskManager/containers/Groups/GroupPage';
import { useActualSemester, useSelectedSemester } from 'hooks/common/SemesterHooks';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { CanvasOAuth2 } from 'pages/InstructorTaskManager/containers/CanvasOAuth2';
import { StudentFilePage } from 'pages/InstructorTaskManager/containers/StudentFiles/StudentFilePage';
import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { useUserSettings } from 'hooks/common/UserHooks';
import { Group } from 'resources/instructor/Group';

 enum GroupView {
    ALL = 'all',
    INSTRUCTOR = 'instructor'
}
export function InstructorTaskManager() {
    const { selectedSemesterID } = useSelectedSemester();
    const actualSemester = useActualSemester();
    const userSettings = useUserSettings();
    const groups = useGroups(selectedSemesterID);
    const history = useHistory();
    const { url } = useRouteMatch();
    const { t } = useTranslation();

    const [groupView, setGroupView] = useState<GroupView>(GroupView.ALL);

    useEffect(() => {
        const value = localStorage.getItem('instructorGroupView');

        // Check if the loaded value is a valid view
        switch (value) {
        case GroupView.ALL:
        case GroupView.INSTRUCTOR:
            // If it is valid set the new view
            setGroupView(value);
            break;
        default:
            break;
        }
    }, []);

    const handleNewGroupOpen = () => {
        history.push(`${url}/groups/new`);
    };

    /**
     * Sets the new group view and saves it to local storage
     * @param newGroupView
     */
    const handleGroupTypeChange = (newGroupView: GroupView) => {
        setGroupView(newGroupView);
        localStorage.setItem('instructorGroupView', newGroupView);
    };

    const filteredGroups = useMemo(() => {
        if (groupView === GroupView.INSTRUCTOR) {
            return groups.data?.filter((group: Group) => {
                if (group.instructors && userSettings.data) {
                    return group.instructors.some((instructor) => instructor.neptun === userSettings.data.neptun);
                }
                return false;
            });
        }
        return groups.data;
    }, [groups.data, groupView]);

    return (
        <SideBarLayout
            sidebarTitle={t('common.groups')}
            sidebarItems={
                filteredGroups?.map((group) => (
                    <SideBarItem
                        key={group.id}
                        title={group.course.name}
                        to={`${url}/groups/${group.id}`}
                    >
                        <p>
                            {t('group.number')}
                            :
                            {' '}
                            {group.number}
                        </p>
                    </SideBarItem>
                )) || []
            }
            sidebarButtons={
                actualSemester.check(selectedSemesterID)
                    ? (
                        <>
                            <ToolbarButton
                                className="float-right"
                                icon={faPlus}
                                text={t('common.add')}
                                onClick={handleNewGroupOpen}
                                displayTextBreakpoint="xs"
                            />
                            <ToolbarDropdown
                                text={t('common.groupView')}
                                displayTextBreakpoint="xs"
                                icon={groupView === GroupView.ALL ? faUserGroup : faUser}
                            >
                                <DropdownItem
                                    onSelect={() => handleGroupTypeChange(GroupView.ALL)}
                                    active={groupView === GroupView.ALL}
                                >
                                    <FontAwesomeIcon icon={faUserGroup} />
                                    {' '}
                                    {t('common.all')}
                                </DropdownItem>
                                <DropdownItem
                                    onSelect={() => handleGroupTypeChange(GroupView.INSTRUCTOR)}
                                    active={groupView === GroupView.INSTRUCTOR}
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    {' '}
                                    {t('common.asInstructor')}
                                </DropdownItem>
                            </ToolbarDropdown>
                        </>
                    )
                    : null
            }
            mainContent={(
                <Switch>
                    <Route path={`${url}/canvas/oauth2-response`}>
                        <CanvasOAuth2 />
                    </Route>
                    <Route path={`${url}/groups/new`} exact>
                        <NewGroup />
                    </Route>
                    <Route path={`${url}/groups/:groupID/new-task`}>
                        <NewTaskPage />
                    </Route>
                    <Route path={`${url}/groups/:groupID/students/:userID`}>
                        <StudentDetailsPage />
                    </Route>
                    <Route path={`${url}/groups/:id`}>
                        <GroupPage />
                    </Route>
                    <Route path={`${url}/tasks/:id`}>
                        <TaskDetailsPage />
                    </Route>
                    <Route path={`${url}/student-files/:id`}>
                        <StudentFilePage />
                    </Route>
                </Switch>
            )}
        />
    );
}
