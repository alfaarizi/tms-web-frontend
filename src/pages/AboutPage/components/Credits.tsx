import { Trans, useTranslation } from 'react-i18next';

export function Credits() {
    const { t } = useTranslation();

    return (
        <>
            <h2>{t('aboutPage.credits')}</h2>
            <p>
                <Trans
                    i18nKey="aboutPage.creditsText"
                    components={{
                        a:
    <a
        href="https://gitlab.com/groups/tms-elte/-/wikis/Credits"
        target="_blank"
        rel="noreferrer"
    >
        {t('aboutPage.creditsLink')}
    </a>,
                    }}
                />
            </p>
        </>
    );
}
