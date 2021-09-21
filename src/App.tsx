import React, { useEffect, useState } from 'react';
import { axiosInstance } from 'api/axiosInstance';

import { useUserInfo } from 'hooks/common/UserHooks';
import { PrivateApp } from 'PrivateApp';
import { useNotifications } from 'hooks/common/useNotifications';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useNetworkErrorHandler } from 'hooks/common/useNetworkErrorHandler';
import LoginPage from 'pages/Login';

export function App() {
    // Use network networkErrorHandler globally
    useNetworkErrorHandler();

    const notifications = useNotifications();
    const [loggedIn, setLoggedIn] = useState(false);
    const {
        data: userInfo,
        refetch: refetchUserInfo,
    } = useUserInfo(loggedIn);

    // Load token from localStorage
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            refetchUserInfo();
        }
    }, []);

    useEffect(() => {
        if (userInfo) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [userInfo]);

    // Switch between public and private frontend
    // Show notifications
    return (
        <>
            <NotificationToast data={notifications.notification} onClose={notifications.close} />
            {loggedIn ? <PrivateApp /> : <LoginPage />}
        </>
    );
}
