import { useTranslation } from 'react-i18next';
import { TaskTimeFormat } from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskTimeFormat';

type Props = {
    hardDeadline: Date,
    available?: Date
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function TaskGridHeaderDeadline({ hardDeadline, available }: Props) {
    const { t, i18n } = useTranslation();

    const daysDifference = Math.round((hardDeadline.getTime() - Date.now()) / MILLISECONDS_PER_DAY);

    let dateLabel: string;
    switch (daysDifference) {
    case -1:
        dateLabel = t('days.yesterday');
        break;
    case 0:
        dateLabel = t('days.today');
        break;
    case 1:
        dateLabel = t('days.tomorrow');
        break;
    default:
        dateLabel = hardDeadline.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
    }

    return (
        <span style={{ textTransform: 'capitalize' }}>
            {dateLabel}
            <br />
            {available && available.toDateString() === hardDeadline.toDateString() ? (
                <>
                    <TaskTimeFormat date={available} />
                    -
                    <TaskTimeFormat date={hardDeadline} />
                </>
            ) : (
                <TaskTimeFormat date={hardDeadline} />
            )}
        </span>
    );
}
