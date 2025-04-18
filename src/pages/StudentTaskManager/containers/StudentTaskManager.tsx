import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router';

import { useGroups } from '@/hooks/student/GroupHooks';
import { SideBarLayout } from '@/layouts/SideBarLayout';
import { SideBarItem } from '@/components/Navigation/SideBarItem';
import { TaskPage } from '@/pages/StudentTaskManager/containers/TaskPage';
import { GroupPage } from '@/pages/StudentTaskManager/containers/GroupPage';
import { useSelectedSemester } from '@/hooks/common/SemesterHooks';
import { DaysOfWeek } from '@/resources/common/DaysOfTheWeek';
import { DateTime } from 'luxon';

export function StudentTaskManager() {
    const { selectedSemesterID } = useSelectedSemester();
    const groups = useGroups(selectedSemesterID);
    const { url } = useRouteMatch();
    const { t } = useTranslation();

    return (
        <SideBarLayout
            sidebarTitle={t('common.groups')}
            sidebarItems={
                groups.data?.map((group) => (
                    <SideBarItem
                        title={group.course.name}
                        key={group.id}
                        to={`${url}/groups/${group.id}`}
                        isCanvasSync={group.isCanvasCourse}
                    >
                        <p>
                            {group.course.codes.join(', ')}
                            {' | '}
                            {group.number}
                            {group.day && group.startTime ? (
                                <>
                                    {' | '}
                                    {t(`days.${DaysOfWeek[group.day].toLowerCase()}`)}
                                    {', '}
                                    {DateTime.fromISO(group.startTime).toFormat('HH:mm')}
                                </>
                            ) : null}
                        </p>
                    </SideBarItem>
                )) || []
            }
            mainContent={(
                <Switch>
                    <Route path={`${url}/groups/:id`}>
                        <GroupPage />
                    </Route>
                    <Route path={`${url}/tasks/:id`}>
                        <TaskPage />
                    </Route>
                </Switch>
            )}
        />
    );
}
