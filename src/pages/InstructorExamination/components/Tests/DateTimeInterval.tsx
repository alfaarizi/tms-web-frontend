import { LocaleDateTime } from '@/components/LocaleDateTime';

import { useTranslation } from 'react-i18next';

type Props = {
    from: string | null | undefined,
    to: string | null | undefined,
    timezone: string
}

export function DateTimeInterval({ from, to, timezone }: Props) {
    const { t } = useTranslation();

    if (!from || from === '' || !to || to === '') {
        return null;
    }

    return (
        <>
            <span>
                {t('group.groupTime')}
                {': '}
                <LocaleDateTime value={from} timezone={timezone} />
                {' - '}
                <LocaleDateTime value={to} timezone={timezone} showTimeZone />
            </span>
            <br />
            <span>
                {t('group.localTime')}
                {': '}
                <LocaleDateTime value={from} />
                {' - '}
                <LocaleDateTime value={to} showTimeZone />
            </span>
        </>
    );
}
