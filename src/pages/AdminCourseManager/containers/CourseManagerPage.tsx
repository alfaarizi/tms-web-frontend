import React from 'react';
import {
    Route, Switch, useHistory, useRouteMatch,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { SideBarItem } from 'components/Navigation/SideBarItem';
import { SideBarLayout } from 'layouts/SideBarLayout';
import { useCourses } from 'hooks/admin/CoursesHooks';
import { NewCoursePage } from 'pages/AdminCourseManager/containers/NewCoursePage';
import { CoursePage } from 'pages/AdminCourseManager/containers/CoursePage';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';

export function CourseManagerPage() {
    const history = useHistory();
    const { url } = useRouteMatch();
    const { t } = useTranslation();
    const courses = useCourses();

    const handleNewCourseOpen = () => {
        history.push(`${url}/courses/new`);
    };
    return (
        <SideBarLayout
            sidebarTitle={t('course.courses')}
            sidebarItems={
                courses.data?.map((course) => (
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
            sidebarButtons={(
                <ToolbarButton
                    icon={faPlus}
                    text={t('common.add')}
                    className="float-right"
                    onClick={handleNewCourseOpen}
                    displayTextBreakpoint="xs"
                />
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
