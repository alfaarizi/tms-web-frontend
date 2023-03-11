import React from 'react';
import { Redirect } from 'react-router';
import { useUserSettings } from 'hooks/common/UserHooks';

/**
 * Redirects the user to the correct homepage
 * @constructor
 */
export function HomePage() {
    const userSettings = useUserSettings();

    if (!userSettings.data) {
        return null;
    }

    if (userSettings.data.isFaculty) {
        return <Redirect to="/instructor/task-manager" />;
    }

    if (userSettings.data.isStudent) {
        return <Redirect to="/student/task-manager" />;
    }

    if (userSettings.data.isAdmin) {
        return <Redirect to="/admin/course-manager" />;
    }

    return null;
}
