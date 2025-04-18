import {
    faClock, faGear, faPlus, faSort, faUser, faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
    Route, Switch, useHistory, useRouteMatch,
} from 'react-router';
import { DateTime, WeekdayNumbers } from 'luxon';

import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { ToolbarDropdown } from '@/components/Buttons/ToolbarDropdown';
import { SideBarItem } from '@/components/Navigation/SideBarItem';
import {
    INSTRUCTOR_GROUP_ORDER_BY_LOCAL_STORAGE_KEY,
    INSTRUCTOR_GROUP_VIEW_LOCAL_STORAGE_KEY,
} from '@/constants/localStorageKeys';
import { useActualSemester, useSelectedSemester } from '@/hooks/common/SemesterHooks';
import { useUserSettings } from '@/hooks/common/UserHooks';
import { useCourses } from '@/hooks/instructor/CoursesHooks';
import { useGroups } from '@/hooks/instructor/GroupHooks';
import { SideBarLayout } from '@/layouts/SideBarLayout';
import { CanvasOAuth2 } from '@/pages/InstructorTaskManager/containers/CanvasOAuth2';
import { GroupPage } from '@/pages/InstructorTaskManager/containers/Groups/GroupPage';
import { NewGroup } from '@/pages/InstructorTaskManager/containers/Groups/NewGroup';
import { StudentDetailsPage } from '@/pages/InstructorTaskManager/containers/Students/StudentDetailsPage';
import { SubmissionPage } from '@/pages/InstructorTaskManager/containers/Submissions/SubmissionPage';
import { NewTaskPage } from '@/pages/InstructorTaskManager/containers/Tasks/NewTaskPage';
import { TaskDetailsPage } from '@/pages/InstructorTaskManager/containers/Tasks/TaskDetailsPage';
import { EditNotificationPage } from '@/pages/InstructorTaskManager/containers/Notifications/EditNotificationPage';
import { NewNotificationPage } from '@/pages/InstructorTaskManager/containers/Notifications/NewNotificationPage';
import {
    StudentCodeViewerPage,
} from '@/pages/InstructorTaskManager/containers/StudentCodeViewer/StudentCodeViewerPage';
import { Group } from '@/resources/instructor/Group';
import { DaysOfWeek } from '@/resources/common/DaysOfTheWeek';

enum GroupView {
    ALL = 'all',
    INSTRUCTOR = 'instructor'
}

enum OrderBy {
    TIMELINE = 'timeline',
}

