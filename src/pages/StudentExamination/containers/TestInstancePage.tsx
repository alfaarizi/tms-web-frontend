import { Breadcrumb } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { useResults, useTestInstance } from '@/hooks/student/QuizTestInstanceHooks';
import { TestInstanceDetails } from '@/pages/StudentExamination/components/TestInstanceDetails';
import { TestResult } from '@/pages/StudentExamination/components/TestResults';
import { StickyBreadcrumb } from '@/components/Header/StickyBreadcrumb';

type Params = {
    id?: string
}

export function TestInstancePage() {
    const { params } = useRouteMatch<Params>();
    const { t } = useTranslation();
    const id = parseInt(params.id || '-1', 10);
    const testInstance = useTestInstance(id);
    const results = useResults(id, !!testInstance.data?.submitted);

    if (!testInstance.data) {
        return null;
    }

    return (
        <>
            <StickyBreadcrumb>
                <LinkContainer to="/student/quizzes">
                    <Breadcrumb.Item>{t('navbar.quizzes')}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`/student/quizzes/test-instances/${id}`}>
                    <Breadcrumb.Item active>{testInstance.data.test.name}</Breadcrumb.Item>
                </LinkContainer>
            </StickyBreadcrumb>
            <TestInstanceDetails testInstance={testInstance.data} />
            <hr />
            <TestResult results={results.data} />
        </>
    );
}
