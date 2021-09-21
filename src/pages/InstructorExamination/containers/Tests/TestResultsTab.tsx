import React from 'react';
import { ExamTest } from 'resources/instructor/ExamTest';
import { useExamTestInstances } from 'hooks/instructor/ExamTestInstaceHooks';
import { TestInstanceResultsList } from 'pages/InstructorExamination/components/Tests/TestInstanceResultsList';

type Props = {
    test: ExamTest
}

export function TestResultsTab({ test }: Props) {
    const instances = useExamTestInstances(test.id, true);

    if (!instances.data) {
        return null;
    }

    return <TestInstanceResultsList testInstances={instances.data} />;
}
