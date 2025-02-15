import { Trans, useTranslation } from 'react-i18next';

export function IssueBoard() {
    const { t } = useTranslation();

    return (
        <>
            <h2>{t('aboutPage.issueBoard')}</h2>
            <p>
                <Trans
                    i18nKey="aboutPage.issueBoardText"
                    components={{
                        a:
    <a
        href="https://gitlab.com/tms-elte/frontend-react/-/issues/new?issuable_template=Bug%20Report"
        target="_blank"
        rel="noreferrer"
    >
        {t('aboutPage.issueBoardLink')}
    </a>,
                    }}
                />
            </p>
        </>

    );
}