export function InstructorTaskManager() {
    const { selectedSemesterID } = useSelectedSemester();
    const actualSemester = useActualSemester();
    const userSettings = useUserSettings();
    const groups = useGroups(selectedSemesterID);
    const history = useHistory();
    const { url } = useRouteMatch();
    const { t } = useTranslation();
    const courses = useCourses(false, true, false);

    const [groupView, setGroupView] = useState<GroupView>(GroupView.ALL);
    const [orderByType, setOrderByType] = useState<OrderBy | null>(null);

    useEffect(() => {
        const view = localStorage.getItem(INSTRUCTOR_GROUP_VIEW_LOCAL_STORAGE_KEY);

        // Check if the loaded value is a valid view
        switch (view) {
        case GroupView.ALL:
        case GroupView.INSTRUCTOR:
            // If it is valid set the new view
            setGroupView(view);
            break;
        default:
            break;
        }

        const orderBy = localStorage.getItem(INSTRUCTOR_GROUP_ORDER_BY_LOCAL_STORAGE_KEY);
        // Check if the loaded value is a valid sorting
        switch (orderBy) {
        case OrderBy.TIMELINE:
            // If it is valid set the new order by type
            setOrderByType(orderBy);
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
        localStorage.setItem(INSTRUCTOR_GROUP_VIEW_LOCAL_STORAGE_KEY, newGroupView);
    };

    const handleOrderByChange = (orderBy: OrderBy|null) => {
        setOrderByType(orderBy);
        if (orderBy) {
            localStorage.setItem(INSTRUCTOR_GROUP_ORDER_BY_LOCAL_STORAGE_KEY, orderBy);
        } else {
            localStorage.removeItem(INSTRUCTOR_GROUP_ORDER_BY_LOCAL_STORAGE_KEY);
        }
    };

    const filteredGroups = useMemo(() => {
        if (groupView === GroupView.INSTRUCTOR) {
            return groups.data?.filter((group: Group) => {
                if (group.instructors && userSettings.data) {
                    return group.instructors.some((instructor) => instructor.userCode === userSettings.data.userCode);
                }
                return false;
            });
        }
        return groups.data;
    }, [groups.data, groupView]);

    const sortedGroups = useMemo(() => {
        if (!filteredGroups) return [];

        const sorted = [...filteredGroups];

        switch (orderByType) {
        case OrderBy.TIMELINE:
            sorted.sort((a, b) => {
                if (!a.startTime) return 1;
                if (!b.startTime) return -1;

                const dateTimeA = DateTime.fromISO(a.startTime)
                    .set({ weekday: a.day as WeekdayNumbers });
                const dateTimeB = DateTime.fromISO(b.startTime)
                    .set({ weekday: b.day as WeekdayNumbers });
                return dateTimeA.toMillis() - dateTimeB.toMillis();
            });
            break;
        default:
            break;
        }

        return sorted;
    }, [filteredGroups, orderByType]);

    const isLecturer = courses.data ? courses.data.length > 0 : false;

    return (
        <SideBarLayout
            sidebarTitle={t('common.groups')}
            sidebarItems={
                sortedGroups?.map((group) => (
                    <SideBarItem
                        key={group.id}
                        title={group.course.name}
                        to={`${url}/groups/${group.id}`}
                        isCanvasSync={group.isCanvasCourse}
                    >
                        <p>
                            {t('group.number')}
                            :
                            {' '}
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
            sidebarButtons={
                actualSemester.check(selectedSemesterID)
                    ? (
                        <>
                            {isLecturer
                                ? (
                                    <ToolbarButton
                                        className="float-right"
                                        icon={faPlus}
                                        text=""
                                        onClick={handleNewGroupOpen}
                                        displayTextBreakpoint="xs"
                                    />
                                )
                                : null}
                            <ToolbarDropdown
                                text=""
                                displayTextBreakpoint="xs"
                                icon={groupView === GroupView.ALL ? faUserGroup : faUser}
                            >
                                <Dropdown.Item
                                    onSelect={() => handleGroupTypeChange(GroupView.ALL)}
                                    active={groupView === GroupView.ALL}
                                >
                                    <FontAwesomeIcon icon={faUserGroup} />
                                    {' '}
                                    {t('common.all')}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onSelect={() => handleGroupTypeChange(GroupView.INSTRUCTOR)}
                                    active={groupView === GroupView.INSTRUCTOR}
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    {' '}
                                    {t('common.asInstructor')}
                                </Dropdown.Item>
                            </ToolbarDropdown>
                            <ToolbarDropdown text="" icon={faSort}>
                                <Dropdown.Item
                                    onSelect={() => handleOrderByChange(null)}
                                    active={!orderByType}
                                >
                                    <FontAwesomeIcon icon={faGear} />
                                    {' '}
                                    {t('group.defaultSort')}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onSelect={() => handleOrderByChange(OrderBy.TIMELINE)}
                                    active={orderByType === OrderBy.TIMELINE}
                                >
                                    <FontAwesomeIcon icon={faClock} />
                                    {' '}
                                    {t('group.startTime')}
                                </Dropdown.Item>
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
                    <Route path={`${url}/groups/:groupID/new-notification`}>
                        <NewNotificationPage />
                    </Route>
                    <Route path={`${url}/groups/:groupID/edit-notification/:notificationID`}>
                        <EditNotificationPage />
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
                    <Route path={`${url}/submissions/:id`}>
                        <SubmissionPage />
                    </Route>
                    <Route path={`${url}/code-viewer/:id`}>
                        <StudentCodeViewerPage />
                    </Route>
                </Switch>
            )}
        />
    );
}
