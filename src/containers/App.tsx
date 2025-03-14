import React, {
    lazy, Suspense, useEffect, useState,
} from 'react';
import {
    Redirect, Route, Switch, useLocation,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { satisfies } from 'semver';
import { DateTime } from 'luxon';

import { useTokenAuth, useUserSettings } from 'hooks/common/UserHooks';
import { FullScreenSpinner } from 'components/FullScreenSpinner/FullScreenSpinner';
import { ProtectedRoute } from 'components/ProtectedRoute';
import { useNetworkErrorHandler } from 'hooks/common/useNetworkErrorHandler';
import { useNotifications } from 'hooks/common/useNotifications';
import { useNotifications as useAlertNotifications } from 'hooks/common/NotificationsHooks';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import Home from 'pages/Home';
import Logout from 'pages/Logout';
import ErrorPage from 'pages/ErrorPage';
import { PrivateHeader } from 'containers/PrivateHeader';
import { PublicHeader } from 'containers/PublicHeader';
import { NotificationAlerts } from 'components/NotificationAlerts/NotificationAlerts';
import { useGlobalContext } from 'context/GlobalContext';
import { usePrivateSystemInfoQuery, usePublicSystemInfoQuery } from 'hooks/common/SystemHooks';
import { useErrorBoundaryContext } from 'components/ErrorBoundary';
import { InvalidVersionRangeError } from 'exceptions/InvalidVersionRangeError';
import { Notification } from '../resources/common/Notification';
import { getClockDifferenceNotification } from '../utils/MandatoryNotifications';

// Lazy load bigger page groups
const StudentTaskManager = lazy(() => import('pages/StudentTaskManager'));
const StudentExamination = lazy(() => import('pages/StudentExamination'));
const InstructorTaskManager = lazy(() => import('pages/InstructorTaskManager'));
const InstructorExamination = lazy(() => import('pages/InstructorExamination'));
const InstructorPlagiarism = lazy(() => import('pages/InstructorPlagiarism'));
const AdminSemesterManager = lazy(() => import('pages/AdminSemesterManager'));
const AdminNotificationManager = lazy(() => import('pages/AdminNotificationManager'));
const AdminStatistics = lazy(() => import('pages/AdminStatistics'));
const CourseManager = lazy(() => import('pages/CourseManager'));
const Settings = lazy(() => import('pages/Settings'));
const ConfirmEmailPage = lazy(() => import('pages/Settings/containers/ConfirmEmailPage'));
const AboutPage = lazy(() => import('pages/AboutPage'));

/**
 * Handles app initialization, use global hooks, contains main pages and page groups
 * @constructor
 */
export function App() {
    // Use network networkErrorHandler globally
    useNetworkErrorHandler();

    const notifications = useNotifications();
    const alertNotifications = useAlertNotifications();
    const { t } = useTranslation();
    const location = useLocation();
    const { isLoggedIn } = useGlobalContext();
    const { triggerError } = useErrorBoundaryContext();
    const publicSystemInfo = usePublicSystemInfoQuery(false);
    const privateSystemInfo = usePrivateSystemInfoQuery(false);
    const userSettings = useUserSettings(!!isLoggedIn);
    const tokenAuth = useTokenAuth();
    const [mandatoryNotifications, setMandatoryNotifications] = useState<Notification[]>([]);

    /**
     * Load backend-core public system information and check version
     */
    const loadPublicSystemInfo = async () => {
        const query = await publicSystemInfo.refetch({ throwOnError: true });

        const { version } = query.data!;
        const requiredRange = process.env.REACT_APP_BACKEND_CORE_VERSION_RANGE;
        if (!satisfies(version, requiredRange)) {
            throw new InvalidVersionRangeError(t('errorPage.versionError', { requiredRange, version }).toString());
        }
    };

    /**
     * Load backend-core private system information and check server time
     */
    const loadPrivateSystemInfo = async () => {
        const query = await privateSystemInfo.refetch({ throwOnError: true });

        const { serverDateTime } = query.data!;

        const now = DateTime.now();
        const serverTime = DateTime.fromISO(serverDateTime);
        const diff = Math.round(Math.abs(serverTime.diff(now, 'minutes').minutes));

        // if the difference is more than 3 minutes, we should show a warning
        if (diff > 3) {
            const clockDifferenceNotification = getClockDifferenceNotification(diff, t);
            // if the notification is already in the list, don't add it again
            if (mandatoryNotifications.some((notification) => notification.id === clockDifferenceNotification.id)) {
                return;
            }
            setMandatoryNotifications([...mandatoryNotifications, clockDifferenceNotification]);
        }
    };

    /**
     * Run on application startup
     */
    useEffect(() => {
        loadPublicSystemInfo()
            .then(() => tokenAuth.tryAuthenticate())
            .catch((err) => triggerError(err));
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            loadPrivateSystemInfo()
                .catch((err) => triggerError(err));
        } else {
            setMandatoryNotifications([]);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn && userSettings.data?.name) {
            document.title = `TMS | ${userSettings.data.name} (${userSettings.data.userCode})`;
        } else {
            document.title = 'TMS';
        }
    }, [isLoggedIn, userSettings.data]);

    const isStudent = !!userSettings.data?.isStudent;
    const isFaculty = !!userSettings.data?.isFaculty;
    const isAdmin = !!userSettings.data?.isAdmin;

    // Render
    if (isLoggedIn === null) {
        return <FullScreenSpinner />;
    }

    return (
        <>
            <NotificationToast data={notifications.notification} onClose={notifications.close} />
            {userSettings.data ? <PrivateHeader userSettings={userSettings.data} /> : <PublicHeader />}
            {mandatoryNotifications.length ? <NotificationAlerts notifications={mandatoryNotifications} /> : null}
            {alertNotifications.data ? <NotificationAlerts notifications={alertNotifications.data} /> : null}
            <Suspense fallback={<FullScreenSpinner />}>
                <Switch>
                    <ProtectedRoute exact path="/">
                        <Home />
                    </ProtectedRoute>
                    <ProtectedRoute exact path="/logout">
                        <Logout />
                    </ProtectedRoute>

                    <ProtectedRoute hasPermission={isStudent} path="/student/task-manager">
                        <StudentTaskManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isStudent} path="/student/quizzes">
                        <StudentExamination />
                    </ProtectedRoute>

                    <ProtectedRoute hasPermission={isFaculty} path="/canvas/oauth2-response">
                        <Redirect to={{ ...location, pathname: '/instructor/task-manager/canvas/oauth2-response' }} />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isFaculty} path="/instructor/task-manager">
                        <InstructorTaskManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isFaculty} path="/instructor/course-manager">
                        <CourseManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isFaculty} path="/instructor/plagiarism">
                        <InstructorPlagiarism />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isFaculty} path="/instructor/quizzes">
                        <InstructorExamination />
                    </ProtectedRoute>

                    <ProtectedRoute hasPermission={isAdmin} path="/admin/course-manager">
                        <CourseManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isAdmin} path="/admin/semester-manager">
                        <AdminSemesterManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isAdmin} path="/admin/notification-manager">
                        <AdminNotificationManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isAdmin} path="/admin/statistics">
                        <AdminStatistics />
                    </ProtectedRoute>

                    <ProtectedRoute exact path="/settings">
                        <Settings />
                    </ProtectedRoute>

                    <Route path="/about">
                        <AboutPage />
                    </Route>
                    <Route path="/confirm-email/:code">
                        <ConfirmEmailPage loggedIn={isLoggedIn} />
                    </Route>
                    <Route>
                        <ErrorPage title={t('errorPage.pageNotFound')} />
                    </Route>
                </Switch>
            </Suspense>
        </>
    );
}
