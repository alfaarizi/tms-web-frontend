import React, { ReactNode } from 'react';

import { ExamQuestion } from 'resources/instructor/ExamQuestion';
import {
    useAnswers,
} from 'hooks/instructor/ExamAnswerHooks';
import { ExamAnswer } from 'resources/instructor/ExamAnswer';
import { AnswerListItem } from './AnswerListItem';

type Props = {
    question: ExamQuestion,
    renderAnswerOptions?: (answer: ExamAnswer) => ReactNode
}

export function AnswerList({
    question,
    renderAnswerOptions,
}: Props) {
    const answers = useAnswers(question.id);

    if (!answers.data) {
        return null;
    }

    return (
        <div className="pl-md-4">
            {answers.data.map((answer) => (
                <AnswerListItem
                    answer={answer}
                    key={answer.id}
                    renderAnswerOptions={renderAnswerOptions}
                />
            ))}
        </div>
    );
}
