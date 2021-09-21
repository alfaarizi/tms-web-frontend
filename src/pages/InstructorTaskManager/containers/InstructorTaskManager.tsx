import React from 'react';
import {
    Route, Switch, useHistory, useRouteMatch,
} from 'react-router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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

export function InstructorTaskManager() {
    const { selectedSemesterID } = useSelectedSemester();
    const actualSemester = useActualSemester();
    const groups = useGroups(selectedSemesterID);
    const history = useHistory();
    const { url } = useRouteMatch();
    const { t } = useTranslation();

    const handleNewGroupOpen = () => {
        history.push(`${url}/groups/new`);
    };

    return (
        <SideBarLayout
            sidebarTitle={t('common.groups')}
            sidebarItems={
                groups.data?.map((group) => (
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
                        <ToolbarButton
                            className="float-right"
                            icon={faPlus}
                            text={t('common.add')}
                            onClick={handleNewGroupOpen}
                        />
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
