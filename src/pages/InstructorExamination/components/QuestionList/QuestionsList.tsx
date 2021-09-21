import React, { ReactNode } from 'react';
import { ExamQuestion } from 'resources/instructor/ExamQuestion';

import { ExamAnswer } from 'resources/instructor/ExamAnswer';
import { QuestionListItem } from './QuestionListItem';

type Props = {
    questions: ExamQuestion[],
    renderQuestionOptions?: (question: ExamQuestion) => ReactNode,
    renderAnswerOptions?: (answer: ExamAnswer) => ReactNode
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
