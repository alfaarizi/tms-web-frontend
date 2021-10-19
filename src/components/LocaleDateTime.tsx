import React from 'react';
import { DateTime } from 'luxon';

import { getUserTimezone } from 'utils/getUserTimezone';

type Props = {
    value: string | null | undefined,
    timezone?: string,
    showTimeZone?: boolean
}

/**
 * Converts a DateTime string to the current locale
 * @param value DateTime string in ISO format
 * @param timezone
 * @param show
 */
export function LocaleDateTime({ value, timezone, showTimeZone = false }: Props) {
    if (!value) {
        return null;
    }
    const dt = DateTime.fromISO(value, { zone: timezone || getUserTimezone() });
    return (
        <>
            {dt.toLocaleString(DateTime.DATETIME_SHORT)}
            {showTimeZone ? ` (${dt.zoneName})` : null}
        </>
    );
}
