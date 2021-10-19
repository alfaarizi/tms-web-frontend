import React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { DataRow } from 'components/DataRow';
import { Task } from 'resources/student/Task';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { LocaleDateTime } from 'components/LocaleDateTime';

type Props = {
    task: Task
}

export const TaskDetails = ({ task }: Props) => {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{task.name}</CustomCardTitle>
            </CustomCardHeader>
            <DataRow label={t('task.category')}>{task.translatedCategory}</DataRow>
            <DataRow label={t('task.available')}>
                <LocaleDateTime value={task.available} />
            </DataRow>
            <DataRow label={t('task.softDeadLine')}>
                <LocaleDateTime value={task.softDeadline} />
            </DataRow>
            <DataRow label={t('task.hardDeadLine')}>
                <LocaleDateTime value={task.hardDeadline} />
            </DataRow>
            <DataRow label={t('task.creator')}>{task.creatorName}</DataRow>
            <hr />
            <DataRow label={t('task.description')}>
                {task.category === 'Canvas tasks'
                    ? <MultiLineTextBlock text={task.description} />
                    : <MarkdownRenderer source={task.description} />}
            </DataRow>
        </CustomCard>
    );
};
