import React from 'react';
import { usePublicSystemInfoQuery } from 'hooks/common/SystemHooks';
import { useTranslation } from 'react-i18next';

export function ProjectInformation() {
    const publicSystemInfo = usePublicSystemInfoQuery();
    const { t } = useTranslation();

    return (
        <>
            <p>
                {t('aboutPage.description')}
            </p>
            <p className="font-weight-bold">
                {t('aboutPage.versionFrontend')}
                : v
                {process.env.REACT_APP_VERSION}
                <br />
                {t('aboutPage.versionBackend')}
                : v
                {publicSystemInfo.data?.version}
            </p>
        </>
    );
}
