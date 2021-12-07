import React, {
    lazy, useEffect, Suspense,
} from 'react';
import {
    Redirect, Route, Switch, useLocation,
} from 'react-router';
import { useTranslation } from 'react-i18next';

import { useUserInfo } from 'hooks/common/UserHooks';
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

    const {
        data: userInfo,
        refetch: refetchUserInfo,
    } = useUserInfo(!!isLoggedIn);

    useEffect(() => {
        if (isLoggedIn !== null) {
            setIsLoggedIn(!!userInfo);
        }
    }, [userInfo, isLoggedIn]);

    // Load token from localStorage
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        // If localStorage contains a token, send it to the server
        if (accessToken) {
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            refetchUserInfo().then((query) => {
                // If query is successful, the user is logged is
                setIsLoggedIn(query.isSuccess);
            });
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const isStudent = !!userInfo?.isStudent;
    const isFaculty = !!userInfo?.isFaculty;
    const isAdmin = !!userInfo?.isAdmin;

    // Render
    if (isLoggedIn === null) {
        return <FullScreenSpinner />;
    }

    return (
        <>
            <NotificationToast data={notifications.notification} onClose={notifications.close} />
            {userInfo ? <PrivateHeader userInfo={userInfo} /> : <PublicHeader />}
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
