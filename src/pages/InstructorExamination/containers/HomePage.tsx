import { Breadcrumb } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { useSelectedSemester } from '@/hooks/common/SemesterHooks';
import { useQuestionSets } from '@/hooks/instructor/QuizQuestionSetHooks';
import { useTests } from '@/hooks/instructor/QuizTestHooks';
import { QuestionSetList } from '@/pages/InstructorExamination/components/QuestionSets/QuestionSetList';
import { TestList } from '@/pages/InstructorExamination/components/Tests/TestList';

export function HomePage() {
    const { url } = useRouteMatch();
    const history = useHistory();
    const { t } = useTranslation();

    const { selectedSemesterID } = useSelectedSemester();
    const sets = useQuestionSets();
    const tests = useTests(selectedSemesterID);

    const handleQuestionSetChange = (id: number) => {
        history.push(`${url}/question-sets/${id}`);
    };

    const handleNewClick = () => {
        history.push(`${url}/question-sets/new`);
    };

    const handleTestChange = (id: number) => {
        history.push(`${url}/tests/${id}`);
    };

    return (
        <>
            <Breadcrumb>
                <LinkContainer to="/instructor/quizzes">
                    <Breadcrumb.Item active>{t('navbar.quizzes')}</Breadcrumb.Item>
                </LinkContainer>
            </Breadcrumb>
            <QuestionSetList sets={sets.data} onChange={handleQuestionSetChange} onNew={handleNewClick} />
            <TestList tests={tests.data} onChange={handleTestChange} />
        </>
    );
}
