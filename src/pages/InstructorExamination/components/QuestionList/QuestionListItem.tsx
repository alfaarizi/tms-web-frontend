import React, { ReactNode } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ExamQuestion } from 'resources/instructor/ExamQuestion';
import { useShow } from 'ui-hooks/useShow';

import { ExamAnswer } from 'resources/instructor/ExamAnswer';
import { ExamQuestionCard } from 'components/ExamQuestionCard';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { AnswerList } from './AnswerList';

type Props = {
    question: ExamQuestion,
    renderQuestionOptions?: (question: ExamQuestion) => ReactNode,
    renderAnswerOptions?: (answer: ExamAnswer) => ReactNode
}

export function QuestionListItem({
    question,
    renderAnswerOptions,
    renderQuestionOptions,
}: Props) {
    const { t } = useTranslation();
    const showAnswers = useShow();

    return (
        <ExamQuestionCard
            text={question.text}
            options={(
                <ButtonGroup>
                    {renderQuestionOptions ? renderQuestionOptions(question) : null}
                    <ToolbarButton
                        onClick={showAnswers.toggle}
                        text={t('examQuestions.answers')}
                        icon={showAnswers.show ? faArrowUp : faArrowDown}
                    />
                </ButtonGroup>
            )}
        >
            {
                showAnswers.show
                    ? <AnswerList question={question} renderAnswerOptions={renderAnswerOptions} />
                    : null
            }
        </ExamQuestionCard>
    );
}
