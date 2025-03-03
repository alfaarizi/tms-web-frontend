import React, { ReactNode } from 'react';
import { QuizQuestion } from 'resources/instructor/QuizQuestion';

import { QuizAnswer } from 'resources/instructor/QuizAnswer';
import { QuestionListItem } from './QuestionListItem';

type Props = {
    questions: QuizQuestion[],
    renderQuestionOptions?: (question: QuizQuestion) => ReactNode,
    renderAnswerOptions?: (answer: QuizAnswer) => ReactNode
}

export function QuestionList({
    questions,
    renderAnswerOptions,
    renderQuestionOptions,
}: Props) {
    return (
        <>
            {
                questions.map((question) => (
                    <QuestionListItem
                        question={question}
                        renderQuestionOptions={renderQuestionOptions}
                        renderAnswerOptions={renderAnswerOptions}
                        key={question.id}
                    />
                ))
            }
        </>
    );
}
