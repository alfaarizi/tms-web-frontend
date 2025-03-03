import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';
import { faCopy, faEdit, faFileAlt } from '@fortawesome/free-solid-svg-icons';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { DataRow } from 'components/DataRow';
import { QuizQuestionSet } from 'resources/instructor/QuizQuestionSet';

type Props = {
    questionSet: QuizQuestionSet,
    onNewTest: () => void,
    onDuplicate: () => void,
    onEdit: () => void,
    onDelete: () => void
}

export function QuestionSetDetails({
    onDelete,
    onDuplicate,
    onEdit,
    onNewTest,
    questionSet,
}: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('quizQuestions.questionSet')}</CustomCardTitle>
                <ButtonGroup>
                    <ToolbarButton icon={faFileAlt} text={t('quizTests.newTest')} onClick={onNewTest} />
                    <ToolbarButton icon={faCopy} text={t('common.duplicate')} onClick={onDuplicate} />
                    <ToolbarButton icon={faEdit} text={t('common.edit')} onClick={onEdit} />
                    <DeleteToolbarButton onDelete={onDelete} />
                </ButtonGroup>
            </CustomCardHeader>

            <DataRow label={t('common.name')}>{questionSet.name}</DataRow>
            <DataRow label={t('course.course')}>{questionSet.course.name}</DataRow>
        </CustomCard>
    );
}
