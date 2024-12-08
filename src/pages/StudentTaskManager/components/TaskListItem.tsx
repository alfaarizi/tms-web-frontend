import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { Task } from 'resources/student/Task';
import { LocaleDateTime } from 'components/LocaleDateTime';
import { RemainingTimeForDeadLine } from 'components/RemainingTimeForDeadLine';

type Props = {
    task: Task,
    onClick: (id: number) => void
}

export const TaskListItem = ({
    task,
    onClick,
}: Props) => {
    const { t } = useTranslation();

    return (
        <ListCardItem key={task.id} onClick={() => onClick(task.id)}>
            <div className="d-flex justify-content-between align-items-center w-100">
                <strong>{task.name}</strong>
                <strong>
                    {task.submissions[0].translatedStatus}
                    {' '}
                    {task.submissions[0].grade ? ` (${task.submissions[0]?.grade})` : null}
                </strong>
            </div>

            {task.softDeadline && task.softDeadline !== '' ? (
                <>
                    <span>
                        {t('task.softDeadLine')}
                        {': '}
                        <LocaleDateTime value={task.softDeadline} />
                        {' ('}
                        <RemainingTimeForDeadLine
                            value={task.softDeadline}
                            hasSubmission={task.submissions[0].uploadCount > 0}
                        />
                        )
                        {' | '}
                    </span>
                </>
            ) : null}
            <span>
                {t('task.hardDeadLine')}
                {': '}
                <LocaleDateTime value={task.hardDeadline} />
                {' ('}
                <RemainingTimeForDeadLine
                    value={task.hardDeadline}
                    hasSubmission={task.submissions[0].uploadCount > 0}
                />
                )
            </span>
        </ListCardItem>
    );
};
