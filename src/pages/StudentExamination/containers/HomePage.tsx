import { Breadcrumb } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { useSelectedSemester } from '@/hooks/common/SemesterHooks';
import { useTestInstances } from '@/hooks/student/QuizTestInstanceHooks';
import { AvailableTestListItem } from '@/pages/StudentExamination/components/AvailableTestListItem';
import { FinishedTestListItem } from '@/pages/StudentExamination/components/FinishedTestListItem';
import { FutureTestListItem } from '@/pages/StudentExamination/components/FutureTestListItem';
import { TestList } from '@/pages/StudentExamination/components/TestList';

export function HomePage() {
    const { selectedSemesterID } = useSelectedSemester();
    const history = useHistory();
    const { t } = useTranslation();
    const semesterID = selectedSemesterID;
    const availableTests = useTestInstances(semesterID, false, false);
    const finishedTests = useTestInstances(semesterID, true, false);
    const futureTests = useTestInstances(semesterID, false, true);

    const handleClick = (id: number) => {
        history.push(`/student/quizzes/test-instances/${id}`);
    };

    return (
        <>
            <Breadcrumb>
                <LinkContainer to="/student/quizzes">
                    <Breadcrumb.Item active>{t('navbar.quizzes')}</Breadcrumb.Item>
                </LinkContainer>
            </Breadcrumb>
            <TestList
                title={t('quizTests.availableTests')}
                testInstances={availableTests.data}
                renderItem={(testInstance) => (
                    <AvailableTestListItem
                        testInstance={testInstance}
                        onClick={() => handleClick(testInstance.id)}
                    />
                )}
            />
            <TestList
                title={t('quizTests.futureTests')}
                testInstances={futureTests.data}
                renderItem={(testInstance) => (
                    <FutureTestListItem
                        testInstance={testInstance}
                    />
                )}
            />
            <TestList
                title={t('quizTests.finishedTests')}
                testInstances={finishedTests.data}
                renderItem={(testInstance) => (
                    <FinishedTestListItem
                        testInstance={testInstance}
                        onClick={() => handleClick(testInstance.id)}
                    />
                )}
            />
        </>
    );
}
