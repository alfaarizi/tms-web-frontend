import React from 'react';
import { Redirect } from 'react-router';
import { useUserInfo } from 'hooks/common/UserHooks';

/**
 * Redirects the user to the correct homepage
 * @constructor
 */
export function HomePage() {
    const userInfo = useUserInfo();

    if (!userInfo.data) {
        return null;
    }

    if (userInfo.data.isFaculty) {
        return <Redirect to="/instructor/task-manager" />;
    }

    if (userInfo.data.isStudent) {
        return <Redirect to="/student/task-manager" />;
    }

    if (userInfo.data.isAdmin) {
        return <Redirect to="/admin/course-manager" />;
    }

    return null;
}
