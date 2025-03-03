import React, { ReactNode } from 'react';

import { QuizQuestion } from 'resources/instructor/QuizQuestion';
import {
    useAnswers,
} from 'hooks/instructor/QuizAnswerHooks';
import { QuizAnswer } from 'resources/instructor/QuizAnswer';
import { AnswerListItem } from './AnswerListItem';

type Props = {
    question: QuizQuestion,
    renderAnswerOptions?: (answer: QuizAnswer) => ReactNode
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
