import { DateTime, Duration } from 'luxon';
import { getUserTimezone } from '@/utils/getUserTimezone';
import { useTranslation } from 'react-i18next';

type Props = {
    deadline: string,
    submissionUploadTime?: string,
    timezone?: string,
}

/**
 * Converts a DateTime string to the current locale
 * @param deadline DateTime string in ISO format
 * @param submissionUploadTime DateTime string in ISO format
 * @param timezone
 */
export function RemainingTimeForDeadLine({
    deadline,
    submissionUploadTime,
    timezone,
}: Props) {
    const { t } = useTranslation();
    const hasSubmission = submissionUploadTime != null;

    if (!deadline) {
        return null;
    }

    const dtDeadline = DateTime.fromISO(deadline, { zone: timezone || getUserTimezone() });
    const diffNow = dtDeadline.diffNow();
    const pastDue = diffNow.toMillis() <= 0;

    let dueString;
    const duration = Duration.fromMillis(diffNow.toMillis());
    const days = Math.floor(duration.as('days'));
    const hours = duration.as('hours') % 24;
    const minutes = duration.as('minutes') % 60;

    if (days > 0) {
        dueString = t('task.dueInDays', { days });
    } else if (hours > 0) {
        dueString = t('task.dueInHours', { hours: Math.floor(hours) });
    } else {
        dueString = t('task.dueInMinutes', { minutes: Math.floor(minutes) });
    }

    let displayString;
    if (hasSubmission) {
        const dtSubmissionUploadTime = DateTime
            .fromISO(submissionUploadTime, { zone: timezone || getUserTimezone() });
        const diffSubmissionUploadTime = dtDeadline.diff(dtSubmissionUploadTime);
        const submittedLate = diffSubmissionUploadTime.toMillis() < 0;

        if (pastDue) {
            if (submittedLate) {
                displayString = t('task.submittedLate');
            } else {
                displayString = t('task.submitted');
            }
        } else {
            displayString = `${t('task.submitted')}, ${dueString}`;
        }
    } else if (pastDue) {
        displayString = t('task.pastDue');
    } else {
        displayString = dueString;
    }

    const isUrgent = (days === 0 || pastDue) && !hasSubmission;

    return (
        <span className={isUrgent ? 'text-danger font-weight-bold' : undefined}>
            {displayString}
        </span>
    );
}
