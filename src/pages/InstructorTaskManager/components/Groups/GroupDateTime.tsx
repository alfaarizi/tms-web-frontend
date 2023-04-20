import { LocaleDateTime } from 'components/LocaleDateTime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getUserTimezone } from 'utils/getUserTimezone';

type Props = {
    value: string | null | undefined,
    timezone: string
}

export function GroupDateTime({ value, timezone }: Props) {
    const { t } = useTranslation();

    if (!value || value === '') {
        return null;
    }

    return timezone !== getUserTimezone()
        ? (
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
        )
        : (
            <span>
                <LocaleDateTime value={value} showTimeZone />
            </span>
        );
}
