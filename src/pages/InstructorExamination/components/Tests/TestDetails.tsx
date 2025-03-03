import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuizTest } from 'resources/instructor/QuizTest';
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
    test: QuizTest;
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
                    <ToolbarButton icon={faPlay} text={t('quizTests.finalize')} onClick={onFinalize} />
                    <ToolbarButton icon={faCopy} text={t('common.duplicate')} onClick={onDuplicate} />
                    <ToolbarButton icon={faEdit} text={t('common.edit')} onClick={onEdit} />
                    <DeleteToolbarButton onDelete={onDelete} />
                </ButtonGroup>
            </CustomCardHeader>
            <DataRow label={t('course.course')}>
                {test.group?.course.name}
                {' '}
                (
                {test.group?.number}
                )
            </DataRow>
            <DataRow label={t('quizTests.available')}>
                <DateTimeInterval
                    from={test.availablefrom}
                    to={test.availableuntil}
                    timezone={test.timezone}
                />
            </DataRow>
            <DataRow label={t('quizTests.duration')}>{test.duration}</DataRow>
            <DataRow label={t('quizTests.questionAmount')}>{test.questionamount}</DataRow>
        </CustomCard>
    );
}
