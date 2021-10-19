import { DateTime } from 'luxon';

export function getUserTimezone() {
    return DateTime.now().zoneName;
}
