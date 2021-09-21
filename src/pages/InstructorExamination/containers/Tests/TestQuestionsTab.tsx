import React from 'react';
import { ExamTest } from 'resources/instructor/ExamTest';
import { useQuestionsForTest } from 'hooks/instructor/ExamQuestionHooks';
import { QuestionList } from 'pages/InstructorExamination/components/QuestionList/QuestionsList';

type Props = {
    test: ExamTest
}

export function TestQuestionsTab({ test }: Props) {
    const questions = useQuestionsForTest(true, test.id);

    if (!questions.data) {
        return null;
    }

    return <QuestionList questions={questions.data} />;
}
