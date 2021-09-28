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
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';

type Props = {
    studentFile?: StudentFile,
    onDownload: () => void,
    autoTest: number
}

export const StudentFileDetails = ({
    studentFile,
    onDownload,
    autoTest,
}: Props) => {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.solution')}</CustomCardTitle>
                {studentFile
                    ? (
                        <ToolbarButton
                            onClick={onDownload}
                            icon={faDownload}
                            text={t('common.download')}
                        />
                    )
                    : null}
            </CustomCardHeader>

            <DataRow label={t('task.name')}>{studentFile?.name}</DataRow>
            <DataRow label={t('task.uploadTime')}>{studentFile?.uploadTime}</DataRow>
            <DataRow label={t('task.grade')}>{studentFile?.grade}</DataRow>
            <DataRow label={t('task.notes')}>
                <MultiLineTextBlock text={studentFile?.notes} />
            </DataRow>
            <DataRow label={t('task.status')}>{studentFile?.translatedIsAccepted}</DataRow>
            <DataRow label={t('task.graderName')}>{studentFile?.graderName}</DataRow>

            {autoTest === 1
                ? <AutoTestResultAlert isAccepted={studentFile?.isAccepted} errorMsg={studentFile?.errorMsg} /> : null}
        </CustomCard>
    );
};
