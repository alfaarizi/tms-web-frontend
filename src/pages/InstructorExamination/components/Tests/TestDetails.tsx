import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExamTest } from 'resources/instructor/ExamTest';
import { DataRow } from 'components/DataRow';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faCopy, faEdit, faPlay } from '@fortawesome/free-solid-svg-icons';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { ButtonGroup } from 'react-bootstrap';
import { DateTimeInterval } from 'pages/InstructorExamination/components/Tests/DateTimeInterval';

type Params = {
    test: ExamTest;
    onFinalize: () => void,
    onDuplicate: () => void,
    onEdit: () => void,
    onDelete: () => void
}

export function TestDetails({
    test,
    onFinalize,
    onDuplicate,
    onEdit,
    onDelete,
}: Params) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{test.name}</CustomCardTitle>
                <ButtonGroup>
                    <ToolbarButton icon={faPlay} text={t('examTests.finalize')} onClick={onFinalize} />
                    <ToolbarButton icon={faCopy} text={t('common.duplicate')} onClick={onDuplicate} />
                    <ToolbarButton icon={faEdit} text={t('common.edit')} onClick={onEdit} />
                    <DeleteToolbarButton onDelete={onDelete} />
                </ButtonGroup>
            </CustomCardHeader>
            <DataRow label={t('course.course')}>
                {test.courseName}
                {' '}
                (
                {test.groupNumber}
                )
            </DataRow>
            <DataRow label={t('examTests.available')}>
                <DateTimeInterval
                    from={test.availablefrom}
                    to={test.availableuntil}
                    timezone={test.timezone}
                />
            </DataRow>
            <DataRow label={t('examTests.duration')}>{test.duration}</DataRow>
            <DataRow label={t('examTests.questionAmount')}>{test.questionamount}</DataRow>
        </CustomCard>
    );
}
