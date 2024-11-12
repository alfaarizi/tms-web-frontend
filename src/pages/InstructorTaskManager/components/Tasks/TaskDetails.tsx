import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';
import { faEdit, faKey } from '@fortawesome/free-solid-svg-icons';

import { DataRow } from 'components/DataRow';
import { Task } from 'resources/instructor/Task';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { GroupDateTime } from 'pages/InstructorTaskManager/components/Groups/GroupDateTime';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { IconTooltip } from 'components/IconTooltip';

type Props = {
    task: Task,
    isActualSemester: boolean,
    onEdit: () => void,
    onRemove: () => void,
    showVersionControl: boolean
}

export const TaskDetails = ({
    isActualSemester,
    onRemove,
    onEdit,
    task,
    showVersionControl,
}: Props) => {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{task.name}</CustomCardTitle>
                {isActualSemester && task.category !== 'Canvas tasks'
                    ? (
                        <ButtonGroup>
                            <ToolbarButton icon={faEdit} onClick={onEdit} text={t('common.edit')} />
                            <DeleteToolbarButton onDelete={onRemove} />
                        </ButtonGroup>
                    )
                    : null}
            </CustomCardHeader>

            <DataRow label="ID">{task.id}</DataRow>
            <DataRow label={t('task.category')}>{task.translatedCategory}</DataRow>
            {task.canvasUrl ? (
                <DataRow label={t('task.canvasAssignment')}>
                    <a href={task.canvasUrl} target="_blank" rel="noreferrer">{task.canvasUrl}</a>
                </DataRow>
            ) : null}
            <DataRow label={t('task.available')}>
                <GroupDateTime value={task.available} timezone={task.group?.timezone || ''} />
            </DataRow>
            <DataRow label={t('task.softDeadLine')}>
                <GroupDateTime value={task.softDeadline} timezone={task.group?.timezone || ''} />
            </DataRow>
            <DataRow label={t('task.hardDeadLine')}>
                <GroupDateTime value={task.hardDeadline} timezone={task.group?.timezone || ''} />
            </DataRow>
            <DataRow label={t('task.restrictSubmissionAttempts.maxAttempts')}>
                {task.isSubmissionCountRestricted
                    ? task.submissionLimit
                    : t('task.restrictSubmissionAttempts.unlimited')}
            </DataRow>
            <DataRow label={t('task.creator')}>{task.creatorName}</DataRow>
            <DataRow label={t('passwordProtected.passwordProtected')}>
                {(!task.password || task.password.length === 0) ? t('common.no') : (
                    <>
                        {t('common.yes')}
                        <IconTooltip
                            tooltipID={`task-${task.id}-password`}
                            icon={faKey}
                            text={`${t('login.password')}: ${task.password}`}
                        />
                    </>
                )}

            </DataRow>
            {showVersionControl ? (
                <DataRow label={t('task.isVersionControlled')}>
                    {task.isVersionControlled ? t('common.yes') : t('common.no')}
                </DataRow>
            ) : null}
            <hr />
            <DataRow label={t('task.description')}>
                {task.category === 'Canvas tasks'
                    ? <MultiLineTextBlock text={task.description} />
                    : <MarkdownRenderer source={task.description} />}
            </DataRow>
        </CustomCard>
    );
};
