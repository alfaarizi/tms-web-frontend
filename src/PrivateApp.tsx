import React, { lazy, useEffect, Suspense } from 'react';
import {
    Redirect, Route, Switch, useHistory, useLocation,
} from 'react-router';
import { useTranslation } from 'react-i18next';

import { useChangeUserLocaleMutation, useUserInfo } from 'hooks/common/UserHooks';
import { Header } from 'components/Header/Header';
import { FullScreenSpinner } from 'components/FullScreenSpinner/FullScreenSpinner';
import { useAppContext } from 'context/AppContext';
import { useSemesters } from 'hooks/common/SemesterHooks';
import { ProtectedRoute } from 'components/ProtectedRoute';

import Logout from 'pages/Logout';
import ErrorPage from 'pages/ErrorPage';
import { useQueryClient } from 'react-query';
// Lazy load bigger page groups
const StudentTaskManager = lazy(() => import('pages/StudentTaskManager'));
const StudentExamination = lazy(() => import('pages/StudentExamination'));
const InstructorTaskManager = lazy(() => import('pages/InstructorTaskManager'));
const InstructorExamination = lazy(() => import('pages/InstructorExamination'));
const InstructorPlagiarism = lazy(() => import('pages/InstructorPlagiarism'));
const AdminSemesterManager = lazy(() => import('pages/AdminSemesterManager'));
const AdminCourseManager = lazy(() => import('pages/AdminCourseManager'));

export function PrivateApp() {
    const { t } = useTranslation();
    const appContext = useAppContext();
    const semesters = useSemesters(false);
    const userInfo = useUserInfo();
    const localeSetMutation = useChangeUserLocaleMutation();
    const history = useHistory();
    const location = useLocation();
    const queryClient = useQueryClient();

    // Redirect user to the correct homepage from the root path
    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '') {
            if (userInfo.data?.isFaculty) {
                history.replace('/instructor/task-manager');
            } else if (userInfo.data?.isStudent) {
                history.replace('/student/task-manager');
            } else if (userInfo.data?.isAdmin) {
                history.replace('/admin/course-manager');
            }
        }
    }, [location.pathname]);

    const clearInactiveQueries = () => {
        queryClient.removeQueries({ inactive: true });
    };

    if (!userInfo.data) {
        return <FullScreenSpinner />;
    }

    return (
        <>
            <Header
                semesters={semesters.data}
                userInfo={userInfo.data}
                fetchSemesters={() => semesters.refetch()}
                selectedSemester={appContext.selectedSemester}
                setLocale={(key: string) => localeSetMutation.mutate(key)}
                setSelectedSemester={appContext.setSelectedSemester}
                clearInactiveQueries={clearInactiveQueries}
            />
            <Suspense fallback={<FullScreenSpinner />}>
                <Switch>
                    <Route path="/logout" exact>
                        <Logout />
                    </Route>

                    <ProtectedRoute enabled={userInfo.data.isStudent} path="/student/task-manager">
                        <StudentTaskManager />
                    </ProtectedRoute>
                    <ProtectedRoute enabled={userInfo.data.isStudent} path="/student/exam">
                        <StudentExamination />
                    </ProtectedRoute>

                    <ProtectedRoute enabled={userInfo.data.isFaculty} path="/canvas/oauth2-response">
                        <Redirect to={{ ...location, pathname: '/instructor/task-manager/canvas/oauth2-response' }} />
                    </ProtectedRoute>
                    <ProtectedRoute enabled={userInfo.data.isFaculty} path="/instructor/task-manager">
                        <InstructorTaskManager />
                    </ProtectedRoute>
                    <ProtectedRoute enabled={userInfo.data.isFaculty} path="/instructor/plagiarism">
                        <InstructorPlagiarism />
                    </ProtectedRoute>
                    <ProtectedRoute enabled={userInfo.data.isFaculty} path="/instructor/exam">
                        <InstructorExamination />
                    </ProtectedRoute>

                    <ProtectedRoute enabled={userInfo.data.isAdmin} path="/admin/course-manager">
                        <AdminCourseManager />
                    </ProtectedRoute>
                    <ProtectedRoute enabled={userInfo.data.isAdmin} path="/admin/semester-manager">
                        <AdminSemesterManager />
                    </ProtectedRoute>

                    <Route>
                        <ErrorPage title={t('errorPage.pageNotFound')} />
                    </Route>
                </Switch>
            </Suspense>
        </>
    );
}
