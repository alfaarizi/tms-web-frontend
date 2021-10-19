import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBriefcase, faWrench } from '@fortawesome/free-solid-svg-icons';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory } from 'react-router';

type Props = {
    isStudent: boolean,
    isFaculty: boolean
    isAdmin: boolean,
    clearInactiveQueries: () => void,
}

export function RoleSwitcher({
    isAdmin,
    isFaculty,
    isStudent,
    clearInactiveQueries,
}: Props) {
    const { t } = useTranslation();
    const history = useHistory();
    const studentIcon = <FontAwesomeIcon icon={faGraduationCap} />;
    const instructorIcon = <FontAwesomeIcon icon={faBriefcase} />;
    const adminIcon = <FontAwesomeIcon icon={faWrench} />;

    const switchRole = (url: string) => {
        history.push(url);
        // Wait a second to make sure the role switch was successful, then clear inactive queries
        setTimeout(() => clearInactiveQueries(), 1000);
    };

    const title = (
        <>
            <Switch>
                <Route path="/student">
                    {studentIcon}
                    {' '}
                    {t('navbar.roles.student')}
                </Route>
                <Route path="/instructor">
                    {instructorIcon}
                    {' '}
                    {t('navbar.roles.teacher')}
                </Route>
                <Route path="/admin">
                    {adminIcon}
                    {' '}
                    {t('navbar.roles.admin')}
                </Route>
            </Switch>
        </>
    );

    return (
        <NavDropdown title={title} id="nav-dropdown-role">
            {isStudent
                ? (
                    <NavDropdown.Item onClick={() => switchRole('/student/task-manager')}>
                        {studentIcon}
                        {' '}
                        {t('navbar.roles.student')}
                    </NavDropdown.Item>
                )
                : null}
            {isFaculty
                ? (
                    <NavDropdown.Item onClick={() => switchRole('/instructor/task-manager')}>
                        {instructorIcon}
                        {' '}
                        {t('navbar.roles.teacher')}
                    </NavDropdown.Item>
                )
                : null}
            {isAdmin
                ? (
                    <NavDropdown.Item onClick={() => switchRole('/admin/course-manager')}>
                        {adminIcon}
                        {' '}
                        {t('navbar.roles.admin')}
                    </NavDropdown.Item>
                )
                : null}
        </NavDropdown>
    );
}
