import React from 'react';
import { useTranslation } from 'react-i18next';

export function ProjectInformation() {
    const { t } = useTranslation();

    return (
        <>
            <p>
                {t('aboutPage.description')}
            </p>
            <h2>{t('aboutPage.repositories')}</h2>
            <ul>
                <li>
                    <a
                        href="https://gitlab.com/tms-elte/backend-core/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('aboutPage.repositoriesLinkBackend')}
                    </a>
                </li>
                <li>
                    <a
                        href="https://gitlab.com/tms-elte/frontend-react/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('aboutPage.repositoriesLinkFrontend')}
                    </a>
                </li>
            </ul>
            <h2>{t('aboutPage.documentation')}</h2>
            <ul>
                <li>
                    <a
                        href="https://tms-elte.gitlab.io/backend-core/phpdoc/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('aboutPage.documentationLinkBackend')}
                    </a>
                </li>
                <li>
                    <a
                        href="https://tms-elte.gitlab.io/backend-core/phpdoc/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('aboutPage.documentationLinkFrontend')}
                    </a>
                </li>
            </ul>
        </>
    );
}
