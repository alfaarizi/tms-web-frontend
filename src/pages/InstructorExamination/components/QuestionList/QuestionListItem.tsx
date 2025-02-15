import { ReactNode } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { QuizQuestion } from '@/resources/instructor/QuizQuestion';
import { useShow } from '@/ui-hooks/useShow';

import { QuizAnswer } from '@/resources/instructor/QuizAnswer';
import { QuizQuestionCard } from '@/components/QuizQuestionCard';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { AnswerList } from '@/pages/InstructorExamination/components/QuestionList/AnswerList';

type Props = {
    question: QuizQuestion,
    renderQuestionOptions?: (question: QuizQuestion) => ReactNode,
    renderAnswerOptions?: (answer: QuizAnswer) => ReactNode
}

export function QuestionListItem({
    question,
    renderAnswerOptions,
    renderQuestionOptions,
}: Props) {
    const { t } = useTranslation();
    const showAnswers = useShow();

    return (
        <QuizQuestionCard
            text={question.text}
            options={(
                <ButtonGroup>
                    {renderQuestionOptions ? renderQuestionOptions(question) : null}
                    <ToolbarButton
                        onClick={showAnswers.toggle}
                        text={t('quizQuestions.answers')}
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
        </QuizQuestionCard>
    );
}
