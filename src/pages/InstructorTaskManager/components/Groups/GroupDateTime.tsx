import { LocaleDateTime } from 'components/LocaleDateTime';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    value: string | null | undefined,
    timezone: string
}

export function GroupDateTime({ value, timezone }: Props) {
    const { t } = useTranslation();

    if (!value || value === '') {
        return null;
    }

    return (
        <>
            <span>
                {t('group.groupTime')}
                {': '}
                <LocaleDateTime value={value} timezone={timezone} showTimeZone />
            </span>
            <br />
            <span>
                {t('group.localTime')}
                {': '}
                <LocaleDateTime value={value} showTimeZone />
            </span>
        </>
    );
}
