import React from 'react';
import { useTranslation } from 'react-i18next';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { DataRow } from 'components/DataRow';
import { StudentFile } from 'resources/student/StudentFile';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { AutoTestResultAlert } from 'components/AutoTestResultAlert';
import { LocaleDateTime } from 'components/LocaleDateTime';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { useAutoTestResults } from 'hooks/student/StudentFileHooks';

type StudentFileDetailsProps = {
    studentFile: StudentFile,
    onDownload: () => void,
    onReportDownload: () => void,
    autoTest: number,
    appType?: string
}

export const StudentFileDetails = ({
    studentFile, onDownload, onReportDownload, autoTest, appType,
} : StudentFileDetailsProps) => {
    const { t } = useTranslation();
    const autoTesterResults = useAutoTestResults(studentFile.id);

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.solution')}</CustomCardTitle>
                {studentFile.uploadCount > 0
                    ? (
                        <ToolbarButton
                            onClick={onDownload}
                            icon={faDownload}
                            text={t('common.download')}
                        />
                    )
                    : null}
            </CustomCardHeader>

            <DataRow label={t('task.name')}>{studentFile.name}</DataRow>
            <DataRow label={t('task.uploadTime')}>
                <LocaleDateTime value={studentFile.uploadTime} />
            </DataRow>
            <DataRow label={t('task.grade')}>{studentFile.grade}</DataRow>
            <DataRow label={t('task.status')}>{studentFile.translatedIsAccepted}</DataRow>
            <DataRow label={t('task.uploadCount')}>{studentFile.uploadCount}</DataRow>
            <DataRow label={t('task.graderName')}>{studentFile.graderName}</DataRow>
            <DataRow label={t('task.notes')}>
                <MultiLineTextBlock text={studentFile.notes} />
            </DataRow>
            {autoTest === 1 && studentFile?.errorMsg
                ? (
                    <AutoTestResultAlert
                        isAccepted={studentFile?.isAccepted}
                        errorMsg={studentFile?.errorMsg}
                        appType={appType || 'Console'}
                        onReportDownload={onReportDownload}
                        results={autoTesterResults.data ?? []}
                    />
                )
                : null}
        </CustomCard>
    );
};
