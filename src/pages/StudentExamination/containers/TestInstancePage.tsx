import { useRouteMatch } from 'react-router';

import { useResults, useTestInstance } from '@/hooks/student/QuizTestInstanceHooks';
import { TestResult } from '@/pages/StudentExamination/components/TestResults';
import { TestInstanceDetails } from '@/pages/StudentExamination/components/TestInstanceDetails';

type Params = {
    id?: string
}

export function TestInstancePage() {
    const { params } = useRouteMatch<Params>();
    const id = parseInt(params.id || '-1', 10);
    const testInstance = useTestInstance(id);
    const results = useResults(id, !!testInstance.data?.submitted);

    if (!testInstance.data) {
        return null;
    }

    return (
        <>
            <TestInstanceDetails testInstance={testInstance.data} />
            <hr />
            <TestResult results={results.data} />
        </>
    );
}
