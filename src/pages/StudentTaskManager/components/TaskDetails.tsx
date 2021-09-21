import React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { DataRow } from 'components/DataRow';
import { Task } from 'resources/student/Task';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';

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
            <DataRow label={t('task.available')}>{task.available}</DataRow>
            <DataRow label={t('task.softDeadLine')}>{task.softDeadline}</DataRow>
            <DataRow label={t('task.hardDeadLine')}>{task.hardDeadline}</DataRow>
            <DataRow label={t('task.creator')}>{task.creatorName}</DataRow>
            <DataRow label={t('task.description')}><MarkdownRenderer source={task.description} /></DataRow>
        </CustomCard>
    );
};
