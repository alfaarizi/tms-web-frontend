import React from 'react';
import { useTranslation } from 'react-i18next';

import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { Task } from 'resources/student/Task';
import { LocaleDateTime } from 'components/LocaleDateTime';

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
                    {task.studentFiles[0].translatedIsAccepted}
                    {' '}
                    {task.studentFiles[0].grade ? ` (${task.studentFiles[0]?.grade})` : null}
                </strong>
            </div>

            {task.softDeadline && task.softDeadline !== '' ? (
                <span>
                    {t('task.softDeadLine')}
                    {': '}
                    <LocaleDateTime value={task.softDeadline} />
                    {' | '}
                </span>
            ) : null}
            <span>
                {t('task.hardDeadLine')}
                {': '}
                <LocaleDateTime value={task.hardDeadline} />
            </span>
        </ListCardItem>
    );
};
