import React, {
    lazy, useEffect, Suspense,
} from 'react';
import {
    Redirect, Route, Switch, useLocation,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { satisfies } from 'semver';

import { useUserSettings } from 'hooks/common/UserHooks';
import { FullScreenSpinner } from 'components/FullScreenSpinner/FullScreenSpinner';
import { ProtectedRoute } from 'components/ProtectedRoute';
import { useNetworkErrorHandler } from 'hooks/common/useNetworkErrorHandler';
import { useNotifications } from 'hooks/common/useNotifications';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import Home from 'pages/Home';
import Logout from 'pages/Logout';
import ErrorPage from 'pages/ErrorPage';
import { axiosInstance } from 'api/axiosInstance';
import { PrivateHeader } from 'containers/PrivateHeader';
import { PublicHeader } from 'containers/PublicHeader';
import { useGlobalContext } from 'context/GlobalContext';
import { usePrivateSystemInfoQuery, usePublicSystemInfoQuery } from 'hooks/common/SystemHooks';
import { useErrorBoundaryContext } from 'components/ErrorBoundary';
import { InvalidVersionRangeError } from 'exceptions/InvalidVersionRangeError';

// Lazy load bigger page groups
const StudentTaskManager = lazy(() => import('pages/StudentTaskManager'));
const StudentExamination = lazy(() => import('pages/StudentExamination'));
const InstructorTaskManager = lazy(() => import('pages/InstructorTaskManager'));
const InstructorExamination = lazy(() => import('pages/InstructorExamination'));
const InstructorPlagiarism = lazy(() => import('pages/InstructorPlagiarism'));
const AdminSemesterManager = lazy(() => import('pages/AdminSemesterManager'));
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
    const { t } = useTranslation();
    const location = useLocation();
    const { isLoggedIn, setIsLoggedIn } = useGlobalContext();
    const { triggerError } = useErrorBoundaryContext();
    const publicSystemInfo = usePublicSystemInfoQuery(false);
    // NOTE: this is a temporary workaround to set current semester as current for all users
    // TODO: rewrite login logic in https://gitlab.com/tms-elte/frontend-react/-/issues/112
    const privateSystemInfo = usePrivateSystemInfoQuery(!!isLoggedIn);
    const {
        data: userSettings,
        refetch: refetchUserSettings,
    } = useUserSettings(!!isLoggedIn);

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
     * Load token from localStorage
     */
    const authenticateWithAccessToken = async () => {
        const accessToken = localStorage.getItem('accessToken');
        // If localStorage contains a token, send it to the server
        if (accessToken) {
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            const query = await refetchUserSettings();
            setIsLoggedIn(query.isSuccess);
        } else {
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        loadPublicSystemInfo()
            .then(() => authenticateWithAccessToken())
            .catch((err) => triggerError(err));
    }, []);

    useEffect(() => {
        if (isLoggedIn !== null) {
            setIsLoggedIn(!!userSettings);
        }
    }, [userSettings, isLoggedIn]);

    const isStudent = !!userSettings?.isStudent;
    const isFaculty = !!userSettings?.isFaculty;
    const isAdmin = !!userSettings?.isAdmin;

    // Render
    if (isLoggedIn === null) {
        return <FullScreenSpinner />;
    }

    return (
        <>
            <NotificationToast data={notifications.notification} onClose={notifications.close} />
            {userSettings ? <PrivateHeader userSettings={userSettings} /> : <PublicHeader />}
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
