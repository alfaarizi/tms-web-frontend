import React, { useEffect } from 'react';

import { useLogoutMutation } from 'hooks/common/UserHooks';
import { FullScreenSpinner } from 'components/FullScreenSpinner/FullScreenSpinner';

export function LogoutPage() {
    const logoutMutation = useLogoutMutation();

    useEffect(() => {
        logoutMutation.logout();
    }, []);

    return <FullScreenSpinner />;
}
