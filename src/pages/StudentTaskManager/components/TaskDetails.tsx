import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { DataRow } from 'components/DataRow';
import { Task } from 'resources/student/Task';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';
import { LocaleDateTime } from 'components/LocaleDateTime';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { Submission } from 'resources/student/Submission';
import { RemainingTimeForDeadLine } from 'components/RemainingTimeForDeadLine';

type Props = {
    task: Task,
    submission: Submission,
    canvasSyncInProgress: boolean,
    onCanvasSync: () => void,
    showDescription: boolean
}

export const TaskDetails = ({
    task,
    submission,
    canvasSyncInProgress,
    onCanvasSync,
    showDescription,
}: Props) => {
    const { t } = useTranslation();

    let remainingSubmissions = 0;

    if (task.submissionLimit - submission.uploadCount > 0) {
        remainingSubmissions = task.submissionLimit - submission.uploadCount;
    } else if (task.isSubmissionCountRestricted && submission.status === 'Late Submission') {
        remainingSubmissions = 1;
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{task.name}</CustomCardTitle>
                { task.canvasUrl
                    ? (
                        <ToolbarButton
                            isLoading={canvasSyncInProgress}
                            text={t('group.canvasSync')}
                            icon={faSync}
                            onClick={onCanvasSync}
                        />
                    )
                    : null}
            </CustomCardHeader>
            <DataRow label={t('task.category')}>{task.translatedCategory}</DataRow>
            {task.canvasUrl ? (
                <DataRow label={t('task.canvasAssignment')}>
                    <a href={task.canvasUrl} target="_blank" rel="noreferrer">
                        {task.canvasUrl}
                    </a>
                </DataRow>
            ) : null}
            {task.available ? (
                <DataRow label={t('task.available')}>
                    <LocaleDateTime value={task.available} />
                </DataRow>
            ) : null}
            {task.softDeadline ? (
                <DataRow label={t('task.softDeadLine')}>
                    <LocaleDateTime value={task.softDeadline} />
                    {' ('}
                    <RemainingTimeForDeadLine
                        value={task.softDeadline}
                        hasSubmission={task.submission.uploadCount > 0}
                    />
                    )
                </DataRow>
            ) : null}
            <DataRow label={t('task.hardDeadLine')}>
                <LocaleDateTime value={task.hardDeadline} />
                {' ('}
                <RemainingTimeForDeadLine
                    value={task.hardDeadline}
                    hasSubmission={task.submission.uploadCount > 0}
                />
                )
            </DataRow>
            <DataRow label={t('task.restrictSubmissionAttempts.maxAttempts')}>
                {task.isSubmissionCountRestricted
                    ? task.submissionLimit
                    : t('task.restrictSubmissionAttempts.unlimited')}
            </DataRow>
            {task.isSubmissionCountRestricted ? (
                <DataRow label={t('task.restrictSubmissionAttempts.remaining')}>
                    {remainingSubmissions}
                </DataRow>
            ) : null}
            <DataRow label={t('task.creator')}>{task.creatorName}</DataRow>
            <hr />
            {(showDescription)
                && (
                    <DataRow label={t('task.description')}>
                        {task.category === 'Canvas tasks'
                            ? <MultiLineTextBlock text={task.description} />
                            : <MarkdownRenderer source={task.description} />}
                    </DataRow>
                )}
        </CustomCard>
    );
};
