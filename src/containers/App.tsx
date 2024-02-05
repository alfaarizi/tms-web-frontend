import React, {
    lazy, useEffect, Suspense,
} from 'react';
import {
    Redirect, Route, Switch, useLocation,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { satisfies } from 'semver';

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
import { usePublicSystemInfoQuery } from 'hooks/common/SystemHooks';
import { useErrorBoundaryContext } from 'components/ErrorBoundary';
import { InvalidVersionRangeError } from 'exceptions/InvalidVersionRangeError';

// Lazy load bigger page groups
const StudentTaskManager = lazy(() => import('pages/StudentTaskManager'));
const StudentExamination = lazy(() => import('pages/StudentExamination'));
const InstructorTaskManager = lazy(() => import('pages/InstructorTaskManager'));
const InstructorExamination = lazy(() => import('pages/InstructorExamination'));
const InstructorPlagiarism = lazy(() => import('pages/InstructorPlagiarism'));
const AdminSemesterManager = lazy(() => import('pages/AdminSemesterManager'));
const AdminNotificationManager = lazy(() => import('pages/AdminNotificationManager'));
const AdminCourseManager = lazy(() => import('pages/AdminCourseManager'));
const Settings = lazy(() => import('pages/Settings'));
const ConfirmEmailPage = lazy(() => import('pages/Settings/containers/ConfirmEmailPage'));

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
    const userSettings = useUserSettings(!!isLoggedIn);
    const tokenAuth = useTokenAuth();

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
     * Run on application startup
     */
    useEffect(() => {
        loadPublicSystemInfo()
            .then(() => tokenAuth.tryAuthenticate())
            .catch((err) => triggerError(err));
    }, []);

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
                    <ProtectedRoute hasPermission={isStudent} path="/student/exam">
                        <StudentExamination />
                    </ProtectedRoute>

                    <ProtectedRoute hasPermission={isFaculty} path="/canvas/oauth2-response">
                        <Redirect to={{ ...location, pathname: '/instructor/task-manager/canvas/oauth2-response' }} />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isFaculty} path="/instructor/task-manager">
                        <InstructorTaskManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isFaculty} path="/instructor/plagiarism">
                        <InstructorPlagiarism />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isFaculty} path="/instructor/exam">
                        <InstructorExamination />
                    </ProtectedRoute>

                    <ProtectedRoute hasPermission={isAdmin} path="/admin/course-manager">
                        <AdminCourseManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isAdmin} path="/admin/semester-manager">
                        <AdminSemesterManager />
                    </ProtectedRoute>
                    <ProtectedRoute hasPermission={isAdmin} path="/admin/notification-manager">
                        <AdminNotificationManager />
                    </ProtectedRoute>

                    <ProtectedRoute exact path="/settings">
                        <Settings />
                    </ProtectedRoute>
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
