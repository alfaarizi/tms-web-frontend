import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBriefcase, faWrench } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';

type Props = {
    isStudent: boolean,
    isFaculty: boolean
    isAdmin: boolean
}

export function RoleSwitcher({
    isAdmin,
    isFaculty,
    isStudent,
}: Props) {
    const { t } = useTranslation();
    const studentIcon = <FontAwesomeIcon icon={faGraduationCap} />;
    const instructorIcon = <FontAwesomeIcon icon={faBriefcase} />;
    const adminIcon = <FontAwesomeIcon icon={faWrench} />;

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
                    <LinkContainer to="/student/task-manager">
                        <NavDropdown.Item>
                            {studentIcon}
                            {' '}
                            {t('navbar.roles.student')}
                        </NavDropdown.Item>
                    </LinkContainer>
                )
                : null}
            {isFaculty
                ? (
                    <LinkContainer to="/instructor/task-manager">
                        <NavDropdown.Item>
                            {instructorIcon}
                            {' '}
                            {t('navbar.roles.teacher')}
                        </NavDropdown.Item>
                    </LinkContainer>
                )
                : null}
            {isAdmin
                ? (
                    <LinkContainer to="/admin/course-manager">
                        <NavDropdown.Item>
                            {adminIcon}
                            {' '}
                            {t('navbar.roles.admin')}
                        </NavDropdown.Item>
                    </LinkContainer>
                )
                : null}
        </NavDropdown>
    );
}
