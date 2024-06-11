import React from 'react';
import { useTranslation } from 'react-i18next';

export function Changelog() {
    const { t } = useTranslation();

    return (
        <>
            <h2>{t('aboutPage.changelog')}</h2>
            <p>
                {t('aboutPage.changelogText')}
                <ul>
                    <li>
                        <a
                            href="https://gitlab.com/tms-elte/backend-core/-/blob/develop/CHANGELOG.md"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t('aboutPage.changelogLinkBackend')}
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://gitlab.com/tms-elte/frontend-react/-/blob/develop/CHANGELOG.md"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t('aboutPage.changelogLinkFrontend')}
                        </a>
                    </li>
                </ul>
            </p>
        </>
    );
}
