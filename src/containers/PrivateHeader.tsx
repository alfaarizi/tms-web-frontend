import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LinkContainer } from 'react-router-bootstrap';
import {
    faCalendar, faCog, faCrosshairs, faFile, faList, faPen, faSignOutAlt, faBullhorn, faBookOpenReader, faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SemesterSwitcher } from 'components/Header/SemesterSwitcher';
import { RoleSwitcher } from 'components/Header/RoleSwitcher';
import { Header } from 'components/Header/Header';
import { useIsFetching, useQueryClient } from 'react-query';
import { useSemesters } from 'hooks/common/SemesterHooks';
import { usePlagiarismServices } from 'hooks/instructor/PlagiarismHooks';
import { useGlobalContext } from 'context/GlobalContext';
import { Role } from 'resources/common/Role';
import { HeaderContent } from 'components/Header/HeaderContent';
import { UserSettings } from 'resources/common/UserSettings';

type Props = {
    userSettings: UserSettings
}

/**
 * Contains private navigation actions
 * @param userSettings
 * @constructor
 */
export function PrivateHeader({
    userSettings,
}: Props) {
    const { t } = useTranslation();
    const globalContext = useGlobalContext();
    const queryClient = useQueryClient();
    const isFetching = useIsFetching();
    const {
        data: semesters,
        refetch: refetchSemesters,
    } = useSemesters(false);
    const availablePlagiarismServices = usePlagiarismServices(userSettings.isFaculty);
    const history = useHistory();
    const { pathname } = useLocation();
    const [currentRole, setCurrentRole] = useState<Role>(null);

    useEffect(() => {
        // Get current the role from the url or use the previously selected role
        let newRole: Role;
        if (pathname.startsWith('/student')) {
            newRole = 'student';
        } else if (pathname.startsWith('/instructor')) {
            newRole = 'instructor';
        } else if (pathname.startsWith('/admin')) {
            newRole = 'admin';
        } else {
            newRole = currentRole;
        }

        // If the role is still null, set it from user settings
        if (newRole == null) {
            if (userSettings.isFaculty) {
                newRole = 'instructor';
            } else if (userSettings.isStudent) {
                newRole = 'student';
            } else if (userSettings.isAdmin) {
                newRole = 'admin';
            }
        }
        setCurrentRole(newRole);
    }, [pathname]);

    const switchRole = (role: Role) => {
        switch (role) {
        case 'student':
            history.push('/student/task-manager');
            break;
        case 'instructor':
            history.push('/instructor/task-manager');
            break;
        case 'admin':
            history.push('/admin/course-manager');
            break;
        default:
            break;
        }
        // Wait a second to make sure the role switch was successful, then clear inactive queries
        setTimeout(() => queryClient.removeQueries({ inactive: true }), 1000);
    };

    return (
        <Header showFetchingIndicator={isFetching > 0}>
            <HeaderContent align="start">
                <RoleSwitcher
                    currentRole={currentRole}
                    switchRole={switchRole}
                    isStudent={userSettings.isStudent}
                    isFaculty={userSettings.isFaculty}
                    isAdmin={userSettings.isAdmin}
                />

                {currentRole === 'student'
                    ? (
                        <>
                            <LinkContainer to="/student/task-manager">
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faFile} />
                                    {' '}
                                    {t('navbar.taskmanager')}
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/student/exam">
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faPen} />
                                    {' '}
                                    {t('navbar.exam')}
                                </Nav.Link>
                            </LinkContainer>
                        </>
                    ) : null}
                {currentRole === 'instructor'
                    ? (
                        <>
                            <LinkContainer to="/instructor/task-manager">
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faFile} />
                                    {' '}
                                    {t('navbar.taskmanager')}
                                </Nav.Link>
                            </LinkContainer>
                            {availablePlagiarismServices.data?.length
                                ? (
                                    <LinkContainer to="/instructor/plagiarism">
                                        <Nav.Link>
                                            <FontAwesomeIcon icon={faCrosshairs} />
                                            {' '}
                                            {t('navbar.plagiarism')}
                                        </Nav.Link>
                                    </LinkContainer>
                                ) : null}
                            <LinkContainer to="/instructor/exam">
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faPen} />
                                    {' '}
                                    {t('navbar.exam')}
                                </Nav.Link>
                            </LinkContainer>
                        </>
                    ) : null}
                {currentRole === 'admin'
                    ? (
                        <>
                            <LinkContainer to="/admin/course-manager">
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faList} />
                                    {' '}
                                    {t('course.courses')}
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/admin/semester-manager">
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faCalendar} />
                                    {' '}
                                    {t('navbar.semesterManager')}
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/admin/notification-manager/notifications">
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faBullhorn} />
                                    {' '}
                                    {t('navbar.notificationManager')}
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/admin/statistics">
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faChartBar} />
                                    {' '}
                                    {t('navbar.statistics')}
                                </Nav.Link>
                            </LinkContainer>
                        </>
                    ) : null}
            </HeaderContent>
            <HeaderContent align="end">
                <LinkContainer to="/about">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faBookOpenReader} />
                        {' '}
                        {t('aboutPage.about')}
                    </Nav.Link>
                </LinkContainer>
                <SemesterSwitcher
                    semesters={semesters || []}
                    selected={globalContext.selectedSemester}
                    onChange={globalContext.setSelectedSemester}
                    onRefetch={refetchSemesters}
                />
                <LinkContainer to="/settings">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faCog} />
                        {' '}
                        {t('common.settings')}
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/logout">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        {' '}
                        {t('navbar.logout', { neptun: userSettings.neptun })}
                    </Nav.Link>
                </LinkContainer>
            </HeaderContent>
        </Header>
    );
}
