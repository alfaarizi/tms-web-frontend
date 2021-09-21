import React from 'react';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { Task } from 'resources/instructor/Task';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

type Props = {
    task: Task
}

export const TaskListItem = ({ task }: Props) => {
    const { t } = useTranslation();
    const history = useHistory();

    const selectTask = () => {
        history.push(`../tasks/${task.id}`);
    };

    return (
        <ListCardItem key={task.id} onClick={selectTask}>
            <div className="d-flex justify-content-between align-items-center w-100">
                <strong>{task.name}</strong>
            </div>

            {task.softDeadline && task.softDeadline !== '' ? (
                <span>
                    {t('task.softDeadLine')}
                    {`: ${task.softDeadline} | `}
                </span>
            ) : null}
            <span>
                {t('task.hardDeadLine')}
                {`: ${task.hardDeadline}`}
            </span>
        </ListCardItem>
    );
};
