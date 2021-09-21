import React from 'react';
import { TestResultQuestion } from 'pages/StudentExamination/components/TestResultQuestion';
import { ExamResultQuestion } from 'resources/student/ExamResultQuestion';

type Props = {
    results?: ExamResultQuestion[];
}

export function TestResult({ results }: Props) {
    return (
        <>
            {
                results?.map((question) => <TestResultQuestion key={question.questionID} question={question} />)
            }
        </>
    );
}
