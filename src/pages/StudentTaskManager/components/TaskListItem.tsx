import { useTranslation } from 'react-i18next';
import { ListCardItem } from '@/components/ListCardItem/ListCardItem';
import { Task } from '@/resources/student/Task';
import { LocaleDateTime } from '@/components/LocaleDateTime';
import { RemainingTimeForDeadLine } from '@/components/RemainingTimeForDeadLine';

type Props = {
    task: Task,
    onClick: (id: number) => void
}

export function TaskListItem({
    task,
    onClick,
}: Props) {
    const { t } = useTranslation();

    return (
        <ListCardItem key={task.id} onClick={() => onClick(task.id)}>
            <div className="d-flex justify-content-between align-items-center w-100">
                <strong>{task.name}</strong>
                <strong>
                    {task.submission.translatedStatus}
                    {' '}
                    {task.submission.grade ? ` (${task.submission?.grade})` : null}
                </strong>
            </div>

            {task.softDeadline && task.softDeadline !== '' ? (
                <span>
                    {t('task.softDeadLine')}
                    {': '}
                    <LocaleDateTime value={task.softDeadline} />
                    {' ('}
                    <RemainingTimeForDeadLine
                        deadline={task.softDeadline}
                        submissionUploadTime={task.submission.uploadTime}
                    />
                    )
                    {' | '}
                </span>
            ) : null}
            <span>
                {t('task.hardDeadLine')}
                {': '}
                <LocaleDateTime value={task.hardDeadline} />
                {' ('}
                <RemainingTimeForDeadLine
                    deadline={task.hardDeadline}
                    submissionUploadTime={task.submission.uploadTime}
                />
                )
            </span>
            {task.submission.personalDeadline ? (
                <span>
                    {' | '}
                    {t('task.personalDeadline')}
                    {': '}
                    <LocaleDateTime value={task.submission.personalDeadline} />
                    {' ('}
                    <RemainingTimeForDeadLine
                        deadline={task.submission.personalDeadline}
                        submissionUploadTime={task.submission.uploadTime}
                    />
                    )
                </span>
            ) : null}
        </ListCardItem>
    );
}
