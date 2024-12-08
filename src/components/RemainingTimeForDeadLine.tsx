import React from 'react';
import { DateTime, Duration } from 'luxon';
import { getUserTimezone } from 'utils/getUserTimezone';
import { useTranslation } from 'react-i18next';

type Props = {
    value: string | null | undefined,
    hasSubmission: boolean,
    timezone?: string,
}

/**
 * Converts a DateTime string to the current locale
 * @param value DateTime string in ISO format
 * @param hasSubmission
 * @param timezone
 */
export function RemainingTimeForDeadLine({ value, hasSubmission, timezone }: Props) {
    const { t } = useTranslation();

    if (!value) {
        return null;
    }

    const dt = DateTime.fromISO(value, { zone: timezone || getUserTimezone() });
    const diff = dt.diffNow();

    if (diff.toMillis() <= 0) {
        return <span className="text-danger">{t('task.pastDue')}</span>;
    }

    const duration = Duration.fromMillis(diff.toMillis());
    const days = Math.floor(duration.as('days'));
    const hours = duration.as('hours') % 24;
    const minutes = duration.as('minutes') % 60;

    let timeString;
    if (days > 0) {
        timeString = t('task.dueInDays', { days });
    } else if (hours > 0) {
        timeString = t('task.dueInHours', { hours: Math.floor(hours) });
    } else {
        timeString = t('task.dueInMinutes', { minutes: Math.floor(minutes) });
    }

    const isUrgent = days === 0 && !hasSubmission;

    return (
        <span className={isUrgent ? 'text-danger font-weight-bold' : undefined}>
            {timeString}
        </span>
    );
}
