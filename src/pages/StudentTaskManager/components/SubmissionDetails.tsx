import { useTranslation } from 'react-i18next';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { CustomCard } from '@/components/CustomCard/CustomCard';
import { DataRow } from '@/components/DataRow';
import { Submission } from '@/resources/student/Submission';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { AutoTestResultAlert } from '@/components/AutoTestResultAlert';
import { LocaleDateTime } from '@/components/LocaleDateTime';
import { MultiLineTextBlock } from '@/components/MutliLineTextBlock/MultiLineTextBlock';
import { useAutoTestResults } from '@/hooks/student/SubmissionHooks';
import { useTask } from '@/hooks/student/TaskHooks';

type SubmissionDetailsProps = {
    submission: Submission,
    onDownload: () => void,
    onReportDownload: () => void,
    autoTest: number,
    appType?: string
}

export function SubmissionDetails({
    submission, onDownload, onReportDownload, autoTest, appType,
} : SubmissionDetailsProps) {
    const { t } = useTranslation();
    const autoTesterResults = useAutoTestResults(submission.id);
    const task = useTask(submission.taskID);

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.solution')}</CustomCardTitle>
                {submission.uploadCount > 0
                    ? (
                        <ToolbarButton
                            disabled={!task?.data?.entryPasswordUnlocked}
                            onClick={onDownload}
                            icon={faDownload}
                            text={t('common.download')}
                        />
                    )
                    : null}
            </CustomCardHeader>

            <DataRow label={t('task.name')}>{submission.name}</DataRow>
            <DataRow label={t('task.uploadTime')}>
                <LocaleDateTime value={submission.uploadTime} />
            </DataRow>
            <DataRow label={t('task.grade')}>{submission.grade}</DataRow>
            <DataRow label={t('task.status')}>{submission.translatedStatus}</DataRow>
            <DataRow label={t('task.uploadCount')}>{submission.uploadCount}</DataRow>
            <DataRow label={t('task.graderName')}>{submission.graderName}</DataRow>
            <DataRow label={t('task.notes')}>
                <MultiLineTextBlock text={submission.notes} />
            </DataRow>
            {autoTest === 1 && (submission?.errorMsg || autoTesterResults.data)
                ? (
                    <AutoTestResultAlert
                        status={submission?.status}
                        errorMsg={submission?.errorMsg}
                        appType={appType || 'Console'}
                        onReportDownload={onReportDownload}
                        results={autoTesterResults.data ?? []}
                    />
                )
                : null}
        </CustomCard>
    );
}
