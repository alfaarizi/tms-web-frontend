import React, { useMemo, useState } from 'react';
import {
    Route, Switch, useHistory, useRouteMatch,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { faArrowUpAZ, faArrowUpZA, faPlus } from '@fortawesome/free-solid-svg-icons';

import { SideBarItem } from 'components/Navigation/SideBarItem';
import { SideBarLayout } from 'layouts/SideBarLayout';
import { useCourses } from 'hooks/instructor/CoursesHooks';
import { NewCoursePage } from 'pages/CourseManager/containers/NewCoursePage';
import { CoursePage } from 'pages/CourseManager/containers/CoursePage';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';

export function CourseManagerPage() {
    const history = useHistory();
    const { url } = useRouteMatch();
    const isAdmin = url.startsWith('/admin');
    const { t } = useTranslation();
    const courses = useCourses(isAdmin, true, false);

    const [isAscending, setIsAscending] = useState(true);

    const sortedCourses = useMemo(
        () => {
            if (!courses.data) return [];
            return [...courses.data].sort((first, second) => {
                if (isAscending) {
                    return first.name.localeCompare(second.name); // A-Z
                }
                return second.name.localeCompare(first.name); // Z-A
            });
        },
        [courses.data, isAscending],
    );

    const handleNewCourseOpen = () => {
        history.push(`${url}/courses/new`);
    };

    const handleSort = async () => {
        setIsAscending((prev) => !prev);
    };

    return (
        <SideBarLayout
            sidebarTitle={t('course.courses')}
            sidebarItems={
                sortedCourses.map((course) => (
                    <SideBarItem
                        key={course.id}
                        title={course.name}
                        to={`${url}/courses/${course.id}`}
                    >
                        <p>
                            {t('course.codes')}
                            {': '}
                            {course.codes.join(', ')}
                        </p>
                    </SideBarItem>
                )) || []
            }
            sidebarButtons={isAdmin && (
                <>
                    <ToolbarButton
                        icon={faPlus}
                        text={t('common.add')}
                        className="float-right"
                        onClick={handleNewCourseOpen}
                        displayTextBreakpoint="xs"
                    />
                    <ToolbarButton
                        icon={isAscending ? faArrowUpAZ : faArrowUpZA}
                        text={t('course.sort')}
                        disabled={!courses}
                        onClick={handleSort}
                        className="float-right"
                        displayTextBreakpoint="none"
                    />
                </>
            )}
            mainContent={(
                <Switch>
                    <Route path={`${url}/courses/new`} exact>
                        <NewCoursePage />
                    </Route>
                    <Route path={`${url}/courses/:id`}>
                        <CoursePage />
                    </Route>
                </Switch>
            )}
        />
    );
}
