import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
    faCalendar, faCog, faCrosshairs, faFile, faList, faPen, faSignOutAlt, faBullhorn, faBookOpenReader, faChartBar,
} from '@fortawesome/free-solid-svg-icons';

import { SemesterSwitcher } from '@/components/Header/SemesterSwitcher';
import { RoleSwitcher } from '@/components/Header/RoleSwitcher';
import { Header } from '@/components/Header/Header';
import { useIsFetching, useQueryClient } from 'react-query';
import { useSemesters } from '@/hooks/common/SemesterHooks';
import { usePlagiarismServices } from '@/hooks/instructor/PlagiarismHooks';
import { useGlobalContext } from '@/context/GlobalContext';
import { Role } from '@/resources/common/Role';
import { HeaderContent } from '@/components/Header/HeaderContent';
import { UserSettings } from '@/resources/common/UserSettings';
import { LinkContent } from '@/components/Header/LinkContent';

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
        <Header showFetchingIndicator={isFetching > 0} currentRole={currentRole}>
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
                            <LinkContent
                                to="/student/task-manager"
                                icon={faFile}
                                text={t('navbar.taskmanager')}
                            />
                            <LinkContent
                                to="/student/quizzes"
                                icon={faPen}
                                text={t('navbar.quizzes')}
                            />
                        </>
                    ) : null}
                {currentRole === 'instructor'
                    ? (
                        <>
                            <LinkContent
                                to="/instructor/task-manager"
                                icon={faFile}
                                text={t('navbar.taskmanager')}
                            />
                            <LinkContent
                                to="/instructor/course-manager"
                                icon={faList}
                                text={t('course.courses')}
                            />
                            {availablePlagiarismServices.data?.length
                                ? (
                                    <LinkContent
                                        to="/instructor/plagiarism"
                                        icon={faCrosshairs}
                                        text={t('navbar.plagiarism')}
                                    />
                                ) : null}
                            <LinkContent
                                to="/instructor/quizzes"
                                icon={faPen}
                                text={t('navbar.quizzes')}
                            />
                        </>
                    ) : null}
                {currentRole === 'admin'
                    ? (
                        <>
                            <LinkContent
                                to="/admin/course-manager"
                                icon={faList}
                                text={t('course.courses')}
                            />
                            <LinkContent
                                to="/admin/semester-manager"
                                icon={faCalendar}
                                text={t('navbar.semesterManager')}
                            />
                            <LinkContent
                                to="/admin/notification-manager/notifications"
                                icon={faBullhorn}
                                text={t('navbar.notificationManager')}
                            />
                            <LinkContent
                                to="/admin/statistics"
                                icon={faChartBar}
                                text={t('navbar.statistics')}
                            />
                        </>
                    ) : null}
            </HeaderContent>
            <HeaderContent align="end">
                <LinkContent
                    to="/about"
                    icon={faBookOpenReader}
                    text={t('aboutPage.about')}
                />
                <SemesterSwitcher
                    semesters={semesters || []}
                    selected={globalContext.selectedSemester}
                    onChange={globalContext.setSelectedSemester}
                    onRefetch={refetchSemesters}
                />
                <LinkContent
                    to="/settings"
                    icon={faCog}
                    text={t('common.settings')}
                />
                <LinkContent
                    to="/logout"
                    icon={faSignOutAlt}
                    text={t('navbar.logout', { userCode: userSettings.userCode })}
                />
            </HeaderContent>
        </Header>
    );
}
